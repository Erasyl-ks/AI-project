import { NextRequest, NextResponse } from "next/server";
import { complete, type ChatMsg } from "@/lib/anthropic";
import { chatSystemPrompt, courtSystemPrompt } from "@/lib/systemPrompts";
import { buildRagContext, retrieveConstitutionArticles } from "@/lib/rag";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  messages: ChatMsg[];
  lang?: Lang;
  mode?: "chat" | "scenario" | "court";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const lang: Lang = body.lang === "ru" ? "ru" : body.lang === "en" ? "en" : "kk";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // RAG: pull the most relevant Constitution articles for the user's last question
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const ragContext = lastUserMsg ? buildRagContext(lastUserMsg.content, 6) : "";
    const retrievedArticles = lastUserMsg
      ? retrieveConstitutionArticles(lastUserMsg.content, 6).map((a) => a.number)
      : [];

    const baseSystem =
      body.mode === "court" ? courtSystemPrompt(lang) : chatSystemPrompt(lang);
    const system = ragContext ? `${baseSystem}\n\n${ragContext}` : baseSystem;

    const { text, usage } = await complete({
      system,
      messages: messages.slice(-12),
      maxTokens: 4000
    });

    return NextResponse.json({
      reply: text,
      usage,
      retrievedArticles // visible in network tab — proves RAG is working
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/chat] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
