"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ERP, erpHref } from "@/lib/site";
import { useLogout } from "@/components/auth/LogoutButton";

/**
 * Where a visitor signs in, as one header control instead of two links.
 *
 *  - Client Portal   this website (/login, or /portal when already signed in)
 *  - Partner Portal  the invitation-only VYNTEX Partner Portal on
 *                    erp.vyntexusa.com, carrying the visitor's language and
 *                    theme like every other link to the ERP.
 *
 * When the website session exists the trigger reads "My portals" and the menu
 * also holds Log out (the drawer keeps its own Log out button).
 *
 * Accessible menu button: aria-haspopup / aria-expanded on the trigger,
 * ArrowDown / ArrowUp / Home / End move between the rows, Escape closes and
 * returns focus to the trigger, Tab or a click anywhere else closes it.
 */
export function usePortalLinks(authed: boolean) {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  return {
    client: {
      href: authed ? "/portal" : "/login",
      title: t.portals.client,
      desc: t.portals.clientDesc,
      Icon: authed ? LayoutDashboard : LogIn,
    },
    partner: {
      href: erpHref(ERP.paths.partners, { lang, theme }),
      title: t.portals.partner,
      desc: t.portals.partnerDesc,
      hint: t.portals.partnerTitle,
      Icon: ShieldCheck,
    },
  };
}

function menuItems(refs: (HTMLElement | null)[]): HTMLElement[] {
  return refs.filter((el): el is HTMLElement => Boolean(el));
}

/** Focus row i, wrapping around (-1 is the last row). */
function focusAt(refs: (HTMLElement | null)[], i: number) {
  const list = menuItems(refs);
  if (list.length === 0) return;
  list[(i + list.length) % list.length].focus();
}

export default function PortalMenu({ authed }: { authed: boolean }) {
  const { t } = useLang();
  const links = usePortalLinks(authed);
  const { busy, logout } = useLogout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const focusOnOpen = useRef<"first" | "last" | null>(null);
  const menuId = useId();
  const label = authed ? t.portals.myPortals : t.portals.signIn;

  const items = () => menuItems(itemsRef.current);
  const focusItem = (i: number) => focusAt(itemsRef.current, i);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Focus the requested row once the menu has rendered.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusAt(itemsRef.current, focusOnOpen.current === "first" ? 0 : -1);
    focusOnOpen.current = null;
  }, [open]);

  // Click / tap outside closes.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  const onTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (open) {
        focusItem(e.key === "ArrowDown" ? 0 : -1);
      } else {
        focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last";
        setOpen(true);
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    }
  };

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = items().indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(i + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(i - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(-1);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="vx-portal-menu relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        className="vx-portal-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        data-testid="portal-menu-trigger"
        onClick={(e) => {
          // Enter / Space arrive as a click with detail 0: open and move focus
          // to the first row (menu button pattern). A pointer click opens
          // without moving focus.
          if (!open && e.detail === 0) focusOnOpen.current = "first";
          setOpen((v) => !v);
        }}
        onKeyDown={onTriggerKey}
      >
        <span>{label}</span>
        <ChevronDown size={14} aria-hidden className="vx-portal-menu__chevron" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="vx-portal-menu__panel"
          data-testid="portal-menu"
          onKeyDown={onMenuKey}
        >
          <p className="vx-portal-menu__heading" aria-hidden="true">
            {t.portals.menuHeading}
          </p>

          <Link
            ref={(el) => {
              itemsRef.current[0] = el;
            }}
            href={links.client.href}
            role="menuitem"
            className="vx-portal-menu__item"
            data-testid="portal-menu-client"
            onClick={() => setOpen(false)}
          >
            <span className="vx-portal-menu__icon" aria-hidden="true">
              <links.client.Icon size={17} />
            </span>
            <span className="vx-portal-menu__text">
              <span className="vx-portal-menu__title">{links.client.title}</span>
              <span className="vx-portal-menu__desc">{links.client.desc}</span>
            </span>
            <ArrowRight size={15} aria-hidden className="vx-portal-menu__go" />
          </Link>

          <a
            ref={(el) => {
              itemsRef.current[1] = el;
            }}
            href={links.partner.href}
            role="menuitem"
            title={links.partner.hint}
            className="vx-portal-menu__item"
            data-variant="partner"
            data-testid="portal-menu-partner"
            onClick={() => setOpen(false)}
          >
            <span className="vx-portal-menu__icon" aria-hidden="true">
              <links.partner.Icon size={17} />
            </span>
            <span className="vx-portal-menu__text">
              <span className="vx-portal-menu__title">{links.partner.title}</span>
              <span className="vx-portal-menu__desc">
                <Lock size={11} aria-hidden className="vx-portal-menu__lock" />
                {links.partner.desc}
              </span>
            </span>
            <ArrowUpRight size={15} aria-hidden className="vx-portal-menu__go" />
          </a>

          {/* Signed in to the website: Log out lives here on desktop, where a
              separate button would push the header row past 1280px. */}
          {authed ? (
            <>
              <div className="vx-portal-menu__sep" role="separator" />
              <button
                ref={(el) => {
                  itemsRef.current[2] = el;
                }}
                type="button"
                role="menuitem"
                className="vx-portal-menu__logout"
                data-testid="portal-menu-logout"
                disabled={busy}
                onClick={logout}
              >
                {busy ? (
                  <Loader2 size={15} aria-hidden className="animate-spin" />
                ) : (
                  <LogOut size={15} aria-hidden />
                )}
                {busy ? t.portal.loggingOut : t.portal.logout}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The same two destinations for the phone / tablet drawer: two equal tiles side
 * by side (stacked under 360px), each with icon, title and one-line description.
 */
export function PortalTiles({ authed, onNavigate }: { authed: boolean; onNavigate?: () => void }) {
  const { t } = useLang();
  const links = usePortalLinks(authed);
  return (
    <nav aria-label={authed ? t.portals.myPortals : t.portals.signIn} className="vx-portal-tiles">
      <Link
        href={links.client.href}
        onClick={onNavigate}
        className="vx-portal-tile"
        data-testid="drawer-client-portal"
      >
        <span className="vx-portal-tile__top">
          <span className="vx-portal-menu__icon" aria-hidden="true">
            <links.client.Icon size={16} />
          </span>
          <ArrowRight size={15} aria-hidden className="vx-portal-menu__go" />
        </span>
        <span className="vx-portal-tile__title">{links.client.title}</span>
        <span className="vx-portal-tile__desc">{links.client.desc}</span>
      </Link>
      <a
        href={links.partner.href}
        onClick={onNavigate}
        title={links.partner.hint}
        className="vx-portal-tile"
        data-variant="partner"
        data-testid="drawer-partner-portal"
      >
        <span className="vx-portal-tile__top">
          <span className="vx-portal-menu__icon" aria-hidden="true">
            <links.partner.Icon size={16} />
          </span>
          <ArrowUpRight size={15} aria-hidden className="vx-portal-menu__go" />
        </span>
        <span className="vx-portal-tile__title">{links.partner.title}</span>
        <span className="vx-portal-tile__desc">
          <Lock size={11} aria-hidden className="vx-portal-menu__lock" />
          {links.partner.desc}
        </span>
      </a>
    </nav>
  );
}
