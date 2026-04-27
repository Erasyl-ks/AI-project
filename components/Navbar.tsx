"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import PanicButton from "./PanicButton";
import { useLang } from "./LangProvider";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const items = [
  { href: "/chat",     key: "chat"   as const },
  { href: "/judge",    key: "judge"  as const },
  { href: "/court",    key: "court"  as const },
  { href: "/document", key: "doc"    as const },
  { href: "/reform",   key: "reform" as const }
];

export default function Navbar() {
  const { lang } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zan-600/10 bg-white/80 backdrop-blur">
      <div className="container-zan flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => {
            const active = path?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "text-zan-600"
                    : "text-zan-ink/80 hover:bg-zan-50 hover:text-zan-700"
                )}
              >
                {t.nav[it.key][lang]}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-zan-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <PanicButton compact />
        </div>

        <button
          className="rounded-lg p-2 text-zan-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zan-600/10 bg-white md:hidden"
          >
            <div className="container-zan flex flex-col gap-1 py-3">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zan-ink hover:bg-zan-50"
                >
                  {t.nav[it.key][lang]}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-zan-600/10 pt-3">
                <LanguageToggle />
                <PanicButton compact />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
