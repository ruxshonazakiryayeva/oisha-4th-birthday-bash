import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PARTY } from "@/lib/invite-content";

export const Route = createFileRoute("/edit/")({
  component: EditEntry,
});

function makeSlug() {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `oisha-${time}${rand}`;
}

function EditEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    const createAndGo = async () => {
      const slug = makeSlug();

      await supabase.from("invitation_settings").insert({
        slug,
        child_name: PARTY.name,
        age: PARTY.age,
        event_date: PARTY.date.toISOString(),
        location_text: "",
        map_url: PARTY.mapUrl,
        youtube_id: PARTY.youtubeId,
      });

      navigate({ to: "/edit/$slug", params: { slug }, replace: true });
    };

    createAndGo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <p className="text-muted-foreground">Tayyorlanmoqda...</p>
    </div>
  );
}
