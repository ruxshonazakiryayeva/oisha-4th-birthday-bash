import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PARTY } from "@/lib/invite-content";
import { useInviteSettings } from "@/hooks/useInviteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/edit")({
  component: EditPage,
});

function EditPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="glass w-full max-w-xs rounded-2xl p-6 text-center">
          <h1 className="mb-4 text-lg font-bold">Tahrirlash — Parol</h1>
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Parolni kiriting"
            className="mb-3"
          />
          <Button
            className="w-full"
            onClick={() => {
              if (pin === PARTY.adminPin) setUnlocked(true);
              else toast.error("Parol xato");
            }}
          >
            Ochish
          </Button>
        </div>
      </div>
    );
  }

  return <EditForm />;
}

function EditForm() {
  const { settings, loading, reload } = useInviteSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("invitation_settings").upsert({
      slug: form.slug,
      child_name: form.child_name,
      age: form.age,
      event_date: form.event_date,
      location_text: form.location_text,
      map_url: form.map_url,
      youtube_id: form.youtube_id,
      gallery_urls: form.gallery_urls,
    });
    setSaving(false);
    if (error) {
      toast.error("Saqlashda xatolik: " + error.message);
    } else {
      toast.success("Saqlandi!");
      reload();
    }
  };

    const uploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${form.slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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

  return (
    <div className="mx-auto min-h-screen max-w-md space-y-4 bg-background px-4 py-8">
      <h1 className="text-xl font-bold">Taklifnomani tahrirlash</h1>

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
        <Label>YouTube video ID (musiqa)</Label>
        <Input
          value={form.youtube_id ?? ""}
          onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
        />
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
    </div>
  );
}
