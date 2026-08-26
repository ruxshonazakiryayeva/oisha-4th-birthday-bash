import { Lock } from "lucide-react";
import type { ActivationStatus } from "@/hooks/usePaywall";

// Endi to'lov/chek yuklash bevosita shu yerda emas — hammasi markaziy
// "Mening kabinetim" orqali (Faollashtirish tugmasi) boshqariladi.
const KABINET_URL = "https://webinvite-six.vercel.app/kabinet";

export function Paywall({ status }: { slug: string; status: ActivationStatus; onSubmitted: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm">
      <div className="glass w-full max-w-sm rounded-3xl p-6 text-center">
        <Lock className="mx-auto h-10 w-10 text-primary" />
        <h2 className="font-display mt-3 text-2xl text-foreground">Bepul ko'rishlar tugadi</h2>

        {status === "pending" ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Chekingiz ko'rib chiqilmoqda. Tasdiqlangach sahifa avtomatik ochiladi.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Cheksiz ko'rish uchun taklifnomani faollashtiring. Ko'rish uchun{" "}
            <strong>"Mening taklifnomalarim"</strong> sahifasiga o'ting.
          </p>
        )}

        <a
          href={KABINET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-magic mt-5 flex w-full items-center justify-center"
        >
          Mening taklifnomalarim sahifasiga o'tish
        </a>
      </div>
    </div>
  );
}
