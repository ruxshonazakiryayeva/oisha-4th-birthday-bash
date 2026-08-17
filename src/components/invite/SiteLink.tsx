const WEBINVITE_URL = "https://webinvite-six.vercel.app/";

export function SiteLink() {
  return (
    <a
      href={WEBINVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WebInvite"
      className="glass fixed bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full text-[11px] font-bold text-primary shadow-soft transition-transform hover:scale-110"
    >
      WI
    </a>
  );
}
