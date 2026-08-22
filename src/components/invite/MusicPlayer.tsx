import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { T, type Lang } from "@/lib/invite-content";

export function MusicPlayer({ lang, youtubeId }: { lang: Lang; youtubeId: string }) {
  const t = T[lang];
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(id);
  }, []);

  const send = (func: string, args: unknown[] = []) => {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  };

  const toggle = () => {
    if (playing) {
      send("pauseVideo");
      setPlaying(false);
      return;
    }
    if (muted) {
      send("unMute");
      send("setVolume", [40]);
      setMuted(false);
    }
    send("playVideo");
    setPlaying(true);
  };

  if (!youtubeId) return null;

  return (
    <>
      {ready && (
        <iframe
          ref={frame}
          title="background music"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none fixed h-px w-px opacity-0"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&enablejsapi=1&playlist=${youtubeId}`}
          allow="autoplay"
        />
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={t.music}
        className="glass fixed right-4 top-4 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-transform hover:scale-105 active:scale-95"
      >
        {playing && !muted ? (
          <Pause className="h-4 w-4 text-primary" />
        ) : (
          <Play className="h-4 w-4 text-primary" />
        )}
        <span>{t.music}</span>
      </button>
    </>
  );
}
