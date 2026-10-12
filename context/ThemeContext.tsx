"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Day / night theme.
 *
 * Day is the default. The real switch happens on <html data-theme>, which the
 * inline script in app/layout.tsx sets before first paint (no flash); this
 * context only mirrors it for React and performs the animated change.
 *
 * The change is a circular reveal from the toggle (View Transitions API) and
 * falls back to a short colour cross-fade in browsers without it. Reduced
 * motion gets an instant swap.
 */

import {
  DEFAULT_THEME,
  THEME_COLOR,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

export type { Theme };

interface ThemeContextValue {
  theme: Theme;
  /** Switch theme. Pass the toggle element so the reveal grows from it. */
  setTheme: (next: Theme, origin?: HTMLElement | null) => void;
  toggleTheme: (origin?: HTMLElement | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(v: unknown): v is Theme {
  return v === "light" || v === "dark";
}

function readDomTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const t = document.documentElement.dataset.theme;
  return isTheme(t) ? t : DEFAULT_THEME;
}

function applyDom(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLOR[next]));
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR renders the default; the inline script has already painted the saved
  // choice, so we read it back after mount.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const initial = readDomTheme();
    applyDom(initial);
    setThemeState(initial);
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && isTheme(e.newValue)) {
        applyDom(e.newValue);
        setThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: Theme, origin?: HTMLElement | null) => {
    if (readDomTheme() === next) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode: the choice lasts for this page view */
    }

    const commit = () => {
      applyDom(next);
      setThemeState(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as ViewTransitionDoc;

    if (reduce) {
      commit();
      return;
    }

    if (typeof doc.startViewTransition === "function") {
      const rect = origin?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 64;
      const y = rect ? rect.top + rect.height / 2 : 36;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const root = document.documentElement;
      root.classList.add("vx-theme-vt");
      const vt = doc.startViewTransition(commit);
      vt.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            {
              duration: 680,
              easing: "cubic-bezier(.22,1,.36,1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => undefined);
      vt.finished.finally(() => root.classList.remove("vx-theme-vt"));
      return;
    }

    // Fallback: a short cross-fade of colours across the page.
    const root = document.documentElement;
    root.classList.add("vx-theme-fade");
    commit();
    window.setTimeout(() => root.classList.remove("vx-theme-fade"), 450);
  }, []);

  const toggleTheme = useCallback(
    (origin?: HTMLElement | null) => setTheme(readDomTheme() === "dark" ? "light" : "dark", origin),
    [setTheme],
  );

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
