"use client";

import { motion } from "framer-motion";
import { useLang } from "./LangProvider";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "kk", label: "ҚАЗ" },
  { code: "ru", label: "РУС" },
  { code: "en", label: "ENG" }
];

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  const activeIndex = OPTIONS.findIndex((o) => o.code === lang);

  return (
    <div className="relative inline-flex items-center rounded-full border border-zan-600/15 bg-zan-50 p-0.5 text-xs font-semibold text-zan-700">
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="absolute inset-y-0.5 rounded-full bg-white shadow-soft"
        style={{
          width: `calc(${100 / OPTIONS.length}% - 4px)`,
          left: `calc(${(activeIndex * 100) / OPTIONS.length}% + 2px)`
        }}
      />
      {OPTIONS.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            onClick={() => setLang(o.code)}
            className={cn(
              "relative z-10 min-w-[42px] rounded-full px-2.5 py-1 transition",
              active ? "text-zan-700" : "text-zan-600/55 hover:text-zan-700"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
