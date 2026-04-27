"use client";

import Logo from "./Logo";
import { useLang } from "./LangProvider";
import Link from "next/link";

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mt-24 border-t border-zan-600/10 bg-white">
      <div className="container-zan grid gap-8 py-12 md:grid-cols-3">
        <div>
          <Logo size={32} />
          <p className="mt-3 max-w-xs text-sm text-zan-ink/70">
            {lang === "kk"
              ? "zan.kz — Қазақстан азаматтарына арналған AI заңгер. Жылдам. Анық. Тәулік бойы."
              : lang === "ru"
              ? "zan.kz — ИИ-юрист для граждан Казахстана. Быстро. Ясно. Круглосуточно."
              : "zan.kz — an AI legal assistant for Kazakhstan's citizens. Fast. Clear. 24/7."}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zan-600">
            {lang === "kk" ? "Модульдер" : lang === "ru" ? "Модули" : "Modules"}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-zan-ink/80">
            <li><Link href="/chat" className="hover:text-zan-600">{lang === "kk" ? "AI-чат" : lang === "ru" ? "AI-чат" : "AI chat"}</Link></li>
            <li><Link href="/judge" className="hover:text-zan-600">{lang === "kk" ? "Судья режимі" : lang === "ru" ? "Режим судьи" : "Judge mode"}</Link></li>
            <li><Link href="/court" className="hover:text-zan-600">{lang === "kk" ? "Сот жүйесі" : lang === "ru" ? "Судебная система" : "Court system"}</Link></li>
            <li><Link href="/document" className="hover:text-zan-600">{lang === "kk" ? "Құжат талдау" : lang === "ru" ? "Анализ документа" : "Document analysis"}</Link></li>
            <li><Link href="/reform" className="hover:text-zan-600">Zan-Reform</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zan-600">
            {lang === "kk" ? "Маңызды ескерту" : lang === "ru" ? "Важно" : "Important"}
          </h4>
          <p className="mt-3 text-sm text-zan-ink/70">
            {lang === "kk"
              ? "Бұл жүйе ресми заң кеңесі емес. Ақпарат тек анықтамалық мақсатта беріледі."
              : lang === "ru"
              ? "Эта система не является официальной юридической консультацией. Информация предоставляется только в справочных целях."
              : "This system is not an official legal consultation. Information is provided for reference only."}
          </p>
        </div>
      </div>
      <div className="border-t border-zan-600/10 py-4">
        <div className="container-zan flex flex-col items-start justify-between gap-2 text-xs text-zan-ink/60 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} zan.kz — MVP</span>
          <span>Қазақстан · Kazakhstan</span>
        </div>
      </div>
    </footer>
  );
}
