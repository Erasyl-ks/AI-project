"use client";

import { motion } from "framer-motion";
import { Scale, User2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { mdToHtml } from "@/lib/utils";
import { speak, stopSpeaking } from "./useVoice";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

export default function ChatMessage({
  msg,
  lang,
  onSpeakChange
}: {
  msg: Msg;
  lang: Lang;
  onSpeakChange?: (speaking: boolean) => void;
}) {
  const [speaking, setSpeaking] = useState(false);
  const isUser = msg.role === "user";

  const toggleSpeak = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      onSpeakChange?.(false);
      return;
    }
    setSpeaking(true);
    onSpeakChange?.(true);
    try {
      await speak(msg.content, lang);
    } finally {
      setSpeaking(false);
      onSpeakChange?.(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.8, 0.22, 1] }}
      className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zan-600 text-white shadow-soft">
          <Scale size={16} />
        </div>
      )}

      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-[0_1px_0_rgba(11,60,140,0.04)]",
          isUser
            ? "bg-zan-600 text-white"
            : "bg-white text-zan-ink border border-zan-600/10"
        )}
      >
        {msg.streaming && !msg.content ? (
          <div className="typing py-1">
            <span /><span /><span />
          </div>
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div
            className="prose-zan"
            dangerouslySetInnerHTML={{ __html: mdToHtml(msg.content) }}
          />
        )}

        {!isUser && msg.content && !msg.streaming && (
          <button
            onClick={toggleSpeak}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-zan-600/15 bg-zan-50 px-2.5 py-1 text-[11px] font-medium text-zan-700 transition hover:bg-zan-100"
          >
            {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
            {speaking
              ? lang === "kk" ? "Тоқтату" : lang === "ru" ? "Остановить" : "Stop"
              : lang === "kk" ? "Дауыспен оқу" : lang === "ru" ? "Озвучить" : "Read aloud"}
          </button>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zan-50 text-zan-700">
          <User2 size={16} />
        </div>
      )}
    </motion.div>
  );
}
