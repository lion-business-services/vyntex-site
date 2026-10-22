import { test, expect, type Page } from "@playwright/test";

/**
 * Public site end-to-end.
 *
 * These run against a REAL Next.js server, so they exercise the actual
 * middleware, Server Components, and route handlers. They deliberately need no
 * live Square / Supabase / Resend credentials — every assertion is about public
 * behaviour, redirects, accessibility, and the ABSENCE of confidential data.
 */

test.describe("homepage", () => {
  test("loads with exactly one H1 and the correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/VYNTEX/);
    // A single H1 per page is both an SEO and an accessibility requirement.
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("has a skip-to-content link as the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", "#main-content");
  });

  test("contains the concise public navigation and key homepage sections", async ({ page }) => {
    await page.goto("/");
    for (const id of ["home", "services", "industries"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    for (const label of ["Services", "Industries", "Partners", "About Us", "Contact"]) {
      await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
    }
  });

  test("clicking About Us opens the About page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About Us", exact: true }).first().click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("the language toggle switches the whole page to Spanish and persists", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Español|Cambiar a Español/i }).first().click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    // Persisted across a reload — the choice is not lost on navigation.
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("contains NO wholesale pricing anywhere in the delivered HTML or JS", async ({
    page,
  }) => {
    // The load-bearing assertion. If this ever fails, the entire partner margin
    // table is public.
    const bodies: string[] = [];
    page.on("response", async (res) => {
      const type = res.headers()["content-type"] ?? "";
      if (type.includes("javascript") || type.includes("html")) {
        try {
          bodies.push(await res.text());
        } catch {
          /* opaque response */
        }
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    const wholesaleOnly = ["$660", "$720", "$650", "$210", "$360", "$440", "$480"];
    const all = bodies.join("\n");
    for (const figure of wholesaleOnly) {
      expect(all, `wholesale figure ${figure} leaked to the public`).not.toContain(figure);
    }
    // Service prices are no longer published. Services sync from Stripe and
    // are quoted after a consultation, so retail figures must be absent too.
    const retailFigures = ["$1,100", "$1,500", "$2,000+", "$4,000+", "$149/mo", "$95"];
    for (const figure of retailFigures) {
      expect(all, `retail price ${figure} is still published`).not.toContain(figure);
    }
  });

  test("services page shows no prices and books consultations", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("h1")).toHaveCount(1);
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\$\s?\d/);
    expect(text).toMatch(/Free 30-minute consultation/i);
    expect(text).not.toMatch(/service fee/i);
    // Either Stripe-synced cards or the honest fallback — both lead to booking.
    await expect(page.getByRole("button", { name: /Book a Free Consultation/i }).first()).toBeVisible();
  });
});

