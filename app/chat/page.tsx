"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, ShieldAlert, Scale, Trash2, Volume2, VolumeX } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import ChatMessage, { type Msg } from "@/components/ChatMessage";
import VoiceInput from "@/components/VoiceInput";
import { useLang } from "@/components/LangProvider";
import { useSpeechRecognition, speak, stopSpeaking } from "@/components/useVoice";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Lang } from "@/lib/i18n";

function quickSuggestions(lang: Lang) {
  if (lang === "kk") {
    return [
      { label: "Полиция тоқтатты", icon: ShieldAlert, prompt: "Полиция мені көшеде тоқтатты. Қандай құқықтарым бар және не істеуім керек?" },
      { label: "Еңбек дауы", icon: Scale, prompt: "Мені жұмыстан негізсіз шығарып тастады. Не істей аламын?" },
      { label: "Айыппұл", icon: Sparkles, prompt: "Жол полициясы айыппұл салды, бірақ менің кінәм жоқ деп ойлаймын. Қалай шағымдануға болады?" },
      { label: "Жалға алу", icon: Sparkles, prompt: "Пәтер иесі шарт бұзбай мені шығарып жіберуге тырысады. Құқығым қандай?" }
    ];
  }
  if (lang === "ru") {
    return [
      { label: "Полиция остановила", icon: ShieldAlert, prompt: "Меня остановила полиция на улице. Какие у меня права и что делать?" },
      { label: "Трудовой спор", icon: Scale, prompt: "Меня незаконно уволили с работы. Что я могу сделать?" },
      { label: "Штраф", icon: Sparkles, prompt: "ГАИ выписал штраф, но я считаю, что я не виноват. Как обжаловать?" },
      { label: "Аренда", icon: Sparkles, prompt: "Арендодатель пытается выселить меня без оснований. Какие у меня права?" }
    ];
  }
  return [
    { label: "Stopped by police", icon: ShieldAlert, prompt: "The police stopped me on the street. What are my rights and what should I do?" },
    { label: "Labor dispute", icon: Scale, prompt: "I was unfairly dismissed from my job. What can I do?" },
    { label: "Traffic fine", icon: Sparkles, prompt: "Traffic police issued a fine, but I believe I'm not at fault. How do I appeal?" },
    { label: "Rental issue", icon: Sparkles, prompt: "My landlord is trying to evict me without grounds. What are my rights?" }
  ];
}

