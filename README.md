# Chrome 扩展 API 中文文档

> 本文档基于 [Chrome 扩展 API 官方文档](https://developer.chrome.google.cn/docs/extensions/reference/api?hl=zh-cn)整理，包含核心 API 的功能说明和使用示例

## 一、基础架构 API

### 1. chrome.runtime
**作用**：管理扩展生命周期、通信和基本信息  
**核心方法**：
```javascript
// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fetchData') {
    fetchData().then(data => sendResponse({data}));
  }
  return true; // 保持通道开放用于异步响应
});

// 获取扩展清单信息
const manifest = chrome.runtime.getManifest();
console.log(manifest.version);

// 打开选项页面
chrome.runtime.openOptionsPage();
```

### 2. chrome.extension
**作用**：获取扩展内部资源（兼容旧版 API）  
**使用场景**：
```javascript
// 获取后台页面
const bgPage = chrome.extension.getBackgroundPage();

// 获取扩展内资源绝对URL
const iconUrl = chrome.extension.getURL('images/icon.png');
```

## 二、UI 交互 API

### 1. chrome.action
**作用**：管理浏览器工具栏图标行为  
**核心功能**：
```javascript
// 设置图标点击弹出页面
chrome.action.setPopup({ popup: 'popup.html' });

// 监听工具栏图标点击
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'dashboard.html' });
});

// 动态修改工具栏图标
chrome.action.setIcon({
  path: {
    "16": "icons/active16.png",
    "32": "icons/active32.png"
  }
});
```

### 2. chrome.omnibox
**作用**：自定义地址栏搜索行为  
**实现搜索建议**：
```javascript
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const results = searchAPI(text);
  suggest(results.map(item => ({
    content: item.id,
    description: item.title
  })));
});

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.tabs.create({ url: `https://example.com/search?q=${text}` });
});
```

## 三、标签页与窗口控制

### 1. chrome.tabs
**核心功能**：
```javascript
// 创建新标签页
chrome.tabs.create({ url: 'https://example.com', active: true });

// 获取当前活动标签页
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
});

// 更新标签页URL
chrome.tabs.update(tabId, { url: 'https://updated.com' });

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // 页面加载完成
  }
});
```

### 2. chrome.windows
**窗口操作**：
```javascript
// 创建新窗口
chrome.windows.create({
  url: 'panel.html',
  type: 'popup',
  width: 800,
  height: 600
});

// 获取所有窗口
chrome.windows.getAll({}, (windows) => {
  console.log(`共有 ${windows.length} 个窗口`);
});

// 最大化窗口
chrome.windows.update(windowId, { state: 'maximized' });
```

## 四、内容脚本交互

### chrome.scripting
**动态注入脚本和样式**：
```javascript
// 注入JS文件
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['content-script.js']
});

// 注入CSS文件
chrome.scripting.insertCSS({
  target: { tabId: tab.id },
  files: ['content-style.css']
});

// 直接执行代码
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => {
    document.body.style.backgroundColor = 'red';
  }
});
```

## 五、存储与状态管理

### 1. chrome.storage
**数据存储**：
```javascript
// 保存数据
chrome.storage.local.set({ 
  settings: { darkMode: true, fontSize: 16 } 
}, () => {
  console.log('设置已保存');
});

// 读取数据
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) {
    applySettings(result.settings);
  }
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    updateUI(changes.settings.newValue);
  }
});
```

### 2. chrome.cookies
**Cookie 管理**：
```javascript
// 获取特定Cookie
chrome.cookies.get({
  url: 'https://example.com',
  name: 'session_id'
}, (cookie) => {
  if (cookie) {
    console.log('会话ID:', cookie.value);
  }
});

// 设置Cookie
chrome.cookies.set({
  url: 'https://example.com',
  name: 'theme',
  value: 'dark',
  expirationDate: Date.now() + 86400 // 1天后过期
});
```

## 六、网络请求控制

### chrome.webRequest
**拦截和修改网络请求**：
```javascript
// 拦截广告请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.match(/ads?\./i)) {
      return { cancel: true }; // 阻止请求
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 修改请求头
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders;
    headers.push({ name: 'X-Custom-Header', value: 'Extension' });
    return { requestHeaders: headers };
  },
  { urls: ["*://example.com/*"] },
  ["blocking", "requestHeaders"]
);
```

## 七、消息通信机制

### 跨上下文通信
```javascript
// 1. 内容脚本 -> 后台脚本
// 内容脚本中：
chrome.runtime.sendMessage({ action: 'logEvent', data: eventData });

