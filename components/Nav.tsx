"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { localizedPath } from "@/lib/seo-routes";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { NAV_LINKS, SECTION_IDS, SITE, CONTACT_HREFS } from "@/lib/site";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import LanguageToggle from "@/components/ui/LanguageToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ErpLaunchButton from "@/components/ui/ErpLaunchButton";
import PortalMenu, { PortalTiles } from "@/components/ui/PortalMenu";
import LogoutButton from "@/components/auth/LogoutButton";
import { openConsultation } from "@/components/BookConsultation";

/**
 * Sticky, responsive navigation.
 * - Hash links scroll to sections and update the URL natively (back/forward,
 *   refresh, and direct #hash URLs all work with no extra JS).
 * - Active section is highlighted via IntersectionObserver (does not push
 *   history entries).
 * - Mobile drawer closes on ESC, on outside click, and on link selection.
 */
export default function Nav() {
  const { t, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [, setActive] = useState<string>(SECTION_IDS.home);
  const [authed, setAuthed] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Reflect auth state (client-side only) to toggle Login vs Portal.
  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (active) setAuthed(Boolean(data.user));
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setAuthed(Boolean(session?.user));
      });
      unsub = () => data.subscription.unsubscribe();
    } catch {
      /* Supabase unconfigured — treat as signed out. */
    }
    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  // Nav shadow after scrolling past the hero fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = [SECTION_IDS.home, ...NAV_LINKS.map((l) => SECTION_IDS[l.key])];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Drawer: ESC to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Drawer: outside click to close.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Delay so the opening click doesn't immediately close it.
    const id = window.setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const Wordmark = (
    <Link
      href={localizedPath("/", lang)}
      // shrink-0 is load-bearing: without it flex shrinks the logo past its
      // content and it collides with the first nav link.
      className="flex shrink-0 items-center gap-2.5"
      aria-label={SITE.name}
      onClick={() => setOpen(false)}
    >
      {/* The mark is drawn for a dark ground, so it always sits on its own
          obsidian tile; in day mode the tile becomes a visible brand chip. */}
      <span className="vx-logo-tile" aria-hidden="true">
        <Image
          src="/vyntex-mark.png"
          alt="VYNTEX company logo"
          width={44}
          height={38}
          priority
          className="vx-logo-img w-auto"
        />
      </span>
      <span className="vx-wordmark whitespace-nowrap text-lg font-bold">
        VYNTEX
      </span>
    </Link>
  );

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-shadow",
          "border-[rgba(14,165,233,0.12)] bg-vx-bg/80",
          scrolled ? "shadow-vx-nav" : "shadow-none",
        ].join(" ")}
      >
      <nav
        aria-label={t.a11y.primaryNav}
        className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-5 xl:max-w-[1360px] xl:gap-3 2xl:max-w-[1440px] 2xl:gap-4 2xl:px-8"
      >
        {Wordmark}

        {/*
          Desktop links.

          BREAKPOINT: xl (1280px), not lg (1024px). Eight links plus a language
          toggle, the sign-in menu, and two buttons cannot fit in the ~1136px of
          usable width at lg, so flex would shrink them past their content and they
          would overlap. Below xl the drawer handles navigation, which is the
          honest answer rather than a squeezed one.

          WIDTH: the row needs about 1230px in Spanish at xl sizes and about
          1310px at 2xl sizes, more than the 1200px page container, so the
          header container widens (1360px at xl, 1440px at 2xl; gutters 20px
          at xl, 32px at 2xl) and the gaps tighten at xl. Measured at 1280, 1440 and
          1920 in both languages, signed in and out.

          whitespace-nowrap + shrink-0 mean a label can never wrap to a second
          line and an item can never be compressed into its neighbour.
        */}
        <ul className="hidden shrink-0 items-center gap-3 xl:flex 2xl:gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = false;
            return (
              <li key={link.key} className="shrink-0">
                <Link
                  href={localizedPath(link.href, lang)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "relative whitespace-nowrap text-[0.8125rem] font-medium transition-colors 2xl:text-sm",
                    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full",
                    "after:origin-left after:scale-x-0 after:bg-vx-blue after:transition-transform after:duration-200",
                    isActive
                      ? "text-vx-ink after:scale-x-100"
                      : "text-vx-muted hover:text-vx-ink hover:after:scale-x-100",
                  ].join(" ")}
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-1.5 xl:flex 2xl:gap-3">
          <LanguageToggle />
          <ThemeToggle />

          {/* One "Sign in" menu (Client Portal + Partner Portal) instead of
              separate links. Signed in, it reads "My portals" and holds Log out:
              a separate Log out button pushed the row past 1280px. */}
          <PortalMenu authed={authed} />

          <ErpLaunchButton />

          <Button
            onClick={openConsultation}
            variant="ghost"
            size="sm"
            className="shrink-0 xl:px-3.5 2xl:px-4"
          >
            {t.actions.bookConsultation}
          </Button>
        </div>

        {/* Mobile / tablet: the ERP launcher and the theme switch stay one tap
            away in the bar itself; everything else lives in the drawer. */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <ErpLaunchButton variant="compact" />
          <ThemeToggle />
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[rgba(14,165,233,0.25)] p-2 text-vx-ink xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div
          id="mobile-drawer"
          ref={drawerRef}
          className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[rgba(14,165,233,0.12)] bg-vx-bg2/95 backdrop-blur-xl xl:hidden"
        >
          <ul className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={localizedPath(link.href, lang)}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-base text-vx-muted hover:bg-vx-bg3 hover:text-vx-ink"
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-[rgba(14,165,233,0.12)] px-5 py-4">
            <ErpLaunchButton variant="block" onNavigate={() => setOpen(false)} />
            <div className="flex items-center justify-between">
              <LanguageToggle />
              <a
                href={CONTACT_HREFS.phone}
                className="inline-flex items-center gap-2 font-mono text-sm text-vx-silver"
              >
                <Phone size={15} aria-hidden />
                {SITE.phone}
              </a>
            </div>
            <PortalTiles authed={authed} onNavigate={() => setOpen(false)} />
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setOpen(false);
                openConsultation();
              }}
            >
              {t.actions.bookConsultation}
            </Button>
            {authed ? <LogoutButton className="w-full justify-center" /> : null}
          </div>
        </div>
      ) : null}
      </header>
    </>
  );
}
