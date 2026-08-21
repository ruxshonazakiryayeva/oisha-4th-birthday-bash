import { useEffect, useState } from "react";
import { T, type Lang } from "@/lib/invite-content";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ lang, date }: { lang: Lang; date: Date }) {
  const t = T[lang];
  const [left, setLeft] = useState(() => date.getTime() - Date.now());

  useEffect(() => {
    setLeft(date.getTime() - Date.now());
    const id = setInterval(() => setLeft(date.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [date]);

  const p = parts(left);
  const cells = [
    { v: p.d, l: t.days },
    { v: p.h, l: t.hours },
    { v: p.m, l: t.minutes },
    { v: p.s, l: t.seconds },
  ];

  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div key={c.l} className="glass rounded-2xl px-1 py-3 text-center sm:py-4">
          <div className="font-display text-2xl leading-none text-foreground sm:text-4xl">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}
