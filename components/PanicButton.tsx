"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Siren, MapPin, X } from "lucide-react";
import { useState } from "react";
import { useLang } from "./LangProvider";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function PanicButton({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<string | null>(null);

  const trigger = () => {
    setOpen(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords(
            `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          ),
        () => setCoords(lang === "kk" ? "геолокация қолжетімсіз" : lang === "ru" ? "геолокация недоступна" : "geolocation unavailable")
      );
    } else {
      setCoords(lang === "kk" ? "геолокация қолжетімсіз" : lang === "ru" ? "геолокация недоступна" : "geolocation unavailable");
    }
  };

  return (
    <>
      <button
        onClick={trigger}
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-full bg-red-600 font-semibold text-white shadow-soft transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30",
          compact ? "px-3.5 py-1.5 text-xs" : "px-5 py-3 text-sm"
        )}
        aria-label="Panic"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full" aria-hidden />
        <Siren size={compact ? 14 : 18} className="relative" />
        <span className="relative">{t.cta.panic[lang]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zan-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-soft"
            >
              <button
                className="absolute right-3 top-3 rounded-full p-1 text-zan-700 hover:bg-zan-50"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <X size={18} />
              </button>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Siren />
              </div>
              <h3 className="text-lg font-bold text-zan-ink">{t.panic.title[lang]}</h3>
              <p className="mt-1 text-sm text-zan-ink/70">{t.panic.body[lang]}</p>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-zan-600/15 bg-zan-50 p-3 text-sm">
                <MapPin size={16} className="text-zan-600" />
                <span className="font-mono text-zan-700">
                  {coords ?? (lang === "kk" ? "анықталуда…" : lang === "ru" ? "определяется…" : "locating…")}
                </span>
              </div>

              <div className="mt-5 flex gap-2">
                <button className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
                  {lang === "kk" ? "Түсінікті" : lang === "ru" ? "Понятно" : "Got it"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
