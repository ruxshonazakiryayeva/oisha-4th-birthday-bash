import { Cake, Camera, DoorOpen, Music2, PartyPopper, UtensilsCrossed } from "lucide-react";
import { T, type Lang } from "@/lib/invite-content";

const ICONS = [DoorOpen, PartyPopper, UtensilsCrossed, Cake, Music2, Camera];

export function Schedule({ lang, times }: { lang: Lang; times?: string[] }) {
  const t = T[lang];

  return (
    <ol className="mt-5 space-y-3">
      {t.scheduleItems.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        const time = times?.[i] || item.time;
        return (
          <li key={i} className="glass flex items-center gap-4 rounded-2xl p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg leading-none text-foreground">{time}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{item.title}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
