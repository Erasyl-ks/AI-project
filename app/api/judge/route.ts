import { NextRequest, NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { judgeSystemPrompt } from "@/lib/systemPrompts";
import { buildRagContext, retrieveConstitutionArticles } from "@/lib/rag";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { situation, lang: l } = (await req.json()) as {
      situation: string;
      lang?: Lang;
    };
    const lang: Lang = l === "ru" ? "ru" : l === "en" ? "en" : "kk";
    if (!situation || situation.trim().length < 8) {
      return NextResponse.json({ error: "situation too short" }, { status: 400 });
    }

    // RAG: retrieve constitutional articles relevant to the case
    const ragContext = buildRagContext(situation, 6);
    const retrievedArticles = retrieveConstitutionArticles(situation, 6).map(
      (a) => a.number
    );
    const system = ragContext
      ? `${judgeSystemPrompt(lang)}\n\n${ragContext}`
      : judgeSystemPrompt(lang);

    const { text } = await complete({
      system,
      messages: [{ role: "user", content: situation.trim() }],
      maxTokens: 4000
    });

    return NextResponse.json({ reply: text, retrievedArticles });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/judge] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
