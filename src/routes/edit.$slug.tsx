import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useInviteSettings } from "@/hooks/useInviteSettings";
import { MUSIC_PRESETS, extractYoutubeId } from "@/lib/music-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/edit/$slug")({
  component: EditForm,
});

function EditForm() {
  const { slug } = Route.useParams();
  const { settings, loading, reload } = useInviteSettings(slug);
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const save = async () => {
    setSaving(true);
    const eventDateWithTz = form.event_date.length === 16
      ? `${form.event_date}:00+05:00`
      : form.event_date;

    const { error } = await supabase.from("invitation_settings").upsert({
      slug: form.slug,
      child_name: form.child_name,
      age: form.age,
      event_date: eventDateWithTz,
      location_text: form.location_text,
      map_url: form.map_url,
      youtube_id: form.youtube_id,
      gallery_urls: form.gallery_urls,
      schedule_times: form.schedule_times,
    });

    setSaving(false);
    if (error) {
      toast.error("Saqlashda xatolik: " + error.message);
    } else {
      toast.success("Saqlandi!");
      setJustSaved(true);
      reload();
    }
  };

  const uploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("invitation-photos")
        .upload(path, file);

      if (uploadError) {
        toast.error("Yuklashda xatolik: " + uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from("invitation-photos").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    setForm((prev) => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...newUrls] }));
    setUploading(false);
  };

  const removePhoto = (url: string) => {
    setForm((prev) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((u) => u !== url),
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Yuklanmoqda...</div>;
  }

  const dateForInput = form.event_date ? form.event_date.slice(0, 16) : "";
  const inviteUrl = `${window.location.origin}/invite/${slug}`;

  return (
    <div className="mx-auto min-h-screen max-w-md space-y-4 bg-background px-4 py-8">
      <h1 className="text-xl font-bold">Taklifnomani tahrirlash</h1>

      {justSaved && (
        <div className="glass rounded-2xl p-4 text-center">
          <p className="mb-3 text-sm text-foreground">
            Saqlandi! Marhamat, linkka bosib taklifnomangizni ko'ring:
          </p>
          <Link
            to="/invite/$slug"
            params={{ slug }}
            target="_blank"
            className="btn-magic inline-flex w-full items-center justify-center"
          >
            Taklifnomangizni ko'ring
          </Link>
        </div>
      )}

      <div>
        <Label>Bolaning ismi</Label>
        <Input
          value={form.child_name}
          onChange={(e) => setForm({ ...form, child_name: e.target.value })}
        />
      </div>

      <div>
        <Label>Necha yoshga to'ladi</Label>
        <Input
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label>Sana va vaqt</Label>
        <Input
          type="datetime-local"
          value={dateForInput}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
        />
      </div>

      <div>
        <Label>Manzil (matn)</Label>
        <Input
          value={form.location_text}
          onChange={(e) => setForm({ ...form, location_text: e.target.value })}
        />
      </div>

      <div>
        <Label>Xarita havolasi</Label>
        <Input
          value={form.map_url ?? ""}
          onChange={(e) => setForm({ ...form, map_url: e.target.value })}
        />
      </div>

      <div>
        <Label>Musiqa</Label>
        <p className="mb-2 text-xs text-muted-foreground">
          Tayyor treklardan birini tanlang yoki o'z YouTube havolangizni joylashtiring
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setForm({ ...form, youtube_id: preset.id })}
              className={`rounded-xl border p-2 text-left text-xs transition-colors ${
                form.youtube_id === preset.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Label className="text-xs">Yoki YouTube havolasini joylashtiring</Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            onChange={(e) => {
              const id = extractYoutubeId(e.target.value);
              if (id) setForm({ ...form, youtube_id: id });
            }}
          />
          {form.youtube_id && (
            <p className="mt-1 text-xs text-muted-foreground">
              Tanlangan trek ID: {form.youtube_id}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Bayram dasturi (soatlari)</Label>
        <p className="mb-2 text-xs text-muted-foreground">
          Mehmon kutib olish, o'yinlar, dasturxon, tort, musiqa, surat — shu tartibda
        </p>
        <div className="space-y-2">
          {[
            "Mehmonlarni kutib olish",
            "Qiziqarli o'yinlar",
            "Bayram dasturxoni",
            "Tort kesish",
            "Musiqa va o'yinlar",
            "Esdalik uchun suratga tushish",
          ].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                type="time"
                value={form.schedule_times[i] ?? ""}
                onChange={(e) => {
                  const next = [...form.schedule_times];
                  next[i] = e.target.value;
                  setForm({ ...form, schedule_times: next });
                }}
                className="w-28 shrink-0"
              />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Galereya rasmlari</Label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => uploadPhotos(e.target.files)}
          disabled={uploading}
          className="mt-1 block w-full text-sm"
        />
        {uploading && <p className="mt-1 text-xs text-muted-foreground">Yuklanmoqda...</p>}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {form.gallery_urls.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={save} disabled={saving}>
        {saving ? "Saqlanmoqda..." : "Saqlash"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Bu havolani saqlab qo'ying — keyinroq qaytib tahrirlash uchun kerak bo'ladi:
        <br />
        <span className="break-all font-mono">{window.location.href}</span>
      </p>
    </div>
  );
}
