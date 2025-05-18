import jQuery from "jquery";

declare global {
  interface Window {
    $: typeof jQuery;
    GM_addStyle:  (css: string) => void;
  }
  function GM_addStyle(css: string): void;
}
