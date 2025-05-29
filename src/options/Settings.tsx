import React, { useState } from "react";
import ToggleSwitch from "../components/ToggleSwitch";
import MainHeader from "../components/MainHeader";

export default function Settings() {
  const [settings, setSettings] = useState({
    coreFeature: true,
    darkMode: false,
    notificationEnabled: true,
    notificationSound: "default",
    autoSyncInterval: 30,
    whitelist: "",
    blacklist: "",
    showSaveSuccess: false,
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setSettings((prev) => ({ ...prev, showSaveSuccess: true }));
    setTimeout(() => {
      setSettings((prev) => ({ ...prev, showSaveSuccess: false }));
    }, 2000);
  };

  const resetDefaults = () => {
    setSettings({
      coreFeature: true,
      darkMode: false,
      notificationEnabled: true,
      notificationSound: "default",
      autoSyncInterval: 30,
      whitelist: "",
      blacklist: "",
      showSaveSuccess: false,
    });
  };

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
      {/* Header */}
      <MainHeader
        icon={<i className="fas fa-cog mr-4 text-3xl text-white"></i>}
        title="浏览器扩展设置"
        label="管理您的扩展程序功能和偏好设置"
      ></MainHeader>

      {/* Main Content */}
      <div className="divide-y divide-gray-200">
        {/* Core Features */}
        <div className="p-6">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
            <i className="fas fa-cog mr-2 text-blue-500"></i>
            核心功能
          </h2>

          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.coreFeature}
              onChange={() =>
                setSettings((prev) => ({
                  ...prev,
                  coreFeature: !prev.coreFeature,
                }))
              }
              label="启用核心功能"
              description="开启扩展的主要功能"
              icon={<i className="fas fa-bolt text-yellow-500"></i>}
            />

            <ToggleSwitch
              checked={settings.darkMode}
              onChange={() =>
                setSettings((prev) => ({
                  ...prev,
                  darkMode: !prev.darkMode,
                }))
              }
              label="暗黑模式"
              description="启用深色主题界面"
              icon={<i className="fas fa-moon text-indigo-500"></i>}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
            <i className="fas fa-bell mr-2 text-green-500"></i>
            通知设置
          </h2>

          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.notificationEnabled}
              onChange={() =>
                setSettings((prev) => ({
                  ...prev,
                  notificationEnabled: !prev.notificationEnabled,
                }))
              }
              label="启用通知"
              description="接收扩展程序通知"
              icon={<i className="fas fa-envelope text-green-500"></i>}
            />

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <i className="fas fa-volume-up mr-2 text-green-500"></i>
                通知声音
              </label>
              <select
                name="notificationSound"
                value={settings.notificationSound}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="default">默认声音</option>
                <option value="chime">铃声</option>
                <option value="beep">蜂鸣声</option>
                <option value="none">无声</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="p-6">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
            <i className="fas fa-sync-alt mr-2 text-purple-500"></i>
            同步设置
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <i className="fas fa-clock mr-2 text-purple-500"></i>
                自动同步间隔 (分钟)
              </label>
              <input
                type="number"
                name="autoSyncInterval"
                min="1"
                max="120"
                value={settings.autoSyncInterval}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Site Settings */}
        <div className="p-6">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
            <i className="fas fa-globe mr-2 text-red-500"></i>
            网站设置
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <i className="fas fa-check-circle mr-2 text-green-500"></i>
                白名单 (每行一个网址)
              </label>
              <textarea
                name="whitelist"
                value={settings.whitelist}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <i className="fas fa-ban mr-2 text-red-500"></i>
                黑名单 (每行一个网址)
              </label>
              <textarea
                name="blacklist"
                value={settings.blacklist}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between bg-gray-50 px-6 py-4 sm:flex-row">
        <div className="mb-4 sm:mb-0">
          {settings.showSaveSuccess && (
            <div className="flex items-center text-green-600">
              <i className="fas fa-check-circle mr-2"></i>
              <span>设置已保存</span>
            </div>
          )}
        </div>
        <div className="space-x-3">
          <button
            onClick={resetDefaults}
            className="!rounded-button inline-flex items-center whitespace-nowrap border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="fas fa-undo mr-2"></i>
            恢复默认
          </button>
          <button
            onClick={handleSave}
            className="!rounded-button inline-flex items-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="fas fa-save mr-2"></i>
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
