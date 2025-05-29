import React, { useState } from "react";
import ToggleSwitch from "../components/ToggleSwitch";
import NavButton from "../components/NavButton";
import MainHeader from "../components/MainHeader";
import Help from "./Help";
import Settings from "./Settings";
import Scripts from "./Scripts";

const BrowserExtensionSettings = () => {
  const [activeTab, setActiveTab] = useState("settings");

  return (
    // 最外层容器添加 max-w-7xl 和 mx-auto
    <div className="">
      <div className="mx-auto flex min-h-screen max-w-7xl bg-gray-50">
        {/* 导航栏添加 fixed 定位 */}
        <div className="fixed top-0 h-screen w-64 bg-white shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h1 className="flex items-center text-xl font-bold text-gray-800">
              <i className="fas fa-puzzle-piece mr-2 text-blue-500"></i>
              扩展管理器
            </h1>
          </div>
          <nav className="mt-4">
            <NavButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={<i className="fas fa-cog mr-3"></i>}
              label="设置"
            />
            <NavButton
              active={activeTab === "scripts"}
              onClick={() => setActiveTab("scripts")}
              icon={<i className="fas fa-code mr-3"></i>}
              label="脚本管理"
            />
            <NavButton
              active={activeTab === "help"}
              onClick={() => setActiveTab("help")}
              icon={<i className="fas fa-question-circle mr-3"></i>}
              label="帮助"
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "settings" && <Settings />}

          {activeTab === "scripts" && <Scripts />}

          {activeTab === "help" && <Help />}
        </div>
      </div>
    </div>
  );
};

export default BrowserExtensionSettings;