test.describe("legal pages", () => {
  for (const path of ["/privacy", "/terms", "/cookies", "/accessibility"]) {
    test(`${path} loads with real content and one H1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      // Not a stub.
      const text = await page.locator("main").innerText();
      expect(text.length).toBeGreaterThan(800);
      expect(text.toLowerCase()).not.toContain("coming soon");
      expect(text.toLowerCase()).not.toContain("lorem ipsum");
    });
  }
});

test.describe("reseller application", () => {
  test("the public page loads and shows NO wholesale pricing", async ({ page }) => {
    await page.goto("/partners/apply");
    await expect(page.locator("h1")).toHaveCount(1);

    const text = await page.locator("main").innerText();
    // Public program terms ARE allowed.
    expect(text).toContain("$199");
    // Confidential figures are NOT.
    for (const figure of ["$660", "$720", "$440"]) {
      expect(text).not.toContain(figure);
    }
  });

  test("rejects an empty submission with accessible errors", async ({ page }) => {
    await page.goto("/partners/apply");
    await page.getByRole("button", { name: /Submit application/i }).click();
    // Client-side validation fires; nothing is submitted.
    await expect(page.locator("[aria-invalid='true']").first()).toBeVisible();
  });
});

test.describe("checkout", () => {
  test("public checkout is retired and redirects to services", async ({ page }) => {
    await page.goto("/checkout?service=web-standard");
    await expect(page).toHaveURL(/\/services$/);
  });

  test("the API refuses public direct orders", async ({ request }) => {
    const res = await request.post("/api/checkout/create", {
      data: { orderType: "direct", serviceKey: "web-standard" },
    });
    // 410 when reached; 400/503 if validation or payment config short-circuits first.
    expect([400, 410, 503]).toContain(res.status());
  });
});

test.describe("protected routes", () => {
  for (const path of [
    "/portal",
    "/portal/partner",
    "/portal/partner/agreement",
    "/portal/admin",
    "/portal/orders",
    "/portal/files",
  ]) {
    test(`${path} redirects an unauthenticated visitor to login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

test.describe("infrastructure routes", () => {
  test("/robots.txt disallows the portal and API", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Disallow: /portal/");
    expect(body).toContain("Disallow: /api/");
  });

  test("/sitemap.xml lists public pages and NOT the portal", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("/partners/apply");
    expect(body).not.toContain("/portal");
  });

  test("/api/health reports configuration WITHOUT leaking any secret", async ({
    request,
  }) => {
    const res = await request.get("/api/health");
    const body = await res.text();
    // It reports whether things are configured, never what they are configured with.
    expect(body).toContain("checks");
    expect(body).not.toMatch(/sq0(atp|idp)-/); // a Square token prefix
    expect(body).not.toMatch(/re_[A-Za-z0-9]{20,}/); // a Resend key
    expect(body).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/); // a Supabase JWT
  });

  test("the cron endpoints reject an unauthenticated request", async ({ request }) => {
    for (const path of [
      "/api/cron/expire-partners",
      "/api/cron/process-emails",
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(401);
    }
  });

  test("the Square webhook rejects an unsigned request", async ({ request }) => {
    const res = await request.post("/api/square/webhook", {
      data: { type: "payment.updated", event_id: "forged" },
    });
    // No signature -> no trust. A forged webhook cannot activate a partner.
    expect(res.status()).toBe(401);
  });
});

test.describe("404", () => {
  test("shows a real page with working navigation, not a dead end", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /Home/i }).first()).toBeVisible();
  });
});

test.describe("business software", () => {
  test("the header button reads Business Software and opens the ERP", async ({ page }) => {
    await page.goto("/");
    const label = page.locator("[data-testid=business-software-label]:visible").first();
    await expect(label).toBeVisible();
    await expect(label).toHaveText(/Business Software|Software/);
    const href = await page.locator("a.vx-erp-launch:visible").first().getAttribute("href");
    expect(href).toMatch(/^https:\/\/erp\.vyntexusa\.com\//);
  });

  test("the homepage shows Try Live Demo, View Software & Pricing and Book a Free Demo", async ({ page }) => {
    await page.goto("/");
    const demo = page.getByTestId("cta-try-demo");
    const pricing = page.getByTestId("cta-software-pricing");
    const book = page.getByTestId("cta-book-demo");
    for (const cta of [demo, pricing, book]) await expect(cta).toBeVisible();
    await expect(demo).toHaveText(/Try Live Demo/);
    await expect(pricing).toHaveText(/View Software & Pricing/);
    await expect(book).toHaveText(/Book a Free Demo/);
    expect(await demo.getAttribute("href")).toMatch(/^https:\/\/erp\.vyntexusa\.com\/demo/);
    expect(await pricing.getAttribute("href")).toMatch(/^https:\/\/erp\.vyntexusa\.com\/pricing/);
    // A real link to the website demo form (works without JavaScript)...
    expect(await book.getAttribute("href")).toBe("/contact?intent=demo");
    await page.screenshot({ path: `test-results/home-ctas-${test.info().project.name}.png`, fullPage: false });
  });

  test("the three actions are plain links in the server HTML (readable without JavaScript)", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("https://erp.vyntexusa.com/demo");
    expect(html).toContain("https://erp.vyntexusa.com/pricing");
    expect(html).toContain("Try Live Demo");
    expect(html).toContain("View Software &amp; Pricing");
    expect(html).toContain("Book a Free Demo");
    expect(html).toContain('href="/contact?intent=demo"');
  });

  test("the Spanish homepage has the same three actions in Spanish", async ({ page }) => {
    await page.goto("/es");
    await expect(page.getByTestId("cta-try-demo")).toHaveText(/Prueba el Demo en Vivo/);
    await expect(page.getByTestId("cta-software-pricing")).toHaveText(/Ver Software y Precios/);
    await expect(page.getByTestId("cta-book-demo")).toHaveText(/Agenda un Demo Gratis/);
    expect(await page.getByTestId("cta-try-demo").getAttribute("href")).toContain("lang=es");
    expect(await page.getByTestId("cta-book-demo").getAttribute("href")).toBe("/es/contacto?intent=demo");
  });
});

