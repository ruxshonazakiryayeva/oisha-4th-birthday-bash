import type { Lang } from "@/lib/invite-content";

const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDateText(date: Date, lang: Lang): string {
  const day = date.getDate();
  const year = date.getFullYear();

  if (lang === "ru") {
    return `${day} ${RU_MONTHS[date.getMonth()]} ${year} года`;
  }
  if (lang === "en") {
    return `${EN_MONTHS[date.getMonth()]} ${day}, ${year}`;
  }
  return `${year}-yil ${day}-${UZ_MONTHS[date.getMonth()]}`;
}

export function formatTimeText(date: Date, lang: Lang): string {
  const h24 = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");

  if (lang === "en") {
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `at ${h12}:${m} ${period}`;
  }

  const hh = h24.toString().padStart(2, "0");
  if (lang === "ru") return `в ${hh}:${m}`;
  return `${hh}:${m} da`;
}