// 后台脚本中：
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'logEvent') {
    analytics.log(message.data);
  }
});

// 2. 弹出页 -> 内容脚本
// 弹出页中：
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { command: 'highlight' });
});

// 内容脚本中：
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'highlight') {
    document.body.classList.add('highlight');
  }
});
```

## 八、权限系统

### manifest.json 权限声明
```json
{
  "permissions": [
    "activeTab",         // 访问当前活动标签页
    "storage",           // 使用存储API
    "scripting",         // 执行内容脚本
    "contextMenus",      // 创建右键菜单
    "notifications",     // 显示通知
    "cookies",           // 访问Cookie
    "webRequest",        // 拦截网络请求
    "webRequestBlocking",// 阻塞网络请求
    "https://api.example.com/*"  // 跨域访问权限
  ]
}
```

## 九、特殊功能 API

### 1. chrome.contextMenus
**创建右键菜单**：
```javascript
// 创建主菜单
chrome.contextMenus.create({
  id: 'search',
  title: '搜索 "%s"',
  contexts: ['selection'] // 仅在选中文本时显示
});

// 创建子菜单
chrome.contextMenus.create({
  id: 'wiki-search',
  parentId: 'search',
  title: '在维基百科搜索',
  contexts: ['selection']
});

// 监听菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'wiki-search') {
    const url = `https://zh.wikipedia.org/wiki/${encodeURIComponent(info.selectionText)}`;
    chrome.tabs.create({ url });
  }
});
```

### 2. chrome.notifications
**显示系统通知**：
```javascript
// 创建通知
chrome.notifications.create('reminder', {
  type: 'basic',
  iconUrl: 'icons/48.png',
  title: '任务提醒',
  message: '您有3个待完成任务',
  buttons: [{ title: '查看任务' }]
});

// 监听通知点击
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'reminder') {
    chrome.tabs.create({ url: 'tasks.html' });
  }
});
```

### 3. chrome.alarms
**定时任务管理**：
```javascript
// 创建定时器
chrome.alarms.create('daily-reminder', {
  delayInMinutes: 1,    // 1分钟后首次触发
  periodInMinutes: 1440 // 每天重复 (60*24)
});

// 监听定时器触发
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-reminder') {
    showDailyNotification();
  }
});
```

## 十、最佳实践

### 1. 模块化设计
```plaintext
扩展目录结构建议：
├── background.js       # 后台脚本
├── content.js          # 内容脚本
├── popup
│   ├── popup.html      # 弹出页HTML
│   ├── popup.js        # 弹出页JS
│   └── popup.css       # 弹出页样式
├── options
│   ├── options.html    # 选项页HTML
│   └── options.js      # 选项页JS
├── assets              # 静态资源
│   ├── icons
│   └── images
└── manifest.json       # 配置文件
```

### 2. 错误处理
```javascript
chrome.tabs.query({ active: true }, (tabs) => {
  if (chrome.runtime.lastError) {
    console.error('查询标签页出错:', chrome.runtime.lastError);
    return;
  }
  // 正常处理逻辑
});
```

### 3. 性能优化技巧
- 使用 `chrome.alarms` 替代 `setInterval` 实现定时任务
- 按需加载内容脚本，避免注入到所有页面
- 使用 `webNavigation` API 更精确控制脚本注入时机
- 对大数据使用 `chrome.storage.session` 临时存储

### 4. 安全注意事项
```json
// manifest.json 重要安全设置
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },
  "host_permissions": ["https://api.example.com/*"], // 限制可访问域名
  "externally_connectable": {
    "matches": ["https://your-website.com/*"] // 限制可通信网站
  }
}
```

## 附录：常用 manifest.json 配置
```json
{
  "manifest_version": 3,
  "name": "扩展名称",
  "version": "1.0.0",
  "description": "扩展描述",
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png"
    }
  },
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "js": ["content.js"],
    "css": ["content.css"]
  }],
  
  "options_page": "options/options.html",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["https://api.example.com/*"]
}
```

> 完整 API 文档参考：[Chrome 扩展 API 官方文档](https://developer.chrome.google.cn/docs/extensions/reference/api?hl=zh-cn)