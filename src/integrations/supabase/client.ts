import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// O'zingizning Supabase loyihangizdan oling: Project Settings -> API
//   - Project URL              -> VITE_SUPABASE_URL
//   - anon / publishable key   -> VITE_SUPABASE_ANON_KEY
// Bu qiymatlarni lokalda .env fayliga, Vercel'da esa
// Settings -> Environment Variables bo'limiga qo'shing.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "[Supabase] VITE_SUPABASE_URL yoki VITE_SUPABASE_ANON_KEY topilmadi. " +
      ".env fayliga yoki Vercel Environment Variables'ga qo'shing.",
  );
}

// Yangi turdagi Supabase kalitlari (sb_publishable_... / sb_secret_...) JWT emas,
// shuning uchun ular uchun Authorization: Bearer sarlavhasini olib tashlash kerak
// (faqat apikey sarlavhasi yetarli).
function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: createSupabaseFetch(SUPABASE_ANON_KEY),
  },
});
