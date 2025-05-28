import React, { useState } from "react";
import Modal from "../components/Modal";
import ToggleSwitch from "../components/ToggleSwitch";
import NavButton from "../components/NavButton";

const BrowserExtensionSettings = () => {
  const [activeTab, setActiveTab] = useState("settings");
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
  const [scripts, setScripts] = useState([
    { id: 1, name: "广告拦截", enabled: true },
    { id: 2, name: "夜间模式", enabled: false },
    { id: 3, name: "自动填充", enabled: true },
  ]);
  const [newScriptName, setNewScriptName] = useState("");
  const [showAddScriptModal, setShowAddScriptModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const toggleScript = (id: number) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.id === id ? { ...script, enabled: !script.enabled } : script,
      ),
    );
  };

  const addNewScript = () => {
    if (newScriptName.trim()) {
      setScripts((prev) => [
        ...prev,
        { id: Date.now(), name: newScriptName.trim(), enabled: true },
      ]);
      setNewScriptName("");
      setShowAddScriptModal(false);
    }
  };

  const deleteScript = (id: number) => {
    setScripts((prev) => prev.filter((script) => script.id !== id));
  };

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
          {activeTab === "settings" && (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
              {/* Header */}
              <div className="flex items-center bg-blue-600 px-6 py-4">
                <i className="fas fa-cog mr-4 text-3xl text-white"></i>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    浏览器扩展设置
                  </h1>
                  <p className="text-blue-100">
                    管理您的扩展程序功能和偏好设置
                  </p>
                </div>
              </div>

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
          )}

          {activeTab === "scripts" && (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
              {/* Header */}
              <div className="flex items-center justify-between bg-blue-600 px-6 py-4">
                <div className="flex items-center">
                  <i className="fas fa-code mr-4 text-3xl text-white"></i>
                  <div>
                    <h1 className="text-2xl font-bold text-white">脚本管理</h1>
                    <p className="text-blue-100">管理您的自定义脚本</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddScriptModal(true)}
                  className="!rounded-button inline-flex items-center whitespace-nowrap rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <i className="fas fa-plus mr-2"></i>
                  添加脚本
                </button>
              </div>

              {/* Script List */}
              <div className="divide-y divide-gray-200">
                {scripts.map((script) => (
                  <div
                    key={script.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center">
                      <i className="fas fa-file-code mr-4 text-xl text-blue-500"></i>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {script.name}
                        </h3>
                        <p className="text-xs text-gray-500">自定义脚本</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ToggleSwitch
                        checked={script.enabled}
                        onChange={() => toggleScript(script.id)}
                      />
                      <button
                        onClick={() => deleteScript(script.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "help" && (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
              {/* Header */}
              <div className="flex items-center bg-blue-600 px-6 py-4">
                <i className="fas fa-question-circle mr-4 text-3xl text-white"></i>
                <div>
                  <h1 className="text-2xl font-bold text-white">帮助中心</h1>
                  <p className="text-blue-100">获取使用帮助和常见问题解答</p>
                </div>
              </div>

              {/* Help Content */}
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 text-lg font-medium text-gray-900">
                      如何使用扩展
                    </h2>
                    <p className="text-sm text-gray-600">
                      安装扩展后，您可以通过点击浏览器工具栏中的扩展图标来访问主要功能。您可以在设置页面中自定义扩展的行为和外观。
                    </p>
                  </div>
                  <div>
                    <h2 className="mb-2 text-lg font-medium text-gray-900">
                      常见问题
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          扩展不工作怎么办？
                        </h3>
                        <p className="text-xs text-gray-500">
                          请检查扩展是否已启用，并确保您没有在扩展的黑名单网站中。如果问题仍然存在，请尝试重新加载页面或重启浏览器。
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          如何添加自定义脚本？
                        </h3>
                        <p className="text-xs text-gray-500">
                          在"脚本管理"页面中，点击"添加脚本"按钮，输入脚本名称并保存。您可以在脚本编辑器中编写或粘贴您的自定义JavaScript代码。
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-2 text-lg font-medium text-gray-900">
                      联系我们
                    </h2>
                    <p className="text-sm text-gray-600">
                      如果您需要进一步的帮助，请发送邮件至 support@extension.com
                      或访问我们的网站 www.extension.com/support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Script Modal */}
          <Modal
            title="确认删除"
            isOpen={showAddScriptModal}
            onCancel={() => setShowAddScriptModal(false)}
            onConfirm={handleSave}
          >
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    脚本名称
                  </label>
                  <input
                    type="text"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="输入脚本名称"
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BrowserExtensionSettings;
