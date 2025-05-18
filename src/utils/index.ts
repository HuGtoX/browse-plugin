function addStyle(css: string):void {
  try {
    const style = document.createElement("style");
    style.textContent = css;
    (
      document.head ||
      document.body ||
      document.documentElement ||
      document
    ).appendChild(style);
  } catch (e) {
    console.log("Error: env: adding style " + e);
  }
}


export { addStyle };
