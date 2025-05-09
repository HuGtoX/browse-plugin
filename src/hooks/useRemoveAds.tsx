import { useState, useEffect } from "react";

const useRemoveAds = () => {
  const [removeAdsEnabled, setRemoveAdsEnabled] = useState<boolean>(true);

  // 初始化状态
  useEffect(() => {
    chrome.storage.sync.get(["removeAdsEnabled"], (result) => {
      if (result.removeAdsEnabled !== undefined) {
        setRemoveAdsEnabled(result.removeAdsEnabled);
      }
    });
  }, []);

  // 处理关闭 Google 广告功能开关变化
  const handleRemoveAdsToggle = () => {
    const newState = !removeAdsEnabled;
    setRemoveAdsEnabled(newState);
    chrome.storage.sync.set({ removeAdsEnabled: newState }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id!, {
            action: "toggleRemoveAds",
            enabled: newState,
          });
        }
      });
    });
  };

  return {
    removeAdsEnabled,
    handleRemoveAdsToggle,
  };
};

export default useRemoveAds;
