/**
 * Theme constants shared by the server layout (no-flash script, viewport
 * colour) and the client ThemeProvider. Deliberately not a client module.
 */

export type Theme = "light" | "dark";

// Renamed when night became the default (Oct 2026), so every visitor starts
// on night once; choices made from then on are kept.
export const THEME_STORAGE_KEY = "vx-mode";
/**
 * Shared with erp.vyntexusa.com: a cookie on .vyntexusa.com that both sites
 * read and write, so a day/night switch on either one carries over.
 */
export const THEME_COOKIE = "vx_mode";
/** Night is the default on every device, whatever the system appearance. */
export const DEFAULT_THEME: Theme = "dark";
/** Browser chrome colour (mobile address bar) per theme. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#F4F7FC",
  dark: "#050714",
};


/**
 * Runs inline in <head> before first paint. Kept as a string so it ships
 * without a network request. Every visit opens in night, on every device and
 * whatever the system appearance (owner's rule): a day switch lasts for that
 * visit only, so a day choice remembered by earlier versions (saved value or
 * shared cookie) is cleared here.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,t="${DEFAULT_THEME}";try{localStorage.removeItem("${THEME_STORAGE_KEY}")}catch(e){}try{var h=location.hostname,p=h==="vyntexusa.com"||/\\.vyntexusa\\.com$/.test(h);document.cookie="${THEME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax";if(p)document.cookie="${THEME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Domain=.vyntexusa.com"}catch(e){}d.setAttribute("data-theme",t);d.style.colorScheme=t;var c=t==="dark"?"${THEME_COLOR.dark}":"${THEME_COLOR.light}";var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute("content",c)}catch(e){}})();`;
