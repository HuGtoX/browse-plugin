// 常见的 Google 广告选择器
const googleAdSelectors = [
  ".adsbygoogle", // Google AdSense 广告容器
  ".google-auto-placed", // 自动放置的 Google 广告
  ".ad-slot", // 广告插槽
  "[data-ad-client]", // 包含 data-ad-client 属性的广告
  "[data-ad-slot]", // 包含 data-ad-slot 属性的广告
];

let observer: any;

function removeGoogleAutoPlacedElements() {
  googleAdSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((ad) => {
      ad.remove(); // 移除匹配的广告元素
    });
  });
}

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
document.addEventListener("DOMContentLoaded", init);
