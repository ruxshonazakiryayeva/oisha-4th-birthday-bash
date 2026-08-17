import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PARTY, T, type Lang } from "@/lib/invite-content";

export function RsvpForm({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("invitation_rsvp").insert({
      invitation: PARTY.invitationSlug,
      name: name.trim().slice(0, 100),
      attendance: attending ? "yes" : "no",
      guests: attending ? guests : 0,
      comment: message.trim().slice(0, 1000) || null,
    });
    setBusy(false);
    if (error) {
      toast.error(t.error);
      return;
    }
    toast.success(t.thanks);
    setDone(true);
  };

  if (done) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <Heart className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-4 font-display text-2xl text-foreground">{t.thanks}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.footer}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-5 sm:p-7">
      <label className="block text-sm font-semibold text-foreground">{t.yourName}</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.namePh}
        required
        maxLength={100}
        className="field mt-2"
      />

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className={`choice ${attending ? "choice-on" : ""}`}
        >
          {t.coming}
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className={`choice ${!attending ? "choice-on" : ""}`}
        >
          {t.notComing}
        </button>
      </div>

      {attending && (
        <div className="mt-5">
          <label className="block text-sm font-semibold text-foreground">{t.guests}</label>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="stepper"
              aria-label="-"
            >
              −
            </button>
            <span className="font-display w-10 text-center text-2xl text-foreground">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              className="stepper"
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <label className="block text-sm font-semibold text-foreground">{t.wish}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.wishPh}
          rows={3}
          maxLength={1000}
          className="field mt-2 resize-none"
        />
      </div>

      <button type="submit" disabled={busy} className="btn-magic mt-6 w-full">
        <Send className="h-4 w-4" />
        {busy ? t.sending : t.send}
      </button>
    </form>
  );
}