test.describe("crawler access", () => {
  test("robots.txt allows search, AI-search and AI training crawlers on public pages only", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"]) {
      expect(body).toContain(`User-Agent: ${bot}`);
    }
    expect(body).toContain("Sitemap: https://www.vyntexusa.com/sitemap.xml");

    // Each robots.txt group: its User-Agent lines plus its rules.
    const groups = body
      .split(/\r?\n\s*\r?\n/)
      .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
    const groupFor = (bot: string) => groups.find((lines) => lines.includes(`User-Agent: ${bot}`));

    // AI training crawlers: approved by management on October 22, 2026.
    for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "Applebot-Extended"]) {
      const group = groupFor(bot);
      expect(group, `${bot} group`).toBeDefined();
      expect(group, bot).toContain("Allow: /");
      expect(group, `${bot} must not be blocked from the whole site`).not.toContain("Disallow: /");
      // Private areas stay closed to them, as to everyone.
      expect(group, bot).toContain("Disallow: /api/");
      expect(group, bot).toContain("Disallow: /portal/");
    }
    for (const bot of ["Googlebot", "*"]) {
      const group = groupFor(bot);
      expect(group, `${bot} group`).toBeDefined();
      expect(group, bot).toContain("Disallow: /api/");
      expect(group, bot).toContain("Disallow: /portal/");
    }
  });

  for (const ua of [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +Claude-SearchBot@anthropic.com)",
  ]) {
    test(`${ua.match(/(Googlebot|bingbot|OAI-SearchBot|PerplexityBot|Claude-SearchBot)/)?.[1]} gets the full homepage, llms.txt and the sitemap`, async ({ request }) => {
      const home = await request.get("/", { headers: { "user-agent": ua } });
      expect(home.status()).toBe(200);
      const html = await home.text();
      expect(html).toContain('<link rel="canonical"');
      expect(html).toContain("application/ld+json");
      expect(html).toContain("https://erp.vyntexusa.com/demo");
      expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
      expect((await request.get("/llms.txt", { headers: { "user-agent": ua } })).status()).toBe(200);
      expect((await request.get("/sitemap.xml", { headers: { "user-agent": ua } })).status()).toBe(200);
    });
  }
});

