"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Lang } from "@/lib/translations";
import { translations } from "@/lib/translations";
import { usePathname, useRouter } from "next/navigation";
import { localizedPath } from "@/lib/seo-routes";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Convenience: the resolved dictionary for the active language. */
  t: (typeof translations)[Lang];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLang }: { children: React.ReactNode; initialLang: Lang }) {
  // Locale URLs are the source of truth; no hydration-time swap of languages.
  const [lang, setLangState] = useState<Lang>(initialLang);
  const pathname = usePathname();
  const router = useRouter();

  // Keep the context synchronized after client-side navigation.
  const currentLang: Lang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
  const activeLang = lang === currentLang ? lang : currentLang;
  // Root HTML is server-rendered in the correct language on direct visits;
  // update <html lang> when Next.js performs a client-side locale navigation.
  useEffect(() => { document.documentElement.lang = activeLang; }, [activeLang]);

  const setLang = useCallback((next: Lang) => {
    if (next === activeLang) return;
    setLangState(next);
    // Never leave visitors on a Spanish URL showing English text, or vice versa.
    const mapped = localizedPath(pathname, next);
    router.push(mapped === pathname ? (next === "es" ? "/es" : "/") : mapped);
  }, [activeLang, pathname, router]);

  const toggle = useCallback(() => {
    setLang(activeLang === "en" ? "es" : "en");
  }, [activeLang, setLang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang: activeLang, setLang, toggle, t: translations[activeLang] }),
    [activeLang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
