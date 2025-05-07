import React, { useState, useEffect } from "react";

// 移除错误的导入语句，因为在浏览器扩展环境中，chrome 是全局对象，无需导入

const HelloReact = () => {
  const [backToTopEnabled, setBackToTopEnabled] = useState<boolean>(true);
  const [removeAdsEnabled, setRemoveAdsEnabled] = useState<boolean>(true);

  // 初始化状态
  useEffect(() => {
    chrome.storage.sync.get(
      ["backToTopEnabled", "removeAdsEnabled"],
      (result) => {
        if (result.backToTopEnabled !== undefined) {
          setBackToTopEnabled(result.backToTopEnabled);
        }
        if (result.removeAdsEnabled !== undefined) {
          setRemoveAdsEnabled(result.removeAdsEnabled);
        }
      }
    );
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

  return (
    <div className="w-[360px]">
      <div className="bg-blue-500 p-4 text-white text-center">
        <h1 className="text-2xl font-bold text-blue">
          Hello, BitCraft in Browser Extension!
        </h1>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={backToTopEnabled}
              onChange={handleBackToTopToggle}
              className="mr-2"
            />
            回到顶部功能
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={removeAdsEnabled}
              onChange={handleRemoveAdsToggle}
              className="mr-2"
            />
            关闭 Google 广告功能
          </label>
        </div>
      </div>
    </div>
  );
};

export default HelloReact;
