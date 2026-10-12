/**
 * Theme constants shared by the server layout (no-flash script, viewport
 * colour) and the client ThemeProvider. Deliberately not a client module.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "vx-theme";
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
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="dark"&&t!=="light")t="${DEFAULT_THEME}";d.setAttribute("data-theme",t);d.style.colorScheme=t;var c=t==="dark"?"${THEME_COLOR.dark}":"${THEME_COLOR.light}";var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute("content",c)}catch(e){}})();`;
