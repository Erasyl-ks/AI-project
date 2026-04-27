"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Scale, Sparkles, ArrowRight, Users, AlertTriangle } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLang } from "@/components/LangProvider";
import { mdToHtml } from "@/lib/utils";

const examples = {
  kk: [
    "Сосед су құбырын бұзып, менің пәтерімді су басты. Жөндеу ақысын төлеуден бас тартады.",
    "Жұмыс беруші еңбек шартынсыз жұмыс істеткен. 3 айлық жалақы төленбей жатыр.",
    "Автокөлік сатып алдым, бір аптадан кейін қозғалтқыш ақауы шықты. Сатушы қайтарудан бас тартады."
  ],
  ru: [
    "Сосед сломал трубу и затопил мою квартиру. Отказывается платить за ремонт.",
    "Работодатель не оформлял трудовой договор. Не выплачена зарплата за 3 месяца.",
    "Купил машину, через неделю обнаружился брак двигателя. Продавец отказывается вернуть деньги."
  ],
  en: [
    "A neighbor broke a pipe and flooded my apartment. He refuses to pay for repairs.",
    "An employer hired me without a contract. Three months of salary remain unpaid.",
    "I bought a car; a week later the engine proved defective. The seller refuses to refund."
  ]
};

export default function JudgePage() {
  const { lang } = useLang();
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const analyze = async (forced?: string) => {
    const text = (forced ?? situation).trim();
    if (text.length < 8 || busy) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation: text, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "server");
      setResult(data.reply);
      if (forced) setSituation(forced);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-bg">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zan-600/10">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="container-zan relative grid gap-8 py-14 md:grid-cols-5 md:py-20">
          <div className="md:col-span-3">
            <span className="chip"><Gavel size={12} /> {lang === "kk" ? "Судья режимі" : lang === "ru" ? "Режим судьи" : "Judge mode"}</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-zan-ink md:text-5xl">
              {lang === "kk" ? (
                <>
                  AI <span className="text-zan-600">үкім</span> шығарады.
                  <br />
                  Нақты бап, нақты жаза.
                </>
              ) : lang === "ru" ? (
                <>
                  AI выносит <span className="text-zan-600">приговор</span>.
                  <br />
                  Конкретная статья, конкретное наказание.
                </>
              ) : (
                <>
                  AI hands down a <span className="text-zan-600">verdict</span>.
                  <br />
                  Specific article, specific sanction.
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zan-ink/70">
              {lang === "kk"
                ? "Жағдайды жазыңыз — AI Қазақстан судьясы ретінде екі жақтың дәлелдерін талдап, қолданылатын кодексті, бапты және нақты жазаны (мерзім, айыппұл, өтемақы) айтады."
                : lang === "ru"
                ? "Опишите ситуацию — AI в роли казахстанского судьи разберёт аргументы сторон, применит конкретный кодекс и статью и назначит конкретное наказание (срок, штраф, возмещение)."
                : "Describe the situation — the AI, acting as a Kazakhstani judge, will weigh both sides, apply a specific code and article, and hand down a concrete sanction (term, fine, damages)."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {examples[lang].map((e, i) => (
                <button
                  key={i}
                  onClick={() => analyze(e)}
                  className="chip text-left hover:bg-zan-100"
                  disabled={busy}
                >
                  {e.length > 60 ? e.slice(0, 58) + "…" : e}
                </button>
              ))}
            </div>
          </div>

          <div className="relative md:col-span-2">
            <JudgeIllustration />
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="container-zan py-10">
        <div className="card">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zan-700">
            <Scale size={16} />
            {lang === "kk" ? "Жағдайды сипаттаңыз" : lang === "ru" ? "Опишите ситуацию" : "Describe the situation"}
          </div>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-xl border border-zan-600/15 bg-white p-4 text-[15px] outline-none focus:border-zan-600/40 focus:ring-4 focus:ring-zan-600/10"
            placeholder={
              lang === "kk"
                ? "Мысалы: көршіммен жер дауы. Ол менің жерімнің бір бөлігіне қора салды, оның айтуынша 15 жыл бұрын сатып алған…"
                : lang === "ru"
                ? "Например: спор с соседом о границе участка. Он построил сарай на моей земле и утверждает, что купил её 15 лет назад…"
                : "For example: a boundary dispute with a neighbor. He built a shed on my land and claims he bought it 15 years ago…"
            }
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-zan-ink/60">
              {lang === "kk"
                ? "Кем дегенде 1–2 сөйлем жазыңыз. Түпнұсқа есім-жөнді жазбаңыз."
                : lang === "ru"
                ? "Напишите хотя бы 1–2 предложения. Не указывайте настоящих имён."
                : "Write at least 1–2 sentences. Don't include real names."}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={busy || situation.trim().length < 8}
              onClick={() => analyze()}
              className="btn-primary disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  {lang === "kk" ? "Талдануда…" : lang === "ru" ? "Анализ…" : "Analyzing…"}
                </>
              ) : (
                <>
                  <Gavel size={16} />
                  {lang === "kk" ? "Талдау" : lang === "ru" ? "Анализировать" : "Analyze"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {err && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertTriangle size={16} className="mt-0.5" />
              {err}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT */}
        <AnimatePresence>
          {busy && !result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 card"
            >
              <div className="flex items-center gap-3">
                <Gavel size={20} className="gavel-strike text-zan-600" />
                <div className="typing"><span /><span /><span /></div>
                <span className="text-sm text-zan-ink/70">
                  {lang === "kk" ? "Екі жақтың дәлелдері дайындалуда…" : lang === "ru" ? "Готовим аргументы обеих сторон…" : "Preparing arguments for both sides…"}
                </span>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-4"
            >
              {/* courtroom banner */}
              <div className="relative overflow-hidden rounded-2xl bg-zan-600 p-5 text-white">
                <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/15 p-2">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/70">
                      {lang === "kk" ? "AI-модельденген үкім" : lang === "ru" ? "AI-приговор" : "AI-simulated verdict"}
                    </div>
                    <div className="font-display text-lg font-bold">
                      {lang === "kk" ? "Сот қаулысы" : lang === "ru" ? "Решение суда" : "Court ruling"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div
                  className="prose-zan"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(result) }}
                />
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {lang === "kk"
                  ? "⚖ Бұл — zan.kz AI-модельденген үкім, нақты соттың заңды күшіне енген шешімі емес."
                  : lang === "ru"
                  ? "⚖ Это AI-смоделированный приговор zan.kz, не вступившее в законную силу решение реального суда."
                  : "⚖ This is a zan.kz AI-simulated verdict, not a legally binding ruling of an actual court."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}

function JudgeIllustration() {
  return (
    <div className="relative h-full min-h-[260px] w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zan-50 to-white shadow-soft"
      />

      {/* courthouse columns */}
      <motion.svg
        viewBox="0 0 320 240"
        className="absolute inset-0 h-full w-full p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          <linearGradient id="col" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0B3C8C" stopOpacity="0.12" />
            <stop offset="1" stopColor="#0B3C8C" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* pediment */}
        <polygon points="40,70 160,30 280,70" fill="#0B3C8C" opacity="0.14" />
        <rect x="40" y="70" width="240" height="14" fill="#0B3C8C" opacity="0.2" />
        {/* columns */}
        {[60, 110, 160, 210, 260].map((x, i) => (
          <motion.rect
            key={x}
            x={x - 8}
            y={88}
            width="16"
            height="104"
            rx="2"
            fill="url(#col)"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 88, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
          />
        ))}
        {/* base */}
        <rect x="32" y="196" width="256" height="12" fill="#0B3C8C" opacity="0.2" />
        <rect x="24" y="208" width="272" height="6"  fill="#0B3C8C" opacity="0.12" />

        {/* scales of justice center */}
        <motion.g
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <circle cx="160" cy="124" r="26" fill="#0B3C8C" />
          <g stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none">
            <line x1="160" y1="112" x2="160" y2="140" />
            <line x1="146" y1="118" x2="174" y2="118" />
            <path d="M146 118 L142 128 Q146 131 150 128 Z" fill="#fff" fillOpacity="0.2" />
            <path d="M174 118 L170 128 Q174 131 178 128 Z" fill="#fff" fillOpacity="0.2" />
          </g>
        </motion.g>
      </motion.svg>

      {/* floating gavel */}
      <motion.div
        className="absolute -bottom-3 right-4 rounded-2xl border border-zan-600/15 bg-white px-3 py-2 shadow-soft"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-zan-700">
          <Gavel className="gavel-strike text-zan-600" size={16} />
          ORDER · ORDER
        </div>
      </motion.div>
    </div>
  );
}
