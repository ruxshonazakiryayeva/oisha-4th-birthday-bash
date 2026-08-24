import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PAYMENT_CONFIG } from "@/lib/payment-config";
import type { ActivationStatus } from "@/hooks/usePaywall";

export function Paywall({
  slug,
  status,
  onSubmitted,
}: {
  slug: string;
  status: ActivationStatus;
  onSubmitted: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  const copyCard = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.cardNumber.replace(/\s/g, ""));
    toast.success("Karta raqami nusxalandi");
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${slug}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("payment-receipts").getPublicUrl(path);

      const { error: fnError } = await supabase.functions.invoke("submit-payment", {
        body: { slug, receiptUrl: data.publicUrl },
      });
      if (fnError) throw fnError;

      toast.success("Chek yuborildi, tasdiqlanishini kuting");
      onSubmitted();
    } catch (err) {
      toast.error("Xatolik yuz berdi, qayta urinib ko'ring");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm">
      <div className="glass w-full max-w-sm rounded-3xl p-6 text-center">
        <h2 className="font-display text-2xl text-foreground">Taklifnomani faollashtiring</h2>

        {status === "pending" ? (
          <div className="mt-4 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Chekingiz ko'rib chiqilmoqda. Tasdiqlangach sahifa avtomatik ochiladi.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Bepul ko'rishlar tugadi. Cheksiz ko'rish uchun to'lovni amalga oshiring:
            </p>

            <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Summa</p>
              <p className="font-display text-2xl text-foreground">{PAYMENT_CONFIG.price}</p>

              <button
                type="button"
                onClick={copyCard}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-background/60 px-3 py-2 text-sm font-medium text-foreground"
              >
                {PAYMENT_CONFIG.cardNumber}
                <Copy className="h-4 w-4" />
              </button>
              <p className="mt-1 text-xs text-muted-foreground">{PAYMENT_CONFIG.cardOwner}</p>
            </div>

            {status === "rejected" && (
              <p className="mt-3 text-sm text-destructive">
                Oldingi chek rad etildi. Iltimos, to'g'ri chek rasmini qayta yuklang.
              </p>
            )}

            <label className="btn-magic mt-5 flex w-full cursor-pointer items-center justify-center">
              {uploading ? "Yuklanmoqda..." : "Chek rasmini yuklash"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
