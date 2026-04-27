"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SR = any;

const langCode = (l: Lang) =>
  l === "kk" ? "kk-KZ" : l === "ru" ? "ru-RU" : "en-US";

/* ------------------------------------------------------------------ */
/* Speech → text (Web Speech API)                                     */
/* ------------------------------------------------------------------ */

export function useSpeechRecognition(lang: Lang) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec: SR = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = langCode(lang);
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, [lang]);

  useEffect(() => {
    if (recRef.current) recRef.current.lang = langCode(lang);
  }, [lang]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    setTranscript("");
    try {
      recRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recRef.current) return;
    try { recRef.current.stop(); } catch {}
    setListening(false);
  }, []);

  return { listening, transcript, supported, start, stop, setTranscript };
}

/* ------------------------------------------------------------------ */
/* Text → speech (Google Translate TTS proxy + speechSynthesis fallback)*/
/* ------------------------------------------------------------------ */

let currentAudio: HTMLAudioElement | null = null;
let aborted = false;

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string, maxLen = 180): string[] {
  const cleaned = stripMarkdown(text);
  if (!cleaned) return [];
  if (cleaned.length <= maxLen) return [cleaned];

  const parts: string[] = [];
  const sentences = cleaned.split(/(?<=[.!?。！？…])\s+/);
  let cur = "";
  const pushCur = () => {
    if (cur.trim()) parts.push(cur.trim());
    cur = "";
  };

  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;

    if (s.length > maxLen) {
      pushCur();
      const commaParts = s.split(/,\s*/);
      for (const cp of commaParts) {
        if (cp.length > maxLen) {
          const words = cp.split(/\s+/);
          for (const w of words) {
            if ((cur + " " + w).trim().length > maxLen) {
              pushCur();
              cur = w;
            } else {
              cur = cur ? cur + " " + w : w;
            }
          }
        } else if ((cur + ", " + cp).trim().length > maxLen) {
          pushCur();
          cur = cp;
        } else {
          cur = cur ? cur + ", " + cp : cp;
        }
      }
      pushCur();
    } else if ((cur + " " + s).trim().length > maxLen) {
      pushCur();
      cur = s;
    } else {
      cur = cur ? cur + " " + s : s;
    }
  }
  pushCur();
  return parts.filter(Boolean);
}

/** Play one chunk through /api/tts, fall back to browser speechSynthesis. */
async function playOne(text: string, lang: Lang): Promise<void> {
  if (aborted || !text) return;

  // --- Primary path: Google Translate TTS proxy ---
  try {
    const url = `/api/tts?lang=${lang}&text=${encodeURIComponent(text)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`tts ${resp.status}`);
    const type = resp.headers.get("content-type") || "";
    if (!type.startsWith("audio")) throw new Error(`not audio: ${type}`);

    const blob = await resp.blob();
    const objUrl = URL.createObjectURL(blob);

    await new Promise<void>((resolve) => {
      const audio = new Audio(objUrl);
      currentAudio = audio;
      const cleanup = () => {
        URL.revokeObjectURL(objUrl);
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };
      audio.onended = cleanup;
      audio.onerror = cleanup;
      audio.play().catch((e) => {
        console.warn("[tts] audio.play rejected:", e);
        cleanup();
      });
    });
    return;
  } catch (err) {
    console.warn("[tts] proxy failed, falling back to speechSynthesis:", err);
  }

  // --- Fallback: browser speechSynthesis ---
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  await new Promise<void>((resolve) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      const target = langCode(lang);
      u.lang = target;

      // Pick the best available voice: prefer Neural / Premium / Enhanced
      // entries matching the locale. Kazakh sometimes only has Russian
      // voices available — fall back to those before giving up.
      const voices = window.speechSynthesis.getVoices();
      const ranked = voices
        .filter((v) => {
          if (v.lang === target) return true;
          // Russian voices render Cyrillic Kazakh reasonably well when
          // no native kk-KZ voice is installed on the device.
          if (lang === "kk" && v.lang?.startsWith("ru")) return true;
          return false;
        })
        .sort((a, b) => {
          const score = (v: SpeechSynthesisVoice) => {
            const n = v.name.toLowerCase();
            let s = 0;
            if (/neural|premium|enhanced/.test(n)) s += 30;
            if (v.lang === target) s += 20;
            if (v.localService) s += 5;
            return s;
          };
          return score(b) - score(a);
        });
      if (ranked[0]) u.voice = ranked[0];

      u.rate = 0.95;
      u.pitch = 1;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    } catch {
      resolve();
    }
  });
}

/** Speak multi-chunk text in the given language. */
export async function speak(text: string, lang: Lang): Promise<void> {
  stopSpeaking();
  aborted = false;
  const chunks = chunkText(text);
  for (const c of chunks) {
    if (aborted) break;
    await playOne(c, lang);
  }
}

/** Stop any currently playing audio and cancel queued chunks. */
export function stopSpeaking() {
  aborted = true;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = "";
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
}
