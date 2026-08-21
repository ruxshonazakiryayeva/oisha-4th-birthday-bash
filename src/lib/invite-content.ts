export const PARTY = {
  name: "Oisha",
  age: 4,
  // Bu shablonni invitation_rsvp jadvalidagi boshqa yozuvlardan ajratib turadigan noyob slug
  invitationSlug: "oisha-4-birthday",
  // 3 February 2027, 15:00
  date: new Date("2027-02-03T15:00:00+05:00"),
  mapUrl: "https://share.google/4bQlX6U21ory5SUu8",
  // Background music: YouTube video id
  youtubeId: "ck_j5cPBCLQ",
  adminPin: "1317",
};

export type Lang = "uz" | "ru" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

type Dict = {
  invitation: string;
  heroTitle: string;
  heroSub: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  whenWhere: string;
  dateText: string;
  timeText: string;
  place: string;
  placeText: string;
  mapBtn: string;
  mapSoon: string;
  gallery: string;
  gallerySub: string;
  rsvp: string;
  rsvpSub: string;
  yourName: string;
  namePh: string;
  coming: string;
  notComing: string;
  guests: string;
  wish: string;
  wishPh: string;
  send: string;
  sending: string;
  thanks: string;
  error: string;
  music: string;
  pin: string;
  pinPh: string;
  open: string;
  wrongPin: string;
  guestList: string;
  totalYes: string;
  totalGuests: string;
  empty: string;
  footer: string;
  schedule: string;
  scheduleSub: string;
  scheduleItems: { time: string; title: string }[];
};

