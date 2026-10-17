import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import {
  AI_TRAINING_CRAWLERS,
  AI_TRAINING_CRAWLERS_ALLOWED,
  PRIVATE_PATHS,
  SEARCH_CRAWLERS,
} from "@/lib/crawlers";

/**
 * robots.txt. The policy itself lives in lib/crawlers.ts.
 *
 * Protected and transactional areas are never indexed. /portal/partner can
 * render confidential wholesale pricing for an authorized partner, so it is
 * excluded here AND marked noindex in its page metadata AND gated server-side:
 * three independent layers, none of which is the actual security boundary
 * (that is getPartnerAccess).
 */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = [...PRIVATE_PATHS];
  return {
    rules: [
      // Search and AI-search crawlers: named explicitly so the intent is clear
      // to anyone reading robots.txt, and so a future wildcard change can never
      // lock them out by accident.
      { userAgent: [...SEARCH_CRAWLERS], allow: "/", disallow: privatePaths },
      // AI training crawlers: held until management approves training access.
      AI_TRAINING_CRAWLERS_ALLOWED
        ? { userAgent: [...AI_TRAINING_CRAWLERS], allow: "/", disallow: privatePaths }
        : { userAgent: [...AI_TRAINING_CRAWLERS], disallow: "/" },
      // Everyone else.
      { userAgent: "*", allow: "/", disallow: privatePaths },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
