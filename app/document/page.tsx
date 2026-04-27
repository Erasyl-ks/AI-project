"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Upload, Sparkles, AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLang } from "@/components/LangProvider";
import { mdToHtml } from "@/lib/utils";

export default function DocumentPage() {
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onFile = (file: File) => {
    setFileName(file.name);
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => setText(String(e.target?.result || ""));
      reader.readAsText(file);
    } else {
      setErr(
        lang === "kk"
          ? "Қазір тек мәтіндік файлдар (.txt) қолдау көрсетіледі. Суретті PDF үшін — мәтінді көшіріп қойыңыз."
          : lang === "ru"
          ? "Пока поддерживаются только текстовые файлы (.txt). Для PDF/изображений — вставьте текст вручную."
          : "Only text files (.txt) are supported for now. For PDFs or images, paste the text manually."
      );
    }
  };

  const analyze = async () => {
    if (text.trim().length < 20 || busy) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/document", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "server");
      setResult(data.reply);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-bg">
      <section className="relative overflow-hidden border-b border-zan-600/10">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="container-zan relative py-14 md:py-20">
          <span className="chip"><FileSearch size={12} /> {lang === "kk" ? "Құжат талдау" : lang === "ru" ? "Анализ документа" : "Document analysis"}</span>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-zan-ink md:text-5xl">
            {lang === "kk" ? (
              <>Қол қоймас бұрын — <span className="text-zan-600">түсініп ал.</span></>
            ) : lang === "ru" ? (
              <>Перед подписанием — <span className="text-zan-600">разберись.</span></>
            ) : (
              <>Before signing — <span className="text-zan-600">understand it.</span></>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zan-ink/70">
            {lang === "kk"
              ? "Шартты, айыппұлды, шақыруды, талап арызды мәтін ретінде жіберіңіз. zan.kz оның мәнін, тәуекелдерін және не істеу керектігін түсіндіреді."
              : lang === "ru"
              ? "Вставьте текст договора, штрафа, повестки, иска — zan.kz объяснит суть, риски и что делать."
              : "Paste the text of a contract, fine, subpoena, or claim — zan.kz explains its meaning, risks, and what to do."}
          </p>
        </div>
      </section>

      <section className="container-zan py-10">
        <div className="card">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed border-zan-600/25 bg-zan-50/60 px-5 py-4 transition hover:border-zan-600/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zan-600 shadow-soft">
                <Upload size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-zan-700">
                  {lang === "kk" ? "Мәтіндік файлды тасымалдаңыз немесе таңдаңыз" : lang === "ru" ? "Перетащите или выберите текстовый файл" : "Drag or choose a text file"}
                </div>
                <div className="text-xs text-zan-ink/60">
                  {fileName ?? (lang === "kk"
                    ? ".txt / .md — басқа форматтарды мәтінмен қойыңыз"
                    : lang === "ru"
                    ? ".txt / .md — другие форматы вставьте текстом"
                    : ".txt / .md — for other formats, paste the text")}
                </div>
              </div>
            </div>
            <input
              type="file"
              accept=".txt,.md,text/plain"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              className="hidden"
            />
            <span className="btn-ghost">
              {lang === "kk" ? "Таңдау" : lang === "ru" ? "Выбрать" : "Choose"}
            </span>
          </label>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-zan-600">
              {lang === "kk" ? "Немесе мәтінді осында қойыңыз" : lang === "ru" ? "Или вставьте текст сюда" : "Or paste the text here"}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="mt-2 w-full resize-none rounded-xl border border-zan-600/15 bg-white p-4 font-mono text-[13px] outline-none focus:border-zan-600/40 focus:ring-4 focus:ring-zan-600/10"
              placeholder={
                lang === "kk"
                  ? "Шарт, акт, шақыру, айыппұл — түпнұсқа мәтінін осында қойыңыз…"
                  : lang === "ru"
                  ? "Договор, акт, повестка, штраф — вставьте сюда оригинальный текст…"
                  : "Contract, act, subpoena, fine — paste the original text here…"
              }
            />
            <div className="mt-2 flex items-center justify-between text-xs text-zan-ink/60">
              <span>{text.length} / 20 000</span>
              <span>
                {lang === "kk"
                  ? "Жеке деректерді өшіруді ұмытпаңыз"
                  : lang === "ru"
                  ? "Удалите персональные данные перед отправкой"
                  : "Remove personal details before submitting"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={busy || text.trim().length < 20}
              onClick={analyze}
              className="btn-primary disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  {lang === "kk" ? "Талдануда…" : lang === "ru" ? "Анализ…" : "Analyzing…"}
                </>
              ) : (
                <>
                  <FileSearch size={16} />
                  {lang === "kk" ? "Құжатты талдау" : lang === "ru" ? "Проанализировать" : "Analyze document"}
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
              className="mt-6 space-y-4"
            >
              <div className="card">
                <div
                  className="prose-zan"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(result) }}
                />
              </div>
              <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <ShieldAlert size={16} className="mt-0.5" />
                {lang === "kk"
                  ? "Күдікті тұстар болса — қол қоймаңыз, заңгермен кеңесіңіз."
                  : lang === "ru"
                  ? "При сомнениях не подписывайте — проконсультируйтесь с юристом."
                  : "If anything seems off, don't sign — consult a lawyer."}
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
