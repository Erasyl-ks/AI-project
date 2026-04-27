"use client";

import { motion } from "framer-motion";

export default function Logo({
  size = 36,
  withWordmark = true,
  onDark = false
}: {
  size?: number;
  withWordmark?: boolean;
  onDark?: boolean;
}) {
  const blue = onDark ? "#ffffff" : "#0B3C8C";
  const gold = "#D6B15C";
  return (
    <div className="flex items-center gap-2.5 select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        initial={{ rotate: -8, opacity: 0, scale: 0.9 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        aria-label="zan.kz logo"
      >
        {/* outer emblem ring */}
        <circle cx="24" cy="24" r="22" fill={blue} />
        <circle cx="24" cy="24" r="22" fill="url(#shineZan)" opacity="0.35" />
        <circle cx="24" cy="24" r="20.5" fill="none" stroke={gold} strokeWidth="0.8" />

        {/* stylized sun rays (Kazakh-inspired) */}
        <g stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.9">
          <line x1="24" y1="6"  x2="24" y2="10" />
          <line x1="24" y1="38" x2="24" y2="42" />
          <line x1="6"  y1="24" x2="10" y2="24" />
          <line x1="38" y1="24" x2="42" y2="24" />
          <line x1="11" y1="11" x2="14" y2="14" />
          <line x1="34" y1="34" x2="37" y2="37" />
          <line x1="37" y1="11" x2="34" y2="14" />
          <line x1="14" y1="34" x2="11" y2="37" />
        </g>

        {/* scales of justice */}
        <g fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="24" y1="15" x2="24" y2="33" />
          <line x1="17" y1="19" x2="31" y2="19" />
          <path d="M17 19 L14 26 Q17 28 20 26 Z" fill="#ffffff" fillOpacity="0.12" />
          <path d="M31 19 L28 26 Q31 28 34 26 Z" fill="#ffffff" fillOpacity="0.12" />
          <circle cx="24" cy="33.5" r="1.2" fill="#ffffff" />
        </g>

        <defs>
          <radialGradient id="shineZan" cx="30%" cy="25%" r="70%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>

      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display text-[18px] font-extrabold tracking-tight"
            style={{ color: blue }}
          >
            zan<span style={{ color: gold }}>.</span>kz
          </span>
          <span className="text-[10px] font-medium tracking-wider text-zan-600/70">
            AI · LEGAL · KZ
          </span>
        </div>
      )}
    </div>
  );
}