test.describe("book a free demo", () => {
  const demoDialog = (page: Page, name: RegExp = /Book a free demo/i) =>
    page.getByRole("dialog", { name });

  test("the homepage Book a Free Demo button opens the demo form", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByTestId("cta-book-demo").click();
    const dialog = demoDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("demo-request-form")).toBeVisible();
    await expect(dialog.locator("#demo-fullName")).toBeVisible();
    await expect(dialog.locator("#demo-industry")).toBeVisible();
    await page.screenshot({ path: `test-results/demo-form-${test.info().project.name}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("the footer and the Business Software section link to the demo form and open it", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const footer = page.getByTestId("footer-book-demo");
    expect(await footer.getAttribute("href")).toBe("/contact?intent=demo");
    expect(await page.getByTestId("erp-book-demo").getAttribute("href")).toBe("/contact?intent=demo");
    // Keyboard activation: a plain click, without floating widgets in the way.
    await footer.focus();
    await page.keyboard.press("Enter");
    await expect(demoDialog(page)).toBeVisible();
  });

  test("the no-JavaScript address opens the demo form, in English and in Spanish", async ({ page }) => {
    await page.goto("/contact?intent=demo");
    await expect(demoDialog(page)).toBeVisible();
    await page.goto("/es/contacto?intent=demo");
    await expect(demoDialog(page, /Agenda un demo gratis/i)).toBeVisible();
  });

  test("the demo links are in the server HTML of every page (readable without JavaScript)", async ({ request }) => {
    for (const path of ["/", "/contact", "/services"]) {
      const html = await (await request.get(path)).text();
      expect(html, path).toContain('href="/contact?intent=demo"');
    }
    const es = await (await request.get("/es")).text();
    expect(es).toContain('href="/es/contacto?intent=demo"');
  });

  test("submitting an empty demo form shows accessible errors and sends nothing", async ({ page }) => {
    const posted: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/consultation")) posted.push(req.url());
    });
    await page.goto("/contact?intent=demo");
    const dialog = demoDialog(page);
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /Request my demo/i }).click();

    const invalid = dialog.locator("[aria-invalid='true']");
    await expect(invalid.first()).toBeVisible();
    expect(await invalid.count()).toBeGreaterThanOrEqual(5);
    await expect(dialog.locator("#demo-fullName")).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.locator("#demo-email")).toHaveAttribute("aria-invalid", "true");
    // Each error is text tied to its field, not just a red border.
    const describedBy = await dialog.locator("#demo-fullName").getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText(/required/i);
    await expect(dialog.getByText(/consent/i).last()).toBeVisible();
    expect(posted).toEqual([]);
  });

  test("a completed demo form posts a demo request through /api/consultation", async ({ page }) => {
    const captured: { body?: Record<string, unknown> } = {};
    // The e2e environment has no Supabase, Resend or FormSubmit: answer for the server.
    await page.route("**/api/consultation", async (route) => {
      captured.body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.goto("/contact?intent=demo&industry=clean&plan=1&billing=yearly");
    const dialog = demoDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("#demo-industry")).toHaveValue("Cleaning");

    await dialog.locator("#demo-fullName").fill("Ana Ruiz");
    await dialog.locator("#demo-businessName").fill("Acme Cleaning LLC");
    await dialog.locator("#demo-email").fill("ana@example.com");
    await dialog.locator("#demo-teamSize").selectOption("6_15");
    await dialog.locator("#demo-preferredTime").selectOption("morning");
    await dialog.getByRole("radio", { name: "WhatsApp" }).check();
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: /Request my demo/i }).click();

    // On success the dialog is relabelled by its success heading.
    await expect(page.getByRole("dialog", { name: /Demo request received/i })).toBeVisible();
    await expect(page.getByTestId("demo-request-dialog").getByRole("status")).toContainText(/one business day/i);
    const body = captured.body ?? {};
    expect(body.requestType).toBe("demo");
    expect(body.businessName).toBe("Acme Cleaning LLC");
    expect(body.industry).toBe("Cleaning");
    expect(body.teamSize).toBe("6_15");
    expect(body.preferredContact).toBe("whatsapp");
    expect(body.consent).toBe(true);
    expect(String(body.message)).toContain("middle plan");
  });

  test("the API rejects an incomplete demo request", async ({ request }) => {
    const res = await request.post("/api/consultation", { data: { requestType: "demo", fullName: "A" } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ ok: false, code: "validation" });
  });
});
