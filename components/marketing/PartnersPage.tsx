"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { RESELLER_PROGRAM } from "@/lib/reseller-program";
import { ERP, erpHref } from "@/lib/site";

/**
 * /partners and /es/socios. The partner sign-in on this page IS the VYNTEX
 * Partner Portal (erp.vyntexusa.com/partners/signin, invitation only), so the
 * hero has exactly one partner sign-in. /login and the older /portal/partner
 * area still exist; this page just no longer sends partners there.
 */
export default function PartnersPage() {
  const { lang, t } = useLang();
  const { theme } = useTheme();
  const en = lang === "en";

  const points = en
    ? [
        "Offer professional digital services through your existing client relationships",
        "Use a structured partner portal and protected wholesale library after activation",
        "Submit client orders while VYNTEX handles approved technical delivery",
        "Set your client-facing price subject to the reseller agreement and retail-pricing rules",
        "Track activation, agreement, orders, qualifying sales, and renewal status",
      ]
    : [
        "Ofrece servicios digitales profesionales a los clientes que ya tienes",
        "Usa un portal para socios y una biblioteca mayorista protegida una vez activada tu cuenta",
        "Envía los pedidos de tus clientes y VYNTEX se encarga de la entrega técnica aprobada",
        "Pon tu propio precio al cliente, siguiendo el acuerdo de revendedor y las reglas de precios",
        "Lleva el control de tu activación, tu acuerdo, tus pedidos, tus ventas que califican y tu renovación",
      ];

  return (
    <PageShell>
      <MarketingHero
        eyebrow={en ? "Authorized Reseller Program" : "Programa de Revendedores Autorizados"}
        title={
          en
            ? "Expand your service offering without building a technical production department"
            : "Amplía tus servicios sin tener que armar un departamento técnico"
        }
        description={
          en
            ? "Approved partners can offer eligible VYNTEX solutions through their own client relationships while VYNTEX completes the approved technical work."
            : "Como socio aprobado, ofreces soluciones elegibles de VYNTEX a tus propios clientes y VYNTEX hace el trabajo técnico aprobado."
        }
        primaryHref="/partners/apply"
        primaryLabel={en ? "Apply to Become a Partner" : "Solicitar ser socio"}
        secondaryHref={erpHref(ERP.paths.partners, { lang, theme })}
        secondaryLabel={en ? "Partner Login" : "Acceso de socios"}
        secondaryIcon={<ArrowUpRight size={17} aria-hidden className="text-vx-cyan" />}
        secondaryTitle={t.portals.partnerTitle}
        secondaryTestId="partners-portal-signin"
      >
        <p
          className="mt-4 flex items-start gap-2 text-xs leading-5 text-vx-muted"
          data-testid="partners-portal-note"
        >
          <ShieldCheck size={14} aria-hidden className="mt-[3px] shrink-0 text-vx-cyan" />
          {t.portals.existingNote}
        </p>
      </MarketingHero>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_.75fr]">
          <div>
            <h2 className="text-3xl font-semibold">{en ? "How the program works" : "Cómo funciona el programa"}</h2>
            <ul className="mt-7 space-y-4">
              {points.map((x) => (
                <li key={x} className="rounded-xl border border-[rgba(14,165,233,.14)] bg-vx-bg2 p-5 text-vx-silver">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-2xl border border-[rgba(34,211,238,.22)] bg-vx-bg2 p-7">
            <h2 className="text-2xl font-semibold">{en ? "Program requirements" : "Requisitos del programa"}</h2>
            <p className="mt-6 font-mono text-4xl text-vx-cyan">{RESELLER_PROGRAM.activationFee}</p>
            <p className="text-vx-muted">{en ? "annual activation" : "activación anual"}</p>
            <p className="mt-6 text-vx-silver">
              {en
                ? `Minimum ${RESELLER_PROGRAM.minimumResalesPerYear} qualifying resales per 12-month period. Approval, signed agreement, and confirmed activation payment are required before confidential pricing access.`
                : `Necesitas al menos ${RESELLER_PROGRAM.minimumResalesPerYear} reventas que califiquen en cada período de 12 meses. Antes de ver los precios confidenciales, tu solicitud tiene que estar aprobada, el acuerdo firmado y el pago de activación confirmado.`}
            </p>
            <div className="mt-7">
              <Button href="/partners/apply">{en ? "Submit Application" : "Enviar solicitud"}</Button>
            </div>
          </aside>
        </Container>
      </section>
    </PageShell>
  );
}
