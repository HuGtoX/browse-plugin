import { isUrlMatched, injectScript } from "./utils";

chrome.webNavigation.onCompleted.addListener((details) => {
  const url = details.url;
  chrome.storage.local.get("scripts", (result) => {
    const scripts = result.scripts || [];
    scripts.forEach((script: Record<string, any>) => {
      const match = script?.match || script?.include;

      try {
        if (script.enabled && isUrlMatched(url, match)) {
          // 仅执行已开启且URL匹配的脚本
          injectScript(script.code, script.id);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
});
