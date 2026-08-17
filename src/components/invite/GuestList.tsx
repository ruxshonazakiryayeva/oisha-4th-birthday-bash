import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KeyRound, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PARTY, T, type Lang } from "@/lib/invite-content";

type Rsvp = {
  id: string;
  name: string;
  attendance: string;
  guests: number;
  comment: string | null;
  created_at: string;
};

function Panel({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { data, isLoading } = useQuery({
    queryKey: ["rsvps", PARTY.invitationSlug],
    queryFn: async (): Promise<Rsvp[]> => {
      const { data, error } = await supabase
        .from("invitation_rsvp")
        .select("id, name, attendance, guests, comment, created_at")
        .eq("invitation", PARTY.invitationSlug)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Rsvp[];
    },
  });

  const yes = (data ?? []).filter((r) => r.attendance === "yes");
  const totalGuests = yes.reduce((n, r) => n + (r.guests || 0), 0);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="font-display text-3xl text-foreground">{yes.length}</div>
          <div className="text-xs text-muted-foreground">{t.totalYes}</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="font-display text-3xl text-foreground">{totalGuests}</div>
          <div className="text-xs text-muted-foreground">{t.totalGuests}</div>
        </div>
      </div>

      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {isLoading && <p className="text-sm text-muted-foreground">…</p>}
        {!isLoading && (data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        )}
        {(data ?? []).map((r) => (
          <div key={r.id} className="rounded-2xl border border-border/60 bg-card/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-foreground">{r.name}</span>
              <span
                className={`text-xs ${r.attendance === "yes" ? "text-primary" : "text-muted-foreground"}`}
              >
                {r.attendance === "yes" ? `${t.coming} · ${r.guests}` : t.notComing}
              </span>
            </div>
            {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuestList({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.guestList}
        className="glass fixed bottom-20 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full shadow-soft transition-transform hover:scale-110"
      >
        <KeyRound className="h-5 w-5 text-gold" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="glass animate-scale-in w-full max-w-md rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-foreground">{t.guestList}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="close"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {ok ? (
              <Panel lang={lang} />
            ) : (
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pin === PARTY.adminPin) {
                    setOk(true);
                    setErr(false);
                  } else {
                    setErr(true);
                  }
                }}
              >
                <label className="block text-sm font-semibold text-foreground">{t.pin}</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={t.pinPh}
                  className="field mt-2 text-center tracking-[0.4em]"
                />
                {err && <p className="mt-2 text-sm text-destructive">{t.wrongPin}</p>}
                <button type="submit" className="btn-magic mt-4 w-full">
                  {t.open}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
