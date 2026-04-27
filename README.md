# zan.kz — AI Legal Assistant for Kazakhstan

Production-style MVP of an AI legal assistant for citizens of Kazakhstan.
Clean, government-feel UI · voice input/output · Kazakh + Russian · heavy court focus · strict legal guardrails.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Anthropic Claude API · Web Speech API.

---

## Pages

| Route        | Purpose                                                                  |
|--------------|---------------------------------------------------------------------------|
| `/`          | Landing — hero, features, court-focus strip, "how it works".              |
| `/chat`      | AI legal consultant. Text + voice in/out. Suggestion chips.               |
| `/judge`     | Judge Mode — simulates both sides of a dispute + possible outcome.        |
| `/court`     | Court system explainer — instances, steps, roles, FAQ, Ask-zan box.       |
| `/document`  | Document analyzer — paste contract / fine / summons, get structured risks.|
| `/reform`    | Zan-Reform — AI analyzes a problem and proposes citizen-protective reform.|

Every page shares: navbar, language toggle (ҚАЗ/РУС), animated logo, panic SOS button, persistent legal disclaimer.

---

## Setup

```bash
# 1. Install
npm install

# 2. Configure Claude API key
cp .env.local.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
# open http://localhost:3000
```

Anthropic key: <https://console.anthropic.com/>. Default model is `claude-sonnet-4-6`; override with `ANTHROPIC_MODEL` in `.env.local`.

---

## Folder structure

```
app/
  layout.tsx              # Root layout + Navbar/Footer + LangProvider
  page.tsx                # Landing
  globals.css             # Design tokens, animations
  chat/page.tsx           # Citizen consultation
  judge/page.tsx          # Judge simulation
  court/page.tsx          # Court system guide
  document/page.tsx       # Document analyzer
  reform/page.tsx         # Zan-Reform
  api/
    chat/route.ts         # POST /api/chat
    judge/route.ts        # POST /api/judge
    document/route.ts     # POST /api/document
    reform/route.ts       # POST /api/reform
components/
  Navbar.tsx  Footer.tsx  Logo.tsx
  LangProvider.tsx  LanguageToggle.tsx
  ChatMessage.tsx  VoiceInput.tsx  useVoice.ts
  PanicButton.tsx  Disclaimer.tsx
lib/
  anthropic.ts            # Claude client with prompt caching
  systemPrompts.ts        # All mode-specific system prompts
  i18n.ts                 # Kazakh + Russian strings
  utils.ts                # cn() + minimal markdown renderer
public/
  favicon.svg             # Emblem-style logo
```

---

## AI behavior

`lib/systemPrompts.ts` implements the project's legal guardrails. Every mode shares the **core rules**:

1. Never invent laws or article numbers.
2. Never hallucinate legal facts or case outcomes.
3. If unsure — say **"Ақпарат жеткіліксіз"** / **"Недостаточно информации"**.
4. Base answers on known legal principles (Constitution, Civil, Criminal, Administrative, Labor, Family, Tax, Criminal Procedure codes).
5. Never render a final court judgment.
6. Always clarify: informational only, not official legal advice.

Each mode (chat / judge / court / document / reform) has a specialized structure layered on top.

The system prompt is sent with `cache_control: { type: "ephemeral" }` so it's cached across turns — faster, cheaper.

---

## Features checklist

- [x] AI legal chat (text + voice via Web Speech API)
- [x] Voice output (SpeechSynthesis, "Дауыспен оқу" button)
- [x] Judge Mode — balanced simulation, never a verdict
- [x] Court system page — instances, steps, roles, FAQ, ask-zan box
- [x] Real-time scenario prompts (police / labor / fine / eviction)
- [x] Document analyzer (paste text or upload .txt)
- [x] Multi-language — Kazakh (default) + Russian, persisted in localStorage
- [x] Panic SOS button (mock alert + geolocation readout)
- [x] Zan-Reform — problem analysis + reform proposals
- [x] Animated, government-feel UI (emblem logo, courthouse hero, gavel strike)
- [x] Legal disclaimer on every page

---

## Disclaimer

> **Бұл жүйе ресми заң кеңесі емес. Ақпарат тек анықтамалық мақсатта беріледі.**
>
> Эта система не является официальной юридической консультацией. Информация предоставляется только в справочных целях.
