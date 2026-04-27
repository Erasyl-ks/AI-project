import { NextRequest, NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { reformSystemPrompt } from "@/lib/systemPrompts";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { topic, lang: l } = (await req.json()) as {
      topic: string;
      lang?: Lang;
    };
    const lang: Lang = l === "ru" ? "ru" : l === "en" ? "en" : "kk";
    if (!topic || topic.trim().length < 8) {
      return NextResponse.json({ error: "topic too short" }, { status: 400 });
    }

    const { text } = await complete({
      system: reformSystemPrompt(lang),
      messages: [{ role: "user", content: topic.trim() }],
      maxTokens: 3500
    });

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/reform] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
