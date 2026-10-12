/**
 * Theme constants shared by the server layout (no-flash script, viewport
 * colour) and the client ThemeProvider. Deliberately not a client module.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "vx-theme";
/**
 * Shared with erp.vyntexusa.com: a cookie on .vyntexusa.com that both sites
 * read and write, so a day/night switch on either one carries over.
 */
export const THEME_COOKIE = "vx_theme";
export const DEFAULT_THEME: Theme = "light";
/** Browser chrome colour (mobile address bar) per theme. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#F4F7FC",
  dark: "#050714",
};


/**
 * Runs inline in <head> before first paint. Kept as a string so it ships
 * without a network request. Day unless the visitor chose night.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,t=null;try{var m0=/(?:^|;\\s*)${THEME_COOKIE}=(light|dark)/.exec(document.cookie);if(m0)t=m0[1]}catch(e){}if(!t){try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}}if(t!=="dark"&&t!=="light")t="${DEFAULT_THEME}";d.setAttribute("data-theme",t);d.style.colorScheme=t;var c=t==="dark"?"${THEME_COLOR.dark}":"${THEME_COLOR.light}";var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute("content",c)}catch(e){}})();`;
