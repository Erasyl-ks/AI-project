import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Text-to-speech proxy with a fallback chain:
 *   1) Azure Speech Services neural voices (best Kazakh quality) — if
 *      AZURE_SPEECH_KEY + AZURE_SPEECH_REGION are set.
 *   2) Google Cloud Text-to-Speech — if GOOGLE_CLOUD_TTS_KEY is set.
 *   3) Google Translate TTS (legacy, low-quality concatenative) — always on
 *      as a last resort so the site still has a voice out of the box.
 *
 * Client sends one chunk per request (≤ 400 chars). Response is audio/mpeg.
 */

type TtsLang = "kk" | "ru" | "en";

function pickLang(v: string | null): TtsLang {
  if (v === "ru") return "ru";
  if (v === "en") return "en";
  return "kk";
}

/* -------------------- 1) Azure Neural (preferred) -------------------- */

async function azureTts(text: string, lang: TtsLang): Promise<Response | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return null;

  const voice =
    lang === "kk"
      ? "kk-KZ-AigulNeural"
      : lang === "ru"
      ? "ru-RU-SvetlanaNeural"
      : "en-US-JennyNeural";
  const locale =
    lang === "kk" ? "kk-KZ" : lang === "ru" ? "ru-RU" : "en-US";

  const ssml =
    `<speak version='1.0' xml:lang='${locale}'>` +
    `<voice name='${voice}'>` +
    text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;") +
    `</voice></speak>`;

  try {
    const resp = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "zan.kz"
        },
        body: ssml,
        cache: "no-store"
      }
    );

    if (!resp.ok) {
      console.warn("[tts/azure] upstream", resp.status);
      return null;
    }
    const buf = await resp.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Tts-Provider": "azure"
      }
    });
  } catch (err) {
    console.warn("[tts/azure] error", err);
    return null;
  }
}

/* -------------------- 2) Google Cloud TTS -------------------- */

async function googleCloudTts(
  text: string,
  lang: TtsLang
): Promise<Response | null> {
  const key = process.env.GOOGLE_CLOUD_TTS_KEY;
  if (!key) return null;

  // Prefer Chirp3-HD when present, fall back to Wavenet/Standard.
  const voice =
    lang === "kk"
      ? { languageCode: "kk-KZ", name: "kk-KZ-Standard-A" }
      : lang === "ru"
      ? { languageCode: "ru-RU", name: "ru-RU-Wavenet-A" }
      : { languageCode: "en-US", name: "en-US-Neural2-F" };

  try {
    const resp = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice,
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
            pitch: 0.0
          }
        }),
        cache: "no-store"
      }
    );

    if (!resp.ok) {
      console.warn("[tts/gcloud] upstream", resp.status);
      return null;
    }
    const data = (await resp.json()) as { audioContent?: string };
    if (!data.audioContent) return null;
    const buf = Buffer.from(data.audioContent, "base64");
    return new Response(buf, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Tts-Provider": "gcloud"
      }
    });
  } catch (err) {
    console.warn("[tts/gcloud] error", err);
    return null;
  }
}

/* -------------------- 3) Google Translate (fallback) -------------------- */

async function translateTts(
  text: string,
  lang: TtsLang
): Promise<Response> {
  // Google Translate TTS ignores "en" on this endpoint quirks; it works for kk/ru/en anyway.
  const url =
    "https://translate.google.com/translate_tts" +
    `?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;

  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Referer: "https://translate.google.com/",
        Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8"
      },
      cache: "no-store"
    });

    if (!resp.ok || !resp.body) {
      return new Response(`tts upstream ${resp.status}`, { status: 502 });
    }
    const buffer = await resp.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Tts-Provider": "gtranslate"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[/api/tts/gtranslate] error:", message);
    return new Response(`tts error: ${message}`, { status: 500 });
  }
}

/* -------------------- 0) ElevenLabs (your own cloned voice) ---------- */

async function elevenLabsTts(text: string): Promise<Response | null> {
  const key = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!key || !voiceId) return null;

  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }),
        cache: "no-store"
      }
    );

    if (!resp.ok) {
      console.warn("[tts/elevenlabs] upstream", resp.status);
      return null;
    }
    const buf = await resp.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Tts-Provider": "elevenlabs"
      }
    });
  } catch (err) {
    console.warn("[tts/elevenlabs] error", err);
    return null;
  }
}

/* -------------------- Handler -------------------- */

export async function GET(req: NextRequest) {
  const text = (req.nextUrl.searchParams.get("text") || "").trim();
  const lang = pickLang(req.nextUrl.searchParams.get("lang"));

  if (!text) {
    return new Response("no text", { status: 400 });
  }
  if (text.length > 400) {
    return new Response("chunk too long (>400)", { status: 400 });
  }

  // Try ElevenLabs (own voice) → Azure → Google Cloud → Google Translate.
  const eleven = await elevenLabsTts(text);
  if (eleven) return eleven;

  const azure = await azureTts(text, lang);
  if (azure) return azure;

  const gcloud = await googleCloudTts(text, lang);
  if (gcloud) return gcloud;

  return translateTts(text, lang);
}
