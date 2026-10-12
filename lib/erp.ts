/** Public ERP origin. Configure NEXT_PUBLIC_VYNTEX_ERP_URL at deployment time if needed. */
const configured = process.env.NEXT_PUBLIC_VYNTEX_ERP_URL;
export const ERP_URL = configured && /^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(configured) ? configured.replace(/\/$/, "") : "https://erp.vyntexusa.com";
