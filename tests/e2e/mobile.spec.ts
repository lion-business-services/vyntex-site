import { test, expect } from "@playwright/test";

/**
 * Mobile behaviour. Runs under the "mobile" Playwright project (Pixel 7).
 * The mobile experience must be designed, not merely narrower.
 */

test.describe("mobile navigation", () => {
  test("the drawer opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Open menu|Abrir menú/i });
    await trigger.click();

    const drawer = page.locator("#mobile-drawer");
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(drawer).toBeHidden();
  });

  test("the drawer closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu|Abrir menú/i }).click();
    await expect(page.locator("#mobile-drawer")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-drawer")).toBeHidden();
  });

  test("no horizontal overflow on any public page", async ({ page }) => {
    // A page that scrolls sideways on a phone is broken, however pretty it is.
    for (const path of ["/", "/partners/apply", "/checkout", "/privacy"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow, `${path} overflows horizontally`).toBe(false);
    }
  });

  test("primary tap targets are at least 44px tall", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("button", { name: /Book Consultation|Reservar una Consulta/i }).first();
    const box = await cta.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });
});

test.describe("chatbot", () => {
  test("opens, answers from published pricing, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Ask a question|Hacer una pregunta/i }).click();

    const panel = page.getByRole("dialog", { name: /VYNTEX Assistant|Asistente VYNTEX/i });
    await expect(panel).toBeVisible();

    await panel.getByRole("button", { name: /What does it cost/i }).click();

    // The answer must contain REAL published prices, read from lib/pricing.ts.
    await expect(panel.getByText("$500", { exact: false }).first()).toBeVisible();
    // And must never contain a partner cost.
    await expect(panel.getByText("$660")).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});

test.describe("business software on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("the Software button stays in the top bar and the three homepage actions stack without overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a.vx-erp-launch[data-variant="compact"]')).toBeVisible();
    for (const id of ["cta-try-demo", "cta-software-pricing", "cta-book-demo"]) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: "test-results/home-ctas-phone.png" });
  });
});

test.describe("portals in the phone drawer", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("Client Portal and Partner Portal sit side by side at the same height", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-controls="mobile-drawer"]').click();
    const client = page.getByTestId("drawer-client-portal");
    const partner = page.getByTestId("drawer-partner-portal");
    await expect(client).toBeVisible();
    await expect(partner).toBeVisible();
    const a = (await client.boundingBox())!;
    const b = (await partner.boundingBox())!;
    expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(a.height - b.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
    expect(b.x + b.width).toBeLessThanOrEqual(390);
    expect(a.height).toBeGreaterThanOrEqual(44);
    expect(await client.getAttribute("href")).toBe("/login");
    expect(await partner.getAttribute("href")).toMatch(
      /^https:\/\/erp\.vyntexusa\.com\/partners\/signin\?lang=en&theme=(dark|light)$/,
    );
    await page.screenshot({ path: "test-results/portal-drawer-phone.png" });
  });
});
