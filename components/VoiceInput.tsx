"use client";

import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VoiceInput({
  listening,
  onToggle,
  disabled = false,
  size = 44
}: {
  listening: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: number;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition",
        listening
          ? "bg-zan-600 text-white mic-ripple"
          : "bg-white text-zan-600 border border-zan-600/20 hover:bg-zan-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{ width: size, height: size }}
      aria-label={listening ? "stop listening" : "start listening"}
      title={listening ? "Stop" : "Voice"}
    >
      {listening ? <Mic size={size * 0.45} /> : <MicOff size={size * 0.45} />}
    </motion.button>
  );
}
