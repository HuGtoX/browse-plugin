import jquery from "jquery";
import { addStyle, isUrlMatched, injectScript } from "../utils";
(function () {
  "use strict";
  window.$ = jquery;
  window.GM_addStyle = addStyle;

  $(window).on("load", function () {
    console.log("jquery", jquery);
  });
})();

// 在后台脚本中监听页面加载完成事件
chrome.webNavigation.onCompleted.addListener((details) => {
  const url = details.url;
  chrome.storage.local.get("scripts", (result) => {
    const scripts = result.scripts || [];
    scripts.forEach((script: Record<string, any>) => {
      if (isUrlMatched(url, script.match)) {
        // 检查URL是否匹配
        injectScript(script.code, script.id);
      }
    });
  });
});
