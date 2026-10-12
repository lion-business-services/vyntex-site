"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Languages, Layers, Lock, ShieldCheck, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ERP, erpHref } from "@/lib/site";
import { motionTokens, revealVariants, staggerVariants } from "@/components/home/motion";

const FEATURE_ICONS = [Layers, Workflow, ShieldCheck, Languages] as const;

/**
 * Homepage showcase for VYNTEX ERP (erp.vyntexusa.com).
 *
 * The product window shows real screens captured from the ERP's public demo
 * (sample company, made-up records, labelled as such), in the visitor's
 * language and theme: both theme variants are stacked and cross-fade with
 * <html data-theme>, so the picture follows the day/night switch live.
 * Every link carries ?lang= and ?theme= so the ERP opens the same way.
 */
export default function ErpShowcase() {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const e = t.erp;
  const link = (path: string) => erpHref(path, { lang, theme });

  // Gentle 3D tilt that follows the pointer over the product window.
  const frameRef = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 18 });
  const glareX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);

  const onMove = (ev: React.PointerEvent) => {
    if (reduce || ev.pointerType !== "mouse") return;
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((ev.clientX - r.left) / r.width - 0.5);
    py.set((ev.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section id="vyntex-erp" aria-labelledby="vyntex-erp-title" className="vx-erp-section">
      <div className="vx-erp-section__bg" aria-hidden="true" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Copy */}
          <motion.div
            variants={staggerVariants}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={revealVariants} className="vx-erp-eyebrow">
              <span className="vx-erp-eyebrow__dot" aria-hidden="true" />
              <span className="font-bold">{e.eyebrow}</span>
              <span className="vx-erp-eyebrow__sep" aria-hidden="true" />
              <span className="text-vx-muted">{e.status}</span>
            </motion.p>

            <motion.h2
              variants={revealVariants}
              id="vyntex-erp-title"
              className="mt-5 text-[2.1rem] font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl"
            >
              {e.titleA}{" "}
              <span className="vx-chrome-text">{e.titleB}</span>
            </motion.h2>

            <motion.p variants={revealVariants} className="mt-5 max-w-xl text-base leading-7 text-vx-muted sm:text-[1.05rem]">
              {e.lede}
            </motion.p>

            <motion.ul variants={staggerVariants} className="mt-7 grid gap-3 sm:grid-cols-2">
              {e.features.map((f, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <motion.li key={f.title} variants={revealVariants} className="vx-erp-feature">
                    <span className="vx-erp-feature__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-vx-ink">{f.title}</span>
                      <span className="mt-1 block text-[0.8rem] leading-5 text-vx-muted">{f.body}</span>
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div variants={revealVariants} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={link(ERP.paths.demo)} className="vx-erp-cta vx-erp-cta--primary">
                {e.ctaDemo}
                <ArrowRight size={18} aria-hidden className="vx-erp-cta__arrow" />
              </a>
              <a href={link(ERP.paths.home)} className="vx-erp-cta vx-erp-cta--secondary">
                {e.ctaOpen}
                <ArrowUpRight size={18} aria-hidden className="vx-erp-cta__arrow" />
              </a>
            </motion.div>

            <motion.div variants={revealVariants} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a href={link(ERP.paths.pricing)} className="vx-erp-textlink">
                {e.ctaPricing}
              </a>
              <a href={link(ERP.paths.requestDemo)} className="vx-erp-textlink">
                {e.ctaRequest}
              </a>
            </motion.div>

            <motion.p variants={revealVariants} className="mt-4 max-w-md text-xs leading-5 text-vx-muted">
              {e.demoNote}
            </motion.p>
          </motion.div>

          {/* Product window */}
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: motionTokens.ease }}
            className="relative m-0"
            style={{ perspective: 1400 }}
          >
            <div className="vx-erp-halo" aria-hidden="true" />
            <motion.a
              ref={frameRef}
              href={link(ERP.paths.demo)}
              aria-label={e.ctaDemo}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
              className="vx-erp-window group"
            >
              <span className="vx-erp-window__bar" aria-hidden="true">
                <span className="vx-erp-window__dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="vx-erp-window__address">
                  <Lock size={11} />
                  <span>
                    {ERP.host}
                    <span className="text-vx-muted">{ERP.paths.demo}</span>
                  </span>
                </span>
                <span className="vx-erp-window__live">{t.erp.navBadge}</span>
              </span>

              <span className="vx-erp-window__screen">
                <Image
                  src={`/erp/erp-dashboard-${lang}-light.webp`}
                  alt={e.shotAlt}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="vx-erp-shot vx-erp-shot--light"
                />
                <Image
                  src={`/erp/erp-dashboard-${lang}-dark.webp`}
                  alt=""
                  aria-hidden
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="vx-erp-shot vx-erp-shot--dark"
                />
                {!reduce ? (
                  <motion.span
                    aria-hidden="true"
                    className="vx-erp-window__glare"
                    style={{ left: glareX }}
                  />
                ) : null}
                <span className="vx-erp-window__scan" aria-hidden="true" />
                <span className="vx-erp-window__hover" aria-hidden="true">
                  {e.ctaDemo}
                  <ArrowUpRight size={16} />
                </span>
              </span>
            </motion.a>
            <figcaption className="mt-4 text-center text-xs text-vx-muted">{e.shotCaption}</figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  );
}
