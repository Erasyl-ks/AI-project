"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  Gavel,
  FileSearch,
  Sparkles,
  Mic,
  Shield,
  Building2,
  Languages,
  CheckCircle2,
  Scale
} from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLang } from "@/components/LangProvider";
import { t } from "@/lib/i18n";

export default function LandingPage() {
  const { lang } = useLang();

  const features = [
    {
      href: "/chat",
      icon: MessageSquare,
      title: { kk: "AI-чат", ru: "AI-чат", en: "AI chat" },
      desc: {
        kk: "Заңды қазақша немесе орысша, дауыспен сұрау.",
        ru: "Задавай вопросы голосом, получай ясный ответ.",
        en: "Ask legal questions by text or voice, get a clear answer."
      }
    },
    {
      href: "/judge",
      icon: Gavel,
      title: { kk: "Судья режимі", ru: "Режим судьи", en: "Judge mode" },
      desc: {
        kk: "Жағдайды екі жақтан талдап, ықтимал нәтижені көрсетеді.",
        ru: "Анализ обеих сторон и вероятного исхода дела.",
        en: "Analyzes both sides and shows the likely outcome."
      }
    },
    {
      href: "/court",
      icon: Building2,
      title: { kk: "Сот жүйесі", ru: "Судебная система", en: "Court system" },
      desc: {
        kk: "Сот сатылары, талап қою, апелляция, кассация — түсіндірмелі.",
        ru: "Инстанции, подача иска, апелляция, кассация — понятно.",
        en: "Court instances, filing claims, appeals, cassation — explained."
      }
    },
    {
      href: "/document",
      icon: FileSearch,
      title: { kk: "Құжат талдау", ru: "Анализ документа", en: "Document analysis" },
      desc: {
        kk: "Шартты, айыппұлды, шақыруды 30 секундта түсіндіреді.",
        ru: "Договор, штраф, повестку — разбор за 30 секунд.",
        en: "Contract, fine, subpoena — breakdown in 30 seconds."
      }
    },
    {
      href: "/reform",
      icon: Sparkles,
      title: { kk: "Zan-Reform", ru: "Zan-Reform", en: "Zan-Reform" },
      desc: {
        kk: "Заңның әлсіз жерлерін анықтап, реформа ұсынады.",
        ru: "Находит слабые места в законах и предлагает реформы.",
        en: "Finds weak spots in the law and proposes reforms."
      }
    },
    {
      href: "/chat?mode=scenario",
      icon: Shield,
      title: { kk: "Нақты жағдай", ru: "Реальная ситуация", en: "Real situation" },
      desc: {
        kk: "«Полиция тоқтатты» — құқықтарыңды 10 секундта біл.",
        ru: "«Полиция остановила» — узнай свои права за 10 секунд.",
        en: "\"Stopped by police\" — know your rights in 10 seconds."
      }
    }
  ];

  return (
    <div className="hero-bg">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="container-zan relative pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zan-600" />
            {t.hero.pill[lang]}
          </motion.span>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-zan-ink md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="block"
            >
              {t.hero.title1[lang]}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="block text-zan-600"
            >
              {t.hero.title2[lang]}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 max-w-2xl text-lg text-zan-ink/70"
          >
            {t.hero.subtitle[lang]}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/chat" className="btn-primary">
              <MessageSquare size={16} />
              {t.cta.start[lang]}
              <ArrowRight size={16} className="-mr-1" />
            </Link>
            <Link href="/judge" className="btn-ghost">
              <Gavel size={16} />
              {lang === "kk" ? "Судья режимі" : lang === "ru" ? "Режим судьи" : "Judge mode"}
            </Link>
            <Link href="/court" className="btn-ghost">
              <Building2 size={16} />
              {lang === "kk" ? "Сот жүйесі" : lang === "ru" ? "Судебная система" : "Court system"}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zan-ink/60"
          >
            <span className="inline-flex items-center gap-1.5">
              <Mic size={12} className="text-zan-600" /> {lang === "kk" ? "Дауыс" : lang === "ru" ? "Голос" : "Voice"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Languages size={12} className="text-zan-600" /> ҚАЗ · РУС · ENG
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield size={12} className="text-zan-600" /> {lang === "kk" ? "Құпиялық" : lang === "ru" ? "Конфиденциально" : "Confidential"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-zan-600" /> 24/7
            </span>
          </motion.div>

          {/* HERO CARD — fake chat preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative mt-14 rounded-3xl border border-zan-600/10 bg-white/80 p-4 shadow-soft backdrop-blur md:p-6"
          >
            <div className="grid gap-4 md:grid-cols-5">
              <div className="md:col-span-3">
                <div className="mb-3 flex items-center gap-2 text-xs text-zan-ink/60">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === "kk" ? "Тікелей режим" : lang === "ru" ? "Онлайн-режим" : "Live mode"}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl bg-zan-600 px-4 py-2.5 text-sm text-white">
                      {lang === "kk"
                        ? "Полиция тоқтатты. Не істеуім керек?"
                        : lang === "ru"
                        ? "Меня остановила полиция. Что делать?"
                        : "The police stopped me. What should I do?"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zan-600 text-white">
                      <Scale size={14} />
                    </div>
                    <div className="max-w-[80%] rounded-2xl border border-zan-600/10 bg-white px-4 py-3 text-sm text-zan-ink">
                      <strong className="text-zan-700">
                        {lang === "kk" ? "Қысқа кеңес:" : lang === "ru" ? "Коротко:" : "In brief:"}
                      </strong>
                      <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[13.5px]">
                        <li>{lang === "kk" ? "Сабырлы болыңыз, қолдарыңыз көрінетін жерде." : lang === "ru" ? "Сохраняйте спокойствие, держите руки на виду." : "Stay calm and keep your hands visible."}</li>
                        <li>{lang === "kk" ? "Қызметкердің атағы мен жеке нөмірін сұраңыз." : lang === "ru" ? "Попросите звание и личный номер сотрудника." : "Ask for the officer's rank and badge number."}</li>
                        <li>{lang === "kk" ? "Тоқтату себебін сұраңыз." : lang === "ru" ? "Уточните причину остановки." : "Ask the reason for the stop."}</li>
                        <li>{lang === "kk" ? "Куәлік жоқ болса — мойындамауға құқыңыз бар." : lang === "ru" ? "Без оснований — имеете право не признавать." : "Without legal grounds, you have the right not to admit anything."}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl border border-zan-600/10 bg-gradient-to-br from-zan-50 to-white p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zan-600">
                    <Sparkles size={12} /> {lang === "kk" ? "Ерекшеліктер" : lang === "ru" ? "Особенности" : "Features"}
                  </div>
                  <ul className="mt-3 space-y-2.5 text-sm text-zan-ink">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 text-zan-600" />
                      <span>{lang === "kk" ? "Заңды ойдан шығармайды" : lang === "ru" ? "Не выдумывает законы" : "Never invents laws"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 text-zan-600" />
                      <span>{lang === "kk" ? "Дауыспен сұрау / жауап" : lang === "ru" ? "Голосом — вопрос и ответ" : "Voice — question and answer"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 text-zan-600" />
                      <span>{lang === "kk" ? "Үш тілде — ҚАЗ / РУС / ENG" : lang === "ru" ? "Три языка — ҚАЗ / РУС / ENG" : "Three languages — KAZ / RUS / ENG"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 text-zan-600" />
                      <span>{lang === "kk" ? "Сот процедураларын түсіндіреді" : lang === "ru" ? "Объясняет судебные процедуры" : "Explains court procedures"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-zan pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">
              {lang === "kk" ? "Негізгі модульдер" : lang === "ru" ? "Ключевые модули" : "Core modules"}
            </h2>
            <p className="mt-2 text-sm text-zan-ink/60">
              {lang === "kk"
                ? "Әр модуль бір нақты мәселені шешеді — тез және анық."
                : lang === "ru"
                ? "Каждый модуль решает одну задачу — быстро и ясно."
                : "Each module solves one concrete problem — fast and clear."}
            </p>
          </div>
          <Disclaimer compact />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
              >
                <Link href={f.href} className="card card-hover group block h-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zan-50 text-zan-600 transition group-hover:bg-zan-600 group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-zan-ink">
                    {f.title[lang]}
                  </h3>
                  <p className="mt-1 text-sm text-zan-ink/70">{f.desc[lang]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-zan-600">
                    {t.cta.learn[lang]} <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* COURT FOCUS STRIP */}
      <section className="relative overflow-hidden bg-zan-600 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="container-zan relative grid gap-10 py-16 md:grid-cols-2 md:py-20">
          <div>
            <span className="chip border-white/20 bg-white/10 text-white">
              <Gavel size={12} /> {lang === "kk" ? "Сотқа дайындық" : lang === "ru" ? "Подготовка к суду" : "Court preparation"}
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              {lang === "kk"
                ? "Сот процесінде жалғыз емессіз."
                : lang === "ru"
                ? "Вы не одни в судебном процессе."
                : "You're not alone in court."}
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              {lang === "kk"
                ? "zan.kz сотқа қалай бару керектігін, қандай құжат дайындау қажет екенін, отырыста қалай ұстау керектігін — қарапайым тілмен түсіндіреді."
                : lang === "ru"
                ? "zan.kz объяснит простым языком, как идти в суд, какие документы готовить и как вести себя на заседании."
                : "zan.kz explains in plain language how to go to court, which documents to prepare, and how to conduct yourself in the hearing."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/court" className="btn-ghost !border-white/30 !bg-white !text-zan-700 hover:!bg-zan-50">
                <Building2 size={16} />
                {lang === "kk" ? "Сот жүйесі" : lang === "ru" ? "Судебная система" : "Court system"}
              </Link>
              <Link href="/judge" className="btn-ghost !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                <Gavel size={16} />
                {lang === "kk" ? "Судья режимін ашу" : lang === "ru" ? "Открыть режим судьи" : "Open judge mode"}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center">
            {[
              { t: { kk: "1-саты", ru: "1 инстанция", en: "1st instance" }, s: { kk: "Аудандық/қалалық сот", ru: "Районный/городской", en: "District/city court" } },
              { t: { kk: "Апелляция", ru: "Апелляция", en: "Appeal" }, s: { kk: "Облыстық сот", ru: "Областной суд", en: "Regional court" } },
              { t: { kk: "Кассация", ru: "Кассация", en: "Cassation" }, s: { kk: "Жоғарғы Сот", ru: "Верховный Суд", en: "Supreme Court" } },
              { t: { kk: "Талап арыз", ru: "Исковое заявление", en: "Statement of claim" }, s: { kk: "Құрылымы, мерзімі, баж", ru: "Структура, сроки, пошлина", en: "Structure, deadlines, fees" } }
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
              >
                <div className="text-sm font-bold">{c.t[lang]}</div>
                <div className="mt-1 text-xs text-white/75">{c.s[lang]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-zan py-20">
        <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">
          {lang === "kk" ? "Қалай жұмыс істейді" : lang === "ru" ? "Как это работает" : "How it works"}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              t: { kk: "Жағдайды айтыңыз", ru: "Опишите ситуацию", en: "Describe the situation" },
              d: { kk: "Жазып немесе дауыспен. Қысқа болса да жеткілікті.", ru: "Текстом или голосом. Даже коротко — достаточно.", en: "By text or voice. Even a few words are enough." }
            },
            {
              n: "02",
              t: { kk: "AI талдайды", ru: "ИИ анализирует", en: "AI analyzes" },
              d: { kk: "Заң принциптеріне сүйеніп, ойдан шығармай.", ru: "Опираясь на правовые принципы, без выдумок.", en: "Grounded in legal principles, without inventions." }
            },
            {
              n: "03",
              t: { kk: "Нақты қадамдар", ru: "Конкретные шаги", en: "Concrete steps" },
              d: { kk: "Не істеу керек, неден сақтану керек — тізім түрінде.", ru: "Что делать, чего избегать — списком.", en: "What to do and what to avoid — as a checklist." }
            }
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="card card-hover"
            >
              <div className="font-display text-3xl font-extrabold text-zan-600/30">{s.n}</div>
              <h3 className="mt-1 font-display text-lg font-bold text-zan-ink">{s.t[lang]}</h3>
              <p className="mt-1 text-sm text-zan-ink/70">{s.d[lang]}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}
