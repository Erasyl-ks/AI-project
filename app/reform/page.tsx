"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lightbulb, ShieldCheck, Scale, ArrowRight, AlertTriangle } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLang } from "@/components/LangProvider";
import { mdToHtml } from "@/lib/utils";

const topics = {
  kk: [
    "Тұрмыстық зорлық-зомбылық жәбірленушілерінің қорғалмауы",
    "Жол полициясының айыппұлдарын шағымдану процесінің ұзақтығы",
    "Тұтынушылардың онлайн дүкендермен дауларында дәрменсіздігі",
    "Еңбек мигранттарының құқықтық қорғалуы",
    "Меншік салығы туралы хабарламалардың түсініксіздігі"
  ],
  ru: [
    "Недостаточная защита жертв домашнего насилия",
    "Длительность обжалования штрафов ГАИ",
    "Слабая защита потребителей в спорах с онлайн-магазинами",
    "Правовая защита трудовых мигрантов",
    "Непонятные налоговые уведомления о налоге на имущество"
  ],
  en: [
    "Insufficient protection for domestic-violence victims",
    "Lengthy process for appealing traffic fines",
    "Weak consumer protection in disputes with online stores",
    "Legal protection of labor migrants",
    "Confusing property-tax notices"
  ]
};

export default function ReformPage() {
  const { lang } = useLang();
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const analyze = async (forced?: string) => {
    const text = (forced ?? topic).trim();
    if (text.length < 8 || busy) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/reform", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: text, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "server");
      setResult(data.reply);
      if (forced) setTopic(forced);
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
        <div className="container-zan relative py-14 md:py-20">
          <span className="chip"><Sparkles size={12} /> Zan-Reform</span>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-zan-ink md:text-5xl">
            {lang === "kk" ? (
              <>Азаматтан бастап заңға — <span className="text-zan-600">кері байланыс циклі.</span></>
            ) : lang === "ru" ? (
              <>От гражданина к закону — <span className="text-zan-600">обратная связь.</span></>
            ) : (
              <>From citizen to law — <span className="text-zan-600">a feedback loop.</span></>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zan-ink/70">
            {lang === "kk"
              ? "Нақты істерді талдап, заңның әлсіз жерлерін анықтаймыз. AI — ұсыныстар дайындайды, сіз — оларды қолдайсыз."
              : lang === "ru"
              ? "Разбираем реальные случаи, находим слабые места в законах. ИИ готовит предложения, вы их поддерживаете."
              : "We analyze real cases and find weak spots in the law. The AI drafts proposals; you back them."}
          </p>
        </div>
      </section>

      {/* HOW */}
      <section className="container-zan py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Scale, t: { kk: "Жағдай", ru: "Случай", en: "Case" }, d: { kk: "Нақты істі қысқаша сипаттаңыз.", ru: "Опишите конкретный случай.", en: "Briefly describe a specific case." } },
            { icon: Lightbulb, t: { kk: "Талдау", ru: "Анализ", en: "Analysis" }, d: { kk: "AI әлсіз тұстарды анықтайды.", ru: "ИИ выявляет слабые места.", en: "The AI identifies weak spots." } },
            { icon: ShieldCheck, t: { kk: "Ұсыныс", ru: "Предложение", en: "Proposal" }, d: { kk: "Азаматты қорғайтын реформа жобасы.", ru: "Проект реформы, защищающий граждан.", en: "A reform draft that protects citizens." } }
          ].map((it, i) => {
            const I = it.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="card card-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zan-600 text-white">
                  <I size={18} />
                </div>
                <div className="mt-4 font-display text-lg font-bold text-zan-ink">{it.t[lang]}</div>
                <p className="mt-1 text-sm text-zan-ink/70">{it.d[lang]}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FORM */}
      <section className="container-zan pb-14">
        <div className="card">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zan-700">
            <Sparkles size={16} />
            {lang === "kk" ? "Мәселені тұжырымдаңыз" : lang === "ru" ? "Сформулируйте проблему" : "State the problem"}
          </div>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-xl border border-zan-600/15 bg-white p-4 text-[15px] outline-none focus:border-zan-600/40 focus:ring-4 focus:ring-zan-600/10"
            placeholder={
              lang === "kk"
                ? "Мысалы: тұрмыстық зорлық-зомбылық жәбірленушілері шағым жасаған соң да қорғалмайды — қорғау ордерлерінің жүзеге асырылу тетігі әлсіз…"
                : lang === "ru"
                ? "Например: жертвы домашнего насилия не защищены даже после подачи жалобы — механизм охранных ордеров слабо работает…"
                : "For example: domestic-violence victims remain unprotected even after filing a complaint — the protection-order mechanism works poorly…"
            }
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {topics[lang].map((t) => (
              <button
                key={t}
                onClick={() => analyze(t)}
                disabled={busy}
                className="chip hover:bg-zan-100"
              >
                {t.length > 54 ? t.slice(0, 52) + "…" : t}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-zan-ink/60">
              {lang === "kk"
                ? "Ұсыныстар жалпы саясаттық талдау ретінде берілсін."
                : lang === "ru"
                ? "Предложения формируются как общий политический анализ."
                : "Proposals are framed as general policy analysis."}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={busy || topic.trim().length < 8}
              onClick={() => analyze()}
              className="btn-primary disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  {lang === "kk" ? "Дайындалуда…" : lang === "ru" ? "Анализирую…" : "Analyzing…"}
                </>
              ) : (
                <>
                  <Lightbulb size={16} />
                  {lang === "kk" ? "Реформа ұсыну" : lang === "ru" ? "Предложить реформу" : "Propose reform"}
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
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 card"
            >
              <div
                className="prose-zan"
                dangerouslySetInnerHTML={{ __html: mdToHtml(result) }}
              />
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
