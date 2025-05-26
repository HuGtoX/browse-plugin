import ToggleSetting from "../components/ToggleSetting";
import { useBackTop, useRemoveAds } from "../hooks";
import { SettingOutlined } from "@ant-design/icons";

const HelloReact = () => {
  const { backToTopEnabled, handleBackToTopToggle } = useBackTop();
  const { removeAdsEnabled, handleRemoveAdsToggle } = useRemoveAds();

  const settingClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  return (
    <div className="w-[360px]">
      <div className="bg-blue-400 p-4 text-center text-primary">
        <h1 className="text-blue text-2xl font-bold">
          BitCraft in Browser Extension!
        </h1>
      </div>
      <div className="bg-slate-100">
        <div className="rounded-b-lg bg-white p-4">
          <ToggleSetting
            label="回到顶部"
            checked={backToTopEnabled}
            onChange={handleBackToTopToggle}
          />
          <ToggleSetting
            label="关闭 Google 广告"
            checked={removeAdsEnabled}
            onChange={handleRemoveAdsToggle}
          />
        </div>

        <div className="flex justify-between px-3 py-2">
          <div
            onClick={settingClick}
            className="cursor-pointer text-sm text-gray-600"
          >
            <SettingOutlined /> 设置
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloReact;
