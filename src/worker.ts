import { isUrlMatched, injectScript } from "./utils";

chrome.webNavigation.onCompleted.addListener((details) => {
  console.log('-- [ details ] --', details);
  const url = details.url;
  chrome.storage.local.get("scripts", (result) => {
    const scripts = result.scripts || [];
    console.log("-- [ scripts ] --", scripts);
    scripts.forEach((script: Record<string, any>) => {
      if (script.enabled && isUrlMatched(url, script.match)) {
        // 仅执行已开启且URL匹配的脚本
        injectScript(script.code, script.id);
      }
    });
  });
});
