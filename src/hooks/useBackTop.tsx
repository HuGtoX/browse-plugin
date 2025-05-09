import { useState, useEffect } from "react";

const useBackTop = () => {
  const [backToTopEnabled, setBackToTopEnabled] = useState(false);
  // 初始化状态
  useEffect(() => {
    chrome.storage.sync.get(["backToTopEnabled"], (result) => {
      if (result.backToTopEnabled !== undefined) {
        setBackToTopEnabled(result.backToTopEnabled);
      }
    });
  }, []);

  // 处理回到顶部功能开关变化
  const handleBackToTopToggle = () => {
    const newState = !backToTopEnabled;
    setBackToTopEnabled(newState);
    chrome.storage.sync.set({ backToTopEnabled: newState }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id!, {
            action: "toggleBackToTop",
            enabled: newState,
          });
        }
      });
    });
  };

  return {
    backToTopEnabled,
    handleBackToTopToggle,
  };
};

export default useBackTop;
