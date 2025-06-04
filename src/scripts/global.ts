import jquery from "jquery";
import { addStyle } from "../utils";

(function () {
  "use strict";
  window.$ = jquery;
  window.GM_addStyle = addStyle;

  $(window).on("load", function () {});

  // 监听消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("-- [ message ] --", message);

    if (message.action === "injectScript") {
      const sandboxFrame = document.createElement("iframe");
      sandboxFrame.src = chrome.runtime.getURL("../sandbox.html");
      sandboxFrame.style.display = "none"; // 隐藏 iframe
      document.body.appendChild(sandboxFrame);

      // 等待 iframe 加载完成
      sandboxFrame.onload = () => {
        // 向沙盒发送代码执行请求
        sandboxFrame?.contentWindow?.postMessage(
          {
            type: "executeCode",
            code: message.code,
          },
          "*",
        );
      };

      // 监听沙盒返回的结果
      window.addEventListener("message", (event) => {
        if (event.source === sandboxFrame.contentWindow) {
          switch (event.data.type) {
            case "GM_addStyle":
              window.GM_addStyle(event.data.result);
              break;
            case "jquery":
              console.log("-- [ jquery ] --", event);
              window.$(event.data.result);
              break;
          }
        }
      });
    }
  });
})();