export const T: Record<Lang, Dict> = {
  uz: {
    invitation: "Taklifnoma",
    heroTitle: "Oisha 4 yoshga to'ladi!",
    heroSub: "Sehrli malika bayramiga sizni chin dildan kutamiz",
    days: "kun",
    hours: "soat",
    minutes: "daqiqa",
    seconds: "soniya",
    whenWhere: "Qachon va qayerda",
    dateText: "2027-yil 3-fevral",
    timeText: "15:00 da",
    place: "Manzil",
    placeText: "Guliston shahar, Saxovat savdo markazi, 3-etaj bo'lalar maydonchasi",
    mapBtn: "Xaritada ko'rish",
    mapSoon: "Xarita havolasi tez orada",
    gallery: "Qizalog'imizning eng yorqin lahzalari",
    gallerySub: "Eng shirin lahzalar",
    rsvp: "Kelishingizni tasdiqlang",
    rsvpSub: "Iltimos, bir necha so'z yozib qoldiring",
    yourName: "Ismingiz",
    namePh: "Ism va familiya",
    coming: "Kelaman",
    notComing: "Kelolmayman",
    guests: "Mehmonlar soni",
    wish: "Tabrik xati",
    wishPh: "Qizalog'imizga tilaklaringiz...",
    send: "Yuborish",
    sending: "Yuborilmoqda...",
    thanks: "Rahmat! Javobingiz qabul qilindi.",
    error: "Xatolik yuz berdi. Yana urinib ko'ring.",
    music: "Musiqa",
    pin: "Parol",
    pinPh: "Parolni kiriting",
    open: "Ochish",
    wrongPin: "Parol xato",
    guestList: "Mehmonlar ro'yxati",
    totalYes: "Tasdiqlagan",
    totalGuests: "Jami mehmon",
    empty: "Hozircha javoblar yo'q",
    footer: "Sizni kutamiz!",
    schedule: "Bayram dasturi",
    scheduleSub: "Kun davomida bizni nima kutmoqda",
    scheduleItems: [
      { time: "16:00", title: "Mehmonlarni kutib olish" },
      { time: "16:30", title: "Qiziqarli o'yinlar" },
      { time: "17:30", title: "Bayram dasturxoni" },
      { time: "18:00", title: "Tort kesish" },
      { time: "18:20", title: "Musiqa va o'yinlar" },
      { time: "19:00", title: "Esdalik uchun suratga tushish" },
    ],
  },
  ru: {
    invitation: "Приглашение",
    heroTitle: "Оише 4 года!",
    heroSub: "Приглашаем вас на волшебный праздник маленькой принцессы",
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
    whenWhere: "Когда и где",
    dateText: "3 февраля 2027 года",
    timeText: "в 15:00",
    place: "Адрес",
    placeText: "г. Гулистан, ТЦ «Сховат», 3-й этаж, детская площадка",
    mapBtn: "Смотреть на карте",
    mapSoon: "Ссылка на карту скоро появится",
    gallery: "Самые светлые моменты в жизни нашей дочери",
    gallerySub: "Самые милые моменты",
    rsvp: "Подтвердите участие",
    rsvpSub: "Пожалуйста, оставьте пару слов",
    yourName: "Ваше имя",
    namePh: "Имя и фамилия",
    coming: "Приду",
    notComing: "Не смогу",
    guests: "Количество гостей",
    wish: "Поздравление",
    wishPh: "Наилучшие пожелания нашей дочери...",
    send: "Отправить",
    sending: "Отправляем...",
    thanks: "Спасибо! Ваш ответ получен.",
    error: "Произошла ошибка. Попробуйте снова.",
    music: "Музыка",
    pin: "Пароль",
    pinPh: "Введите пароль",
    open: "Открыть",
    wrongPin: "Неверный пароль",
    guestList: "Список гостей",
    totalYes: "Подтвердили",
    totalGuests: "Всего гостей",
    empty: "Пока нет ответов",
    footer: "Ждём вас!",
    schedule: "Программа праздника",
    scheduleSub: "Что нас ждёт в течение дня",
    scheduleItems: [
      { time: "16:00", title: "Встреча гостей" },
      { time: "16:30", title: "Весёлые игры" },
      { time: "17:30", title: "Праздничный стол" },
      { time: "18:00", title: "Разрезание торта" },
      { time: "18:20", title: "Музыка и танцы" },
      { time: "19:00", title: "Памятное фото" },
    ],
  },
  en: {
    invitation: "Invitation",
    heroTitle: "Oisha turns 4!",
    heroSub: "You are warmly invited to a magical little princess party",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    whenWhere: "When & where",
    dateText: "February 3, 2027",
    timeText: "at 3:00 PM",
    place: "Address",
    placeText: "Guliston city, Sxovat shopping mall, 3rd floor, kids playground",
    mapBtn: "View on map",
    mapSoon: "Map link coming soon",
    gallery: "Our daughter's brightest moments",
    gallerySub: "The sweetest moments",
    rsvp: "Please RSVP",
    rsvpSub: "Leave us a few words",
    yourName: "Your name",
    namePh: "First and last name",
    coming: "I'll be there",
    notComing: "Can't make it",
    guests: "Number of guests",
    wish: "Birthday wish",
    wishPh: "Best wishes to our daughter....",
    send: "Send",
    sending: "Sending...",
    thanks: "Thank you! Your reply was received.",
    error: "Something went wrong. Please try again.",
    music: "Music",
    pin: "Password",
    pinPh: "Enter password",
    open: "Open",
    wrongPin: "Wrong password",
    guestList: "Guest list",
    totalYes: "Confirmed",
    totalGuests: "Total guests",
    empty: "No replies yet",
    footer: "See you there!",
    schedule: "Party schedule",
    scheduleSub: "What awaits us during the day",
    scheduleItems: [
      { time: "4:00 PM", title: "Welcoming guests" },
      { time: "4:30 PM", title: "Fun games" },
      { time: "5:30 PM", title: "Festive table" },
      { time: "6:00 PM", title: "Cake cutting" },
      { time: "6:20 PM", title: "Music & dancing" },
      { time: "7:00 PM", title: "Memory photos" },
    ],
  },
};
