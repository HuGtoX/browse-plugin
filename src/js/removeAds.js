// 常见的 Google 广告选择器
const googleAdSelectors = [
    '.adsbygoogle', // Google AdSense 广告容器
    '.google-auto-placed', // 自动放置的 Google 广告
    '.ad-slot', // 广告插槽
    '[data-ad-client]', // 包含 data-ad-client 属性的广告
    '[data-ad-slot]' // 包含 data-ad-slot 属性的广告
];


// 等待 DOM 完全加载
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        removeGoogleAutoPlacedElements();
    });

    // 检查 document.body 是否存在
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        console.error("document.body is not available");
    }

    // 初始运行一次，删除已存在的元素
    removeGoogleAutoPlacedElements();
});

function removeGoogleAutoPlacedElements() {
    googleAdSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            ad.remove(); // 移除匹配的广告元素
        });
    });
}