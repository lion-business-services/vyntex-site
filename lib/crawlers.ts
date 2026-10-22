/**
 * Crawler policy for robots.txt.
 *
 * Two different kinds of bots read this site, and they are treated differently
 * on purpose (management instruction, October 2026):
 *
 *  1. SEARCH and AI-SEARCH crawlers fetch pages so they can show them, link to
 *     them and quote them in answers (Google Search, Bing, ChatGPT search,
 *     Perplexity, Claude search, Apple, DuckDuckGo). They are allowed on every
 *     public page.
 *
 *  2. AI TRAINING crawlers collect pages to train models. Approved by
 *     management on October 22, 2026: they are allowed on every public page,
 *     exactly like the search crawlers. To withdraw that approval, set
 *     AI_TRAINING_CRAWLERS_ALLOWED to false; nothing else needs to change.
 *     Either setting leaves Google Search, AI Overviews, Bing Copilot,
 *     ChatGPT search and Perplexity answers untouched, because those use the
 *     search crawlers above.
 *
 * The private areas are closed to every bot either way.
 */
export const AI_TRAINING_CRAWLERS_ALLOWED = true;

/** Search engines and AI answer engines (search / user-requested fetches). */
export const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "Applebot",
  "DuckDuckBot",
  "MistralAI-User",
] as const;

/** Crawlers whose purpose is collecting training data for AI models. */
export const AI_TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "cohere-training-data-crawler",
] as const;

/** Never crawled by anyone: sign-in, client portal, APIs and transactional pages. */
export const PRIVATE_PATHS = [
  "/api/",
  "/portal/",
  "/login",
  "/verify",
  "/checkout/success",
  "/checkout/cancel",
] as const;
