"use client";

import { Info } from "lucide-react";
import { useLang } from "./LangProvider";
import { t } from "@/lib/i18n";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  return (
    <div
      className={
        compact
          ? "flex items-start gap-2 rounded-lg border border-zan-600/15 bg-zan-50/60 px-3 py-2 text-[12px] text-zan-700"
          : "flex items-start gap-3 rounded-xl border border-zan-600/15 bg-zan-50/60 px-4 py-3 text-sm text-zan-700"
      }
    >
      <Info size={compact ? 14 : 16} className="mt-0.5 shrink-0 text-zan-600" />
      <p>{t.disclaimer[lang]}</p>
    </div>
  );
}
