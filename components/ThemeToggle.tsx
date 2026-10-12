"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const COOKIE = "vyntex_theme";
function storeTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(COOKIE, theme); } catch { /* private mode */ }
  const shared = location.hostname === "vyntexusa.com" || location.hostname.endsWith(".vyntexusa.com");
  document.cookie = `${COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${shared ? "; Domain=.vyntexusa.com" : ""}${location.protocol === "https:" ? "; Secure" : ""}`;
}
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const cookie = document.cookie.match(/(?:^|; )vyntex_theme=(light|dark)(?:;|$)/)?.[1];
    let saved: string | null = null;
    try { saved = localStorage.getItem(COOKIE); } catch { /* blocked */ }
    const next = cookie === "dark" || cookie === "light" ? cookie : saved === "dark" ? "dark" : "light";
    setTheme(next); storeTheme(next);
  }, []);
  return <button type="button" className={`vx-theme-switch ${className}`} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`${theme === "light" ? "Night" : "Day"} mode`} aria-pressed={theme === "dark"} onClick={() => { const next = theme === "light" ? "dark" : "light"; setTheme(next); storeTheme(next); }}>
    {theme === "light" ? <Moon size={17} aria-hidden /> : <Sun size={17} aria-hidden />}
    <span className="vx-theme-label">{theme === "light" ? "Night" : "Day"}</span>
  </button>;
}
