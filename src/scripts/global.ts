import jquery from "jquery";
import { addStyle } from "../utils";
(function () {
  "use strict";
  window.$ = jquery;
  window.GM_addStyle = addStyle;

  $(window).on("load", function () {
    console.log("jquery", jquery);
  });

  // 监听消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("-- [ message ] --", message);

    if (message.action === "injectScript") {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = chrome.runtime.getURL("../sandbox.html");
      document.body.appendChild(iframe);

      console.log('-- [ iframe ] --', iframe);
      console.log('-- [ iframe?.contentWindow? ] --', iframe?.contentWindow);
      
      // 向沙盒发送消息（包含代码和回调标识）
      iframe?.contentWindow?.postMessage(
        { code: message.code, callbackKey: "calculateSum" },
        "*", // 建议替换为具体来源，如沙盒页面的URL
      );

      // 监听沙盒返回的结果
      window.addEventListener("message", (event) => {
        if (event.data.callbackKey === "calculateSum") {
          console.log("执行结果:", event.data.result); // 输出: 30
        }
      });
    }
  });
})();
