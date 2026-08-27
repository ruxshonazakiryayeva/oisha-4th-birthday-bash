import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Send, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInviteSettings } from "@/hooks/useInviteSettings";
import { MUSIC_PRESETS, extractYoutubeId } from "@/lib/music-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callWebinviteFn } from "@/lib/webinviteApi";

export const Route = createFileRoute("/edit/$slug")({
  component: EditGate,
});

const STORAGE_KEY = "webinvite_login_code";

function LoginGate({ onConfirmed }: { onConfirmed: (code: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLogin = async () => {
    setLoading(true);
    try {
      const { code, deepLink } = await callWebinviteFn<{ code: string; deepLink: string }>("login-start");
      localStorage.setItem(STORAGE_KEY, code);
      setDeepLink(deepLink);
      window.open(deepLink, "_blank", "noopener,noreferrer");

      pollRef.current = setInterval(async () => {
        const res = await callWebinviteFn<{ status: string }>("my-invitations", { code });
        if (res.status === "confirmed") {
          if (pollRef.current) clearInterval(pollRef.current);
          onConfirmed(code);
        }
      }, 2000);
    } catch (e) {
      console.error(e);
      toast.error("Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold text-foreground">Tahrirlash uchun kiring</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Taklifnomani tahrirlash uchun avval Telegram botimiz orqali ro'yxatdan o'ting.
        Bu — sizning taklifnomangiz "Mening taklifnomalarim" bo'limida ko'rinishi uchun kerak.
      </p>

      <button
        type="button"
        onClick={startLogin}
        disabled={loading}
        className="btn-magic mt-6 flex w-full items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Telegram orqali kirish
      </button>

      {deepLink && (
        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Botda tasdiqlang — sahifa avtomatik ochiladi.</p>
          <a href={deepLink} target="_blank" rel="noopener noreferrer" className="underline">
            Bot ochilmadimi? Shu yerni bosing
          </a>
        </div>
      )}
    </div>
  );
}

function EditGate() {
  const { slug } = Route.useParams();
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = async (code: string) => {
    setChecking(true);
    setError(null);
    try {
      const res = await callWebinviteFn<{ ok: boolean; status: string }>("claim-oisha-invitation", { code, slug });
      if (res.status === "active") {
        setLocked(true);
      } else {
        setReady(true);
      }
    } catch (e: any) {
      console.error(e);
      const msg = String(e?.message || e);
      if (msg.includes("boshqa foydalanuvchiga")) {
        setError("Bu taklifnoma boshqa foydalanuvchiga tegishli — tahrirlash huquqingiz yo'q.");
      } else {
        setError("Xatolik yuz berdi, qayta urinib ko'ring.");
      }
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Kabinetdan "Tahrir" bosilganda ?code=... orqali sessiya uzatiladi —
    // shunda qayta login so'ralmaydi
    const urlCode = new URLSearchParams(window.location.search).get("code");
    if (urlCode) {
      localStorage.setItem(STORAGE_KEY, urlCode);
      claim(urlCode);
      // URL'ni tozalaymiz, kod manzil satrida ko'rinib qolmasin
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      claim(saved);
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <Lock className="h-10 w-10 text-primary" />
        <h1 className="mt-3 text-xl font-bold text-foreground">Taklifnoma faollashtirilgan</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Faollashgan taklifnomalarni endi tahrirlab bo'lmaydi — bu qoida noto'g'ri
          foydalanishning oldini olish uchun kiritilgan (masalan, bitta sotib olingan
          taklifnomani qayta-qayta boshqa tadbirlar uchun ishlatish).
        </p>
        <Link
          to="/invite/$slug"
          params={{ slug }}
          className="btn-magic mt-6 inline-flex items-center justify-center"
        >
          Taklifnomani ko'rish
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <LoginGate onConfirmed={(code) => claim(code)} />;
  }

  return <EditForm slug={slug} />;
}

function EditForm({ slug }: { slug: string }) {
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
      // Kabinetda ham yangi ism/sana ko'rinishi uchun markaziy jadvalni sinxronlaymiz
      callWebinviteFn("sync-oisha-invitation", {
        slug: form.slug,
        childName: form.child_name,
        eventDate: eventDateWithTz,
      }).catch((e) => console.error("Sync xatosi", e));
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
