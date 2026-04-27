import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Primary model + fallbacks. If the primary is overloaded (503),
 * we transparently retry on the next one. Order goes from "best quality"
 * to "most likely to have capacity".
 */
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash"
];

export const MODEL = MODEL_CHAIN[0];

function getClient() {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_API_KEY is not set. Put it in .env.local — get one at https://aistudio.google.com/app/apikey"
    );
  }
  return new GoogleGenerativeAI(key);
}

export type ChatRole = "user" | "assistant";
export interface ChatMsg {
  role: ChatRole;
  content: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRetryable(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("503") ||
    msg.includes("overloaded") ||
    msg.includes("Service Unavailable") ||
    msg.includes("high demand") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

export async function complete({
  system,
  messages,
  maxTokens = 4000
}: {
  system: string;
  messages: ChatMsg[];
  maxTokens?: number;
}) {
  if (messages.length === 0) {
    throw new Error("messages must not be empty");
  }

  // Gemini requires the first history entry to be role "user". The chat page
  // seeds an intro assistant message, so we drop any leading assistant turns.
  const trimmed = [...messages];
  while (trimmed.length > 0 && trimmed[0].role !== "user") trimmed.shift();
  if (trimmed.length === 0) throw new Error("no user message in history");

  const history = trimmed.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }]
  }));
  const last = trimmed[trimmed.length - 1];

  const genAI = getClient();
  let lastError: unknown = null;

  for (let i = 0; i < MODEL_CHAIN.length; i++) {
    const modelId = MODEL_CHAIN[i];
    // within the SAME model: 2 attempts with small backoff
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // For Gemini 2.5 models, "thinking tokens" are charged against
        // maxOutputTokens and can swallow the entire budget, leaving the
        // user-visible answer truncated. We cap the thinking budget so
        // there's always room for a complete response.
        const is25 = modelId.startsWith("gemini-2.5");
        const generationConfig: Record<string, unknown> = {
          maxOutputTokens: maxTokens,
          temperature: 0.5
        };
        if (is25) {
          generationConfig.thinkingConfig = { thinkingBudget: 512 };
        }

        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction: system,
          generationConfig: generationConfig as never
        });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(last.content);
        const text = result.response.text().trim();
        return {
          text,
          usage: result.response.usageMetadata,
          modelUsed: modelId
        };
      } catch (err) {
        lastError = err;
        if (!isRetryable(err)) throw err;
        // exponential backoff inside same model (0.6s → 1.2s)
        if (attempt === 0) await sleep(600);
      }
    }
    // next model after short pause
    await sleep(300);
  }

  throw lastError ?? new Error("all models failed");
}
