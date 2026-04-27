/**
 * Lightweight keyword-based RAG over Kazakhstan's legal corpus.
 *
 * No embeddings, no vector DB — just BM25-style keyword scoring.
 * Good enough for a demo, runs in <5 ms per query, no external API.
 */

import { CONSTITUTION_ARTICLES, tokenize, type ConstArticle } from "./laws/constitution";

/** Synonyms / topical anchors. Boosts retrieval for natural-language queries. */
const SYNONYMS: Record<string, string[]> = {
  // Russian → Kazakh
  полиция: ["полиция", "жол", "тоқтату", "ұстау", "қпк"],
  остановили: ["тоқтатты", "ұстады", "санкция"],
  штраф: ["айыппұл", "әқбтк", "жаза"],
  суд: ["сот", "судья", "сот төрелігі"],
  адвокат: ["адвокат", "заңгер", "көмек"],
  права: ["құқық", "бостандық", "құқықтар"],
  свобода: ["бостандық", "еркіндік"],
  жилье: ["тұрғын", "пәтер", "үй"],
  работа: ["еңбек", "жұмыс", "жұмысшы"],
  семья: ["отбасы", "неке", "ата-ана", "бала"],
  // Kazakh anchors that map to multiple article topics
  "ұстау": ["қамау", "тұтқындау", "16-бап", "санкция"],
  "айыппұл": ["жаза", "әқбтк", "санкция"],
  "құпия": ["18-бап", "телефон", "хат"],
  "сөйлеу": ["сөз", "20-бап", "цензура"],
  "пікір": ["сөз", "20-бап"],
  "жиналыс": ["32-бап", "митинг", "шеру"],
  "білім": ["30-бап", "оқу"],
  "денсаулық": ["29-бап", "медицина"],
  "сайлау": ["33-бап", "референдум"],
  "тіл": ["7-бап", "қазақ", "орыс"],
  "тұрғын": ["25-бап"],
  "меншік": ["6-бап", "26-бап", "мүлік"],
  "өмір": ["15-бап", "өлім жазасы"],
  "қадір": ["17-бап", "азаптау"],
  "теңдік": ["14-бап", "кемсіту", "дискриминация"],
  "судья": ["77-бап", "тәуелсіздік", "сот"],
  "конституция": ["4-бап", "91-бап"]
};

/** Expand the query with synonyms before scoring. */
function expandQuery(query: string): string[] {
  const tokens = tokenize(query);
  const expanded = new Set(tokens);
  for (const t of tokens) {
    const syns = SYNONYMS[t];
    if (syns) syns.forEach((s) => tokenize(s).forEach((w) => expanded.add(w)));
  }
  return [...expanded];
}

/** Score one article against the query tokens. */
function scoreArticle(article: ConstArticle, queryTokens: string[]): number {
  const haystack = tokenize(article.title + " " + article.text);
  if (haystack.length === 0) return 0;

  let score = 0;
  const seen = new Set<string>();
  for (const q of queryTokens) {
    let hits = 0;
    for (const h of haystack) {
      if (h === q) hits++;
      else if (h.startsWith(q) && q.length >= 4) hits += 0.5;
    }
    if (hits > 0) {
      score += hits;
      // bonus for matching the title — title hits are stronger signal
      if (article.title.toLowerCase().includes(q)) score += 2;
      // first-time match bonus (rewards diverse coverage)
      if (!seen.has(q)) {
        score += 1;
        seen.add(q);
      }
    }
  }
  // small length normalization so long articles don't dominate by chance
  return score / Math.sqrt(haystack.length / 20);
}

/** Returns the top-K constitutional articles relevant to the query. */
export function retrieveConstitutionArticles(
  query: string,
  topK = 6
): ConstArticle[] {
  const tokens = expandQuery(query);
  if (tokens.length === 0) return [];

  const scored = CONSTITUTION_ARTICLES.map((a) => ({
    a,
    s: scoreArticle(a, tokens)
  }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s);

  return scored.slice(0, topK).map((x) => x.a);
}

/** Format retrieved articles as a context block for the LLM prompt. */
export function formatRagContext(articles: ConstArticle[]): string {
  if (articles.length === 0) return "";
  const lines = articles.map(
    (a) => `### ҚР Конституциясы ${a.number}-бап. ${a.title}\n${a.text}`
  );
  return [
    "===== РЕТРИВЕР ТАПҚАН ҚОЛДАНЫСТАҒЫ ҚР КОНСТИТУЦИЯСЫНЫҢ БАПТАРЫ =====",
    "(Бұл — нақты заң мәтіні. Сен өз жауабыңды СОЛ БАПТАРҒА сүйеніп беруге МІНДЕТТІСІҢ.",
    "Әрбір сілтемеде осы баптарды дәлме-дәл атап, олардың мазмұнын келтір.)",
    "",
    ...lines,
    "",
    "===== РЕТРИВЕР БЛОГЫНЫҢ СОҢЫ ====="
  ].join("\n");
}

/** Convenience: retrieve and format in one call. */
export function buildRagContext(query: string, topK = 6): string {
  return formatRagContext(retrieveConstitutionArticles(query, topK));
}
