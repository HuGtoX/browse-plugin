export function parseMetadata(scriptContent: string) {
  const metadata: Record<string, any> = {};
  const metaRegex = /\/\/\s*@(\S+)\s*(.*)/g;
  let match;
  while ((match = metaRegex.exec(scriptContent)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (!metadata[key]) metadata[key] = [];
    metadata[key].push(value);
  }
  return metadata;
}

// 弹出安装对话框
export function showInstallDialog(metadata:Record<string, any>) {
  const permissions = metadata.grant || [];
  const confirmed = confirm(
    `安装脚本 "${metadata.name[0]}"?\n` +
      `权限要求：${permissions.join(", ")}\n` +
      `作用域名：${metadata.match.join(", ")}`,
  );
  return confirmed;
}


// 生成唯一ID并保存脚本
export function saveScript(scriptContent:string, metadata:Record<string, any>) {
    const scriptId = 'script_' + Date.now();
    const scriptData = {
      id: scriptId,
      code: scriptContent,
      enabled: true,
      ...metadata // 包含 name, match, grant 等元数据
    };
  
    chrome.storage.local.get('scripts', (result) => {
      const scripts = result.scripts || [];
      scripts.push(scriptData);
      chrome.storage.local.set({ scripts }, () => {
        console.log('脚本已保存');
      });
    });
  }

  // 获取所有已保存的脚本
  export function getScripts() {
    return new Promise((resolve) => {
      chrome.storage.local.get('scripts', (result) => {
        resolve(result.scripts || []);
      });
    });
  }
  
