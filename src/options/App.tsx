import React, { useState } from 'react';

const BrowserExtensionSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({
    coreFeature: true,
    darkMode: false,
    notificationEnabled: true,
    notificationSound: 'default',
    autoSyncInterval: 30,
    whitelist: '',
    blacklist: '',
    showSaveSuccess: false,
  });
  const [scripts, setScripts] = useState([
    { id: 1, name: '广告拦截', enabled: true },
    { id: 2, name: '夜间模式', enabled: false },
    { id: 3, name: '自动填充', enabled: true },
  ]);
  const [newScriptName, setNewScriptName] = useState('');
  const [showAddScriptModal, setShowAddScriptModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    setSettings(prev => ({ ...prev, showSaveSuccess: true }));
    setTimeout(() => {
      setSettings(prev => ({ ...prev, showSaveSuccess: false }));
    }, 2000);
  };

  const resetDefaults = () => {
    setSettings({
      coreFeature: true,
      darkMode: false,
      notificationEnabled: true,
      notificationSound: 'default',
      autoSyncInterval: 30,
      whitelist: '',
      blacklist: '',
      showSaveSuccess: false,
    });
  };

  const toggleScript = (id: number) => {
    setScripts(prev => 
      prev.map(script => 
        script.id === id ? { ...script, enabled: !script.enabled } : script
      )
    );
  };

  const addNewScript = () => {
    if (newScriptName.trim()) {
      setScripts(prev => [
        ...prev,
        { id: Date.now(), name: newScriptName.trim(), enabled: true }
      ]);
      setNewScriptName('');
      setShowAddScriptModal(false);
    }
  };

  const deleteScript = (id: number) => {
    setScripts(prev => prev.filter(script => script.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-puzzle-piece text-blue-500 mr-2"></i>
            扩展管理器
          </h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="fas fa-cog mr-3"></i>
            设置
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'scripts' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="fas fa-code mr-3"></i>
            脚本管理
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'help' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="fas fa-question-circle mr-3"></i>
            帮助
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <i className="fas fa-cog text-white text-3xl mr-4"></i>
              <div>
                <h1 className="text-2xl font-bold text-white">浏览器扩展设置</h1>
                <p className="text-blue-100">管理您的扩展程序功能和偏好设置</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="divide-y divide-gray-200">
              {/* Core Features */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-cog text-blue-500 mr-2"></i>
                  核心功能
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-bolt text-yellow-500 mr-3"></i>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">启用核心功能</h3>
                        <p className="text-xs text-gray-500">开启扩展的主要功能</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="coreFeature"
                        checked={settings.coreFeature}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-moon text-indigo-500 mr-3"></i>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">暗黑模式</h3>
                        <p className="text-xs text-gray-500">启用深色主题界面</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="darkMode"
                        checked={settings.darkMode}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-bell text-green-500 mr-2"></i>
                  通知设置
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-green-500 mr-3"></i>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">启用通知</h3>
                        <p className="text-xs text-gray-500">接收扩展程序通知</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="notificationEnabled"
                        checked={settings.notificationEnabled}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className=" text-sm font-medium text-gray-700 flex items-center">
                      <i className="fas fa-volume-up text-green-500 mr-2"></i>
                      通知声音
                    </label>
                    <select
                      name="notificationSound"
                      value={settings.notificationSound}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="default">默认声音</option>
                      <option value="chime">铃声</option>
                      <option value="beep">蜂鸣声</option>
                      <option value="none">无声音</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sync Settings */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-sync-alt text-purple-500 mr-2"></i>
                  同步设置
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className=" text-sm font-medium text-gray-700 flex items-center">
                      <i className="fas fa-clock text-purple-500 mr-2"></i>
                      自动同步间隔 (分钟)
                    </label>
                    <input
                      type="number"
                      name="autoSyncInterval"
                      min="1"
                      max="120"
                      value={settings.autoSyncInterval}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Site Settings */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-globe text-red-500 mr-2"></i>
                  网站设置
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className=" text-sm font-medium text-gray-700 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      白名单 (每行一个网址)
                    </label>
                    <textarea
                      name="whitelist"
                      value={settings.whitelist}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className=" text-sm font-medium text-gray-700 flex items-center">
                      <i className="fas fa-ban text-red-500 mr-2"></i>
                      黑名单 (每行一个网址)
                    </label>
                    <textarea
                      name="blacklist"
                      value={settings.blacklist}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
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
                  className="!rounded-button whitespace-nowrap inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="fas fa-undo mr-2"></i>
                  恢复默认
                </button>
                <button
                  onClick={handleSave}
                  className="!rounded-button whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="fas fa-save mr-2"></i>
                  保存设置
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-code text-white text-3xl mr-4"></i>
                <div>
                  <h1 className="text-2xl font-bold text-white">脚本管理</h1>
                  <p className="text-blue-100">管理您的自定义脚本</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddScriptModal(true)}
                className="!rounded-button whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <i className="fas fa-plus mr-2"></i>
                添加脚本
              </button>
            </div>

            {/* Script List */}
            <div className="divide-y divide-gray-200">
              {scripts.map(script => (
                <div key={script.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-file-code text-blue-500 text-xl mr-4"></i>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{script.name}</h3>
                      <p className="text-xs text-gray-500">自定义脚本</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={script.enabled}
                        onChange={() => toggleScript(script.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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

        {activeTab === 'help' && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <i className="fas fa-question-circle text-white text-3xl mr-4"></i>
              <div>
                <h1 className="text-2xl font-bold text-white">帮助中心</h1>
                <p className="text-blue-100">获取使用帮助和常见问题解答</p>
              </div>
            </div>

            {/* Help Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">如何使用扩展</h2>
                  <p className="text-sm text-gray-600">
                    安装扩展后，您可以通过点击浏览器工具栏中的扩展图标来访问主要功能。您可以在设置页面中自定义扩展的行为和外观。
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">常见问题</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">扩展不工作怎么办？</h3>
                      <p className="text-xs text-gray-500">
                        请检查扩展是否已启用，并确保您没有在扩展的黑名单网站中。如果问题仍然存在，请尝试重新加载页面或重启浏览器。
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">如何添加自定义脚本？</h3>
                      <p className="text-xs text-gray-500">
                        在"脚本管理"页面中，点击"添加脚本"按钮，输入脚本名称并保存。您可以在脚本编辑器中编写或粘贴您的自定义JavaScript代码。
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">联系我们</h2>
                  <p className="text-sm text-gray-600">
                    如果您需要进一步的帮助，请发送邮件至 support@extension.com 或访问我们的网站 www.extension.com/support
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Script Modal */}
        {showAddScriptModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">添加新脚本</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">脚本名称</label>
                    <input
                      type="text"
                      value={newScriptName}
                      onChange={(e) => setNewScriptName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="输入脚本名称"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddScriptModal(false)}
                  className="!rounded-button whitespace-nowrap inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
                <button
                  onClick={addNewScript}
                  className="!rounded-button whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserExtensionSettings;

