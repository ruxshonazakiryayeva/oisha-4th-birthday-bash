export type MusicPreset = {
  id: string;
  label: string;
};

// Barchasi mualliflik huquqisiz (no-copyright), tug'ilgan kun uchun mos treklar
export const MUSIC_PRESETS: MusicPreset[] = [
  { id: "GRKSqxWDqwY", label: "Quvnoq — Perfect Birthday" },
  { id: "O1nHwyigtmM", label: "Yengil — Birthday FCM" },
  { id: "KSZ-1aAXxuA", label: "Sokin — Birthday LiQWYD" },
  { id: "rEMvkxvQF7U", label: "Bayramona — Celebration" },
];

// YouTube havolasidan video ID ajratib olish
// Qo'llab-quvvatlaydi: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Agar allaqachon 11 belgili ID bo'lsa (havola emas), shuni qaytaramiz
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }

  return null;
}
