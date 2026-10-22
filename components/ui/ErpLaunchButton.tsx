"use client";

import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ERP, erpHref } from "@/lib/site";

/**
 * The header launcher for the "Business Software" (VYNTEX ERP at
 * erp.vyntexusa.com). Labelled "Business Software" / "Software de negocio"
 * so visitors who do not know the word ERP still find the software, its
 * live demo and its pricing.
 *
 * A chrome capsule with a live cyan edge: a conic light sweeps around the
 * border, a status dot pulses, and the arrow lifts on hover. The link carries
 * the visitor's language and theme so the ERP opens the way they were reading.
 *
 *  - "nav"     desktop header
 *  - "compact" phone / tablet top bar (always visible, beside the menu)
 *  - "block"   full width, inside the mobile drawer
 */
export default function ErpLaunchButton({
  variant = "nav",
  path = ERP.paths.home,
  onNavigate,
  className,
}: {
  variant?: "nav" | "compact" | "block";
  path?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const { t, lang } = useLang();
  const { theme } = useTheme();

  return (
    <a
      href={erpHref(path, { lang, theme })}
      title={t.erp.navTitle}
      aria-label={t.erp.navTitle}
      onClick={onNavigate}
      data-variant={variant}
      className={["vx-erp-launch vx-dark-scope", className].filter(Boolean).join(" ")}
    >
      <span className="vx-erp-launch__inner">
        <span className="vx-erp-launch__dot" aria-hidden="true" />
        <span className="vx-erp-launch__label" data-testid="business-software-label">
          {variant === "compact" ? t.erp.navShort : t.erp.navLabel}
        </span>
        {variant === "block" ? (
          <span className="vx-erp-launch__host">{ERP.host}</span>
        ) : null}
        <ArrowUpRight size={variant === "compact" ? 14 : 15} aria-hidden className="vx-erp-launch__arrow" />
      </span>
    </a>
  );
}
