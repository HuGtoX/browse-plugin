// 隔离 removeGoogleAutoPlacedElements 函数
(() => {
  const googleAdSelectors = [
    ".adsbygoogle",
    ".google-auto-placed",
    ".ad-slot",
    "[data-ad-client]",
    "[data-ad-slot]",
  ];

  function removeGoogleAutoPlacedElements() {
    googleAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((ad) => {
        ad.remove();
      });
    });
  }

  let observer: any;

  function init() {
    chrome.storage.sync.get("removeAdsEnabled", (result) => {
      if (result.removeAdsEnabled !== false) {
        observer = new MutationObserver(() => {
          removeGoogleAutoPlacedElements();
        });

        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          console.error("document.body is not available");
        }

        removeGoogleAutoPlacedElements();
      }
    });
  }

  // 监听消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleRemoveAds") {
      if (message.enabled) {
        init();
      } else {
        if (observer) {
          observer.disconnect();
        }
      }
    }
  });

  // 页面加载时初始化
  $(window).on("load", init);
})();
