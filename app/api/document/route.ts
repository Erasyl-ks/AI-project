import { NextRequest, NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { documentSystemPrompt } from "@/lib/systemPrompts";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text: content, lang: l } = (await req.json()) as {
      text: string;
      lang?: Lang;
    };
    const lang: Lang = l === "ru" ? "ru" : l === "en" ? "en" : "kk";
    if (!content || content.trim().length < 20) {
      return NextResponse.json({ error: "document too short" }, { status: 400 });
    }

    const { text } = await complete({
      system: documentSystemPrompt(lang),
      messages: [{ role: "user", content: content.slice(0, 20000) }],
      maxTokens: 3500
    });

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/document] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
