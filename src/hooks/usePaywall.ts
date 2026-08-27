import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export type ActivationStatus = "none" | "pending" | "active" | "rejected";

export function usePaywall(slug: string) {
  const [status, setStatus] = useState<ActivationStatus>("none");
  const [viewCount, setViewCount] = useState(0);
  const [checked, setChecked] = useState(false);

  // Sahifa ochilganda ko'rishni +1 qilamiz (aktiv bo'lsa hisoblanmaydi)
  useEffect(() => {
    if (!slug) return;

    const run = async () => {
      const { data, error } = await supabase.rpc("increment_view", { p_slug: slug });
      if (!error && data && data[0]) {
        setStatus(data[0].status as ActivationStatus);
        setViewCount(data[0].view_count);
        // Markaziy kabinetda ham "Ko'rilgan" statistikasi to'g'ri ko'rinishi uchun
        supabase.functions
          .invoke("sync-view-count", { body: { slug, viewCount: data[0].view_count } })
          .catch((e) => console.error("sync-view-count xatosi", e));
      }
      setChecked(true);
    };
    run();
  }, [slug]);

  // Admin botda tasdiqlagan zahoti sahifa avtomatik ochilishi uchun
  useEffect(() => {
    if (!slug) return;
    const channel = supabase
      .channel(`activation-${slug}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "activations", filter: `slug=eq.${slug}` },
        (payload) => {
          setStatus(payload.new.status as ActivationStatus);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  const isLocked = checked && status !== "active" && viewCount > PAYMENT_CONFIG.freeViewLimit;

  return { status, viewCount, checked, isLocked, setStatus };
}
