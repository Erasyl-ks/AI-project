# zan.kz — AI Legal Assistant for Kazakhstan

A free, fast, multilingual AI lawyer for citizens of Kazakhstan.
Built so that anyone — without paying a lawyer — can understand their rights when stopped by police, summoned by the military, fined, fired, or facing court.

🌐 **Live demo:** [zankz.vercel.app](https://zankz.vercel.app)

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Google Gemini API · Web Speech API · BM25-based RAG.

---

## Pages

| Route        | Purpose                                                                   |
|--------------|---------------------------------------------------------------------------|
| `/`          | Landing — hero, 6 modules, court-focus strip, "how it works".             |
| `/chat`      | AI legal consultant. Text + voice in/out. Auto-speak toggle.              |
| `/judge`     | Judge Mode — both sides describe their case, AI delivers a verdict.       |
| `/court`     | Court system explainer — instances, claims, appeal, cassation, FAQ.       |
| `/document`  | Document analyzer — paste contract / fine / summons, get structured risks.|
| `/reform`    | Zan-Reform — finds weak spots in laws, proposes citizen-protective reform.|

Every page shares: navbar, language toggle (ҚАЗ/РУС/ENG), animated logo, panic SOS button, persistent legal disclaimer.

---

## How AI knows the law (3 techniques)

### 1. Prompt Engineering — `lib/systemPrompts.ts`
Each mode (chat / judge / court / document / reform) has its own system prompt. The prompt tells the AI **how to respond, which laws it must cite, and how to summarize**. Every mode shares core guardrails:

1. Never invent laws or article numbers.
2. If unsure — say *"Ақпарат жеткіліксіз"* / *"Недостаточно информации"*.
3. Base answers on real codes: Constitution, Civil, Criminal, Administrative, Labor, Family, Tax, Criminal Procedure, Consumer Protection, Banking, Land, Entrepreneurship.
4. Never render a final court judgment.
5. Always include a concrete action plan (3 steps + emergency phone numbers).

### 2. RAG (Retrieval Augmented Generation) — `lib/rag.ts`
Lightweight, keyword-based retrieval — no embeddings, no vector DB:

1. **Tokenize** the user's question.
2. **Expand** with a synonyms map (Russian → Kazakh, topical anchors).
3. **Score** every Constitution article with a **BM25-style algorithm** (term frequency + title bonus + length normalization).
4. **Top-K articles** (default 6) are injected into the system prompt as a context block.

This guarantees the AI quotes the **actual 2026 Constitution text**, not its outdated training data.

The full Constitution corpus lives in `lib/laws/constitution.ts`.

### 3. API Fallback Chain — `lib/anthropic.ts`
If a Gemini model fails (rate limit / outage), the request is automatically retried on the next model:

```
gemini-2.5-flash → gemini-2.0-flash → gemini-2.5-flash-lite → gemini-1.5-flash
```

The first model that returns a valid response wins. The service never goes down because of a single model.

---

## Setup

```bash
# 1. Install
npm install

# 2. Configure Google Gemini API key
cp .env.local.example .env.local
# then edit .env.local and set GOOGLE_API_KEY
# get a free key at: https://aistudio.google.com/app/apikey

# 3. (Optional) Add TTS providers for high-quality voice output
# Priority: ElevenLabs → Azure → Google Cloud → Google Translate fallback
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
AZURE_TTS_KEY=...
AZURE_TTS_REGION=...
GOOGLE_TTS_API_KEY=...

# 4. Run dev server
npm run dev
# open http://localhost:3000
```

The default model is `gemini-2.5-flash`; override with `GEMINI_MODEL` in `.env.local`.

---

## Folder structure

```
app/
  layout.tsx                # Root layout + Navbar/Footer + LangProvider
  page.tsx                  # Landing
  globals.css               # Design tokens, animations
  chat/page.tsx             # Citizen consultation (text + voice)
  judge/page.tsx            # Judge mode — verdict simulator
  court/page.tsx            # Court system guide
  document/page.tsx         # Document analyzer
  reform/page.tsx           # Zan-Reform
  api/
    chat/route.ts           # POST /api/chat   — RAG + Gemini
    judge/route.ts          # POST /api/judge  — RAG + Gemini
    document/route.ts       # POST /api/document
    reform/route.ts         # POST /api/reform
    tts/route.ts            # POST /api/tts    — ElevenLabs → Azure → Google → fallback
components/
  Navbar.tsx  Footer.tsx  Logo.tsx
  LangProvider.tsx  LanguageToggle.tsx
  ChatMessage.tsx  VoiceInput.tsx  useVoice.ts
  PanicButton.tsx  Disclaimer.tsx
lib/
  anthropic.ts              # Gemini client + fallback chain + thinkingBudget
  systemPrompts.ts          # All mode-specific system prompts
  rag.ts                    # BM25 retrieval over Constitution articles
  laws/
    constitution.ts         # Full text of all key Constitution articles (2026)
  i18n.ts                   # Kazakh / Russian / English UI strings
  utils.ts                  # cn() + minimal markdown renderer
public/
  favicon.svg               # Emblem-style logo
```

---

## Features

- [x] **AI legal chat** — text + voice (Web Speech API)
- [x] **Voice output** — auto-speak toggle, stop button, multi-provider TTS
- [x] **Judge Mode** — balanced two-side simulation
- [x] **Court system page** — instances, steps, roles, FAQ
- [x] **Real-time scenarios** — police / labor / fine / military commissariat
- [x] **Document analyzer** — paste contract / fine / summons
- [x] **3 languages** — Kazakh (default) / Russian / English, persisted in localStorage
- [x] **Panic SOS button** — emergency calls (102, 103, 112, 1414)
- [x] **Zan-Reform** — problem analysis + reform proposals to parliament
- [x] **RAG over Constitution** — never invents articles, always quotes real text
- [x] **API fallback chain** — service stays up even if one Gemini model fails
- [x] **Animated, government-feel UI** — emblem logo, gavel strike on Judge page
- [x] **Legal disclaimer** on every page

---

## Disclaimer

> **Бұл жүйе ресми заң кеңесі емес. Ақпарат тек анықтамалық мақсатта беріледі.**
>
> Эта система не является официальной юридической консультацией. Информация предоставляется только в справочных целях.
>
> This system is not official legal advice. Information is provided for reference only.
