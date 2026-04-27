export type Lang = "kk" | "ru" | "en";

export const DEFAULT_LANG: Lang = "kk";

export type Tri = { kk: string; ru: string; en: string };

export const t = {
  brand: { kk: "zan.kz", ru: "zan.kz", en: "zan.kz" },
  tagline: {
    kk: "Қазақстан заңдарын жылдам, анық және дауыспен түсіндіретін AI-кеңесші",
    ru: "ИИ-консультант, который быстро и ясно объясняет законы Казахстана — голосом и текстом",
    en: "An AI assistant that explains Kazakhstan law quickly and clearly — by voice or text."
  },
  disclaimer: {
    kk: "Бұл жүйе ресми заң кеңесі емес. Ақпарат тек анықтамалық мақсатта беріледі.",
    ru: "Эта система не является официальной юридической консультацией. Информация предоставляется только в справочных целях.",
    en: "This system is not an official legal consultation. Information is provided for reference only."
  },
  nav: {
    chat:   { kk: "Чат",          ru: "Чат",              en: "Chat" },
    judge:  { kk: "Судья режимі", ru: "Режим судьи",      en: "Judge mode" },
    reform: { kk: "Zan-Reform",   ru: "Zan-Reform",       en: "Zan-Reform" },
    doc:    { kk: "Құжат талдау", ru: "Анализ документа", en: "Doc analysis" },
    court:  { kk: "Сот жүйесі",   ru: "Судебная система", en: "Court system" }
  },
  cta: {
    start:   { kk: "Бастау",          ru: "Начать",          en: "Start" },
    ask:     { kk: "Сұрақ қою",       ru: "Задать вопрос",   en: "Ask" },
    speak:   { kk: "Дауыспен сөйлеу", ru: "Говорить голосом",en: "Speak" },
    panic:   { kk: "SOS",             ru: "SOS",             en: "SOS" },
    learn:   { kk: "Қосымша",         ru: "Подробнее",       en: "Learn more" }
  },
  hero: {
    pill:    { kk: "Қазақстан азаматтарына арналған", ru: "Для граждан Казахстана", en: "Built for Kazakhstan's citizens" },
    title1:  { kk: "Заңды білу — ",   ru: "Знать закон —",   en: "Know the law —" },
    title2:  { kk: "құқықты қорғау.", ru: "защищать права.", en: "protect your rights." },
    subtitle: {
      kk: "Полиция тоқтатты ма? Құжатқа қол қою керек пе? Сотқа шақырылдыңыз ба? zan.kz бір минутта түсіндіреді.",
      ru: "Остановила полиция? Нужно подписать документ? Вызвали в суд? zan.kz объяснит за минуту.",
      en: "Were you stopped by police? Need to sign a document? Summoned to court? zan.kz explains it in a minute."
    }
  },
  panic: {
    title: {
      kk: "Дабыл жіберілді (демо)",
      ru: "Тревога отправлена (демо)",
      en: "Alert sent (demo)"
    },
    body: {
      kk: "Геолокация және сіздің жағдайыңыз сенімді контактілерге жіберілген болар еді. Бұл MVP-дағы мокап.",
      ru: "Ваша геолокация и ситуация были бы отправлены доверенным контактам. Это мокап MVP.",
      en: "Your geolocation and situation would be sent to trusted contacts. This is an MVP mock."
    }
  }
};

export function pick<T extends Record<Lang, string>>(obj: T, lang: Lang) {
  return obj[lang] ?? obj.kk;
}