function ChatInner() {
  const { lang } = useLang();
  const sp = useSearchParams();
  const urlMode = sp?.get("mode");

  const initialAssistant = useMemo<Msg>(
    () => ({
      id: "intro",
      role: "assistant",
      content:
        lang === "kk"
          ? "Сәлем! Мен zan.kz — Қазақстан заңдары бойынша AI-көмекшімін. Жағдайыңызды қысқаша жазыңыз немесе микрофонды басып дауыспен айтыңыз. Мен қадамдық кеңес беремін."
          : lang === "ru"
          ? "Здравствуйте! Я zan.kz — ИИ-помощник по законам Казахстана. Кратко опишите ситуацию текстом или голосом, и я дам пошаговый совет."
          : "Hello! I'm zan.kz — an AI assistant for Kazakhstan's laws. Briefly describe your situation by text or voice, and I'll give you step-by-step guidance."
    }),
    [lang]
  );

  const [messages, setMessages] = useState<Msg[]>([initialAssistant]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string>("intro");

  const voice = useSpeechRecognition(lang);

  useEffect(() => {
    setMessages([initialAssistant]);
  }, [initialAssistant]);

  useEffect(() => {
    if (voice.transcript) setInput(voice.transcript);
  }, [voice.transcript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  // Auto-speak AI response when autoSpeak is on
  useEffect(() => {
    if (!autoSpeak) return;
    const last = messages[messages.length - 1];
    if (
      last &&
      last.role === "assistant" &&
      !last.streaming &&
      last.content &&
      last.id !== lastSpokenIdRef.current
    ) {
      lastSpokenIdRef.current = last.id;
      speak(last.content, lang);
    }
  }, [messages, autoSpeak, lang]);

  const send = async (forced?: string) => {
    const text = (forced ?? input).trim();
    if (!text || busy) return;
    voice.stop();

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text
    };
    const pendingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: pendingId, role: "assistant", content: "", streaming: true }
    ]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang,
          mode: urlMode === "scenario" ? "chat" : "chat",
          messages: [...messages, userMsg]
            .filter((m) => !m.streaming)
            .map(({ role, content }) => ({ role, content }))
        })
      });
      const data = await res.json();
      const reply: string =
        data.reply ||
        (lang === "kk" ? "Ақпарат жеткіліксіз." : lang === "ru" ? "Недостаточно информации." : "Insufficient information.");

      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, content: reply, streaming: false } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                streaming: false,
                content:
                  lang === "kk"
                    ? "Қате: сервермен байланыс үзілді."
                    : lang === "ru"
                    ? "Ошибка: соединение с сервером прервано."
                    : "Error: connection to the server was interrupted."
              }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const clearChat = () => setMessages([initialAssistant]);

  const suggestions = quickSuggestions(lang);

  return (
    <div className="hero-bg">
      <div className="container-zan py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-end justify-between gap-4"
        >
          <div>
            <span className="chip"><Scale size={12} /> {lang === "kk" ? "AI-консультант" : lang === "ru" ? "AI-консультант" : "AI consultant"}</span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-zan-ink md:text-3xl">
              {lang === "kk" ? "Заң бойынша кеңес алыңыз" : lang === "ru" ? "Получите юридический совет" : "Get legal advice"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (autoSpeak) stopSpeaking();
                setAutoSpeak(v => !v);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                autoSpeak
                  ? "border-zan-600 bg-zan-600 text-white"
                  : "border-zan-600/15 bg-white text-zan-700 hover:bg-zan-50"
              }`}
            >
              {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {lang === "kk" ? "Авто-дауыс" : lang === "ru" ? "Авто-голос" : "Auto-voice"}
            </button>
            <button
              onClick={() => stopSpeaking()}
              title={lang === "kk" ? "Дауысты тоқтату" : lang === "ru" ? "Остановить голос" : "Stop voice"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
            >
              <VolumeX size={14} />
              {lang === "kk" ? "Тоқтату" : lang === "ru" ? "Стоп" : "Stop"}
            </button>
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zan-600/15 bg-white px-3 py-2 text-xs font-semibold text-zan-700 hover:bg-zan-50"
            >
              <Trash2 size={14} /> {lang === "kk" ? "Тазалау" : lang === "ru" ? "Очистить" : "Clear"}
            </button>
          </div>
        </motion.div>

        {/* suggestion chips */}
        {messages.length <= 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => send(s.prompt)}
                  disabled={busy}
                  className="chip hover:bg-zan-100"
                >
                  <Icon size={12} /> {s.label}
                </motion.button>
              );
            })}
          </div>
        )}

        <div className="rounded-3xl border border-zan-600/10 bg-white/70 p-3 shadow-soft backdrop-blur md:p-4">
          <div
            ref={scrollRef}
            className="scroll-zan h-[58vh] space-y-4 overflow-y-auto rounded-2xl bg-[linear-gradient(180deg,rgba(11,60,140,0.02),transparent_30%)] p-3 md:h-[62vh] md:p-5"
          >
            {messages.map((m) => (
              <ChatMessage key={m.id} msg={m} lang={lang} />
            ))}
          </div>

          {/* composer */}
          <div className="mt-3 rounded-2xl border border-zan-600/15 bg-white p-2 shadow-[0_1px_0_rgba(11,60,140,0.04)]">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={
                    lang === "kk"
                      ? "Жағдайыңызды жазыңыз… (Enter — жіберу, Shift+Enter — жаңа жол)"
                      : lang === "ru"
                      ? "Опишите ситуацию… (Enter — отправить, Shift+Enter — новая строка)"
                      : "Describe your situation… (Enter — send, Shift+Enter — new line)"
                  }
                  rows={2}
                  className="max-h-40 w-full resize-none rounded-xl border-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-zan-ink/40"
                />
                {voice.listening && (
                  <div className="flex items-center gap-2 px-3 pb-1 text-xs font-medium text-zan-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    {lang === "kk" ? "тыңдалып жатыр…" : lang === "ru" ? "слушаю…" : "listening…"}
                  </div>
                )}
              </div>

              {voice.supported ? (
                <VoiceInput
                  listening={voice.listening}
                  onToggle={voice.listening ? voice.stop : voice.start}
                  disabled={busy}
                />
              ) : null}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => send()}
                disabled={busy || !input.trim()}
                className="btn-primary disabled:opacity-50"
                aria-label="send"
              >
                <Send size={16} />
                {lang === "kk" ? "Жіберу" : lang === "ru" ? "Отправить" : "Send"}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Disclaimer compact />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatInner />
    </Suspense>
  );
}
