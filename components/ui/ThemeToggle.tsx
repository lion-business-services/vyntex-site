"use client";

import { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LanguageContext";

/**
 * Day / night switch.
 *
 * The visual state (knob position, sun vs moon, stars) is driven purely by
 * <html data-theme> in CSS, so it is correct on the very first paint, before
 * React hydrates. React only supplies the accessible state and the click.
 * The theme change itself is a circular reveal that grows from this button.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const ref = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";
  const label = isDark ? t.theme.toLight : t.theme.toDark;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={() => toggleTheme(ref.current)}
      className={["vx-theme-toggle", className].filter(Boolean).join(" ")}
    >
      <span className="vx-theme-toggle__track" aria-hidden="true">
        <span className="vx-theme-toggle__stars">
          <i />
          <i />
          <i />
        </span>
        <span className="vx-theme-toggle__knob">
          {/* Sun */}
          <svg className="vx-theme-toggle__sun" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </g>
          </svg>
          {/* Moon */}
          <svg className="vx-theme-toggle__moon" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
