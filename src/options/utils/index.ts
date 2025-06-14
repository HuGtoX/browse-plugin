import { ScriptConfig } from "./types";

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
export function showInstallDialog(metadata: Record<string, any>) {
  const permissions = metadata.grant || [];
  const confirmed = confirm(
    `安装脚本 "${metadata.name[0]}"?\n` +
      `权限要求：${permissions.join(", ")}\n` +
      `作用域名：${metadata.match.join(", ")}`,
  );
  return confirmed;
}

// 生成唯一ID并保存脚本
export async function saveScript(scriptContent: string) {
  const scriptId = "script_" + Date.now();
  const metadata = parseMetadata(scriptContent);
  const scriptData = {
    id: scriptId,
    code: scriptContent,
    enabled: true,
    ...metadata, // 包含 name, match, grant 等元数据
  };

  const result = await chrome.storage.local.get("scripts");
  const scripts = result.scripts || [];
  scripts.push(scriptData);
  return chrome.storage.local.set({ scripts });
}

// 根据脚本ID更新脚本文件
export async function updateScript(
  scriptId: number,
  scriptContent: any,
  enabled: boolean = true,
) {
  return new Promise<void>(async (resolve, reject) => {
    // 参数校验
    if (!scriptId || !scriptContent) {
      return reject(new Error("scriptId 和 scriptContent 不能为空"));
    }

    const metadata = parseMetadata(scriptContent);

    const scriptData = {
      id: scriptId,
      code: scriptContent,
      enabled: enabled,
      ...metadata, // 包含 name, match, grant 等元数据
    };

    const result = await chrome.storage.local.get("scripts");

    if (chrome.runtime.lastError) {
      return reject(
        new Error(`读取 storage 失败: ${chrome.runtime.lastError.message}`),
      );
    }
    const scripts = Array.isArray(result.scripts) ? result.scripts : [];

    // 查找是否存在该脚本
    const index = scripts.findIndex((script: any) => script.id === scriptId);
    if (index !== -1) {
      // 更新已有脚本
      scripts[index] = scriptData;
    } else {
      return reject(new Error(`未找到 ID 为 ${scriptId} 的脚本`));
    }

    await chrome.storage.local.set({ scripts });
    resolve();
  });
}

// 根据ID删除脚本
export function deleteScript(scriptId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("scripts", (result) => {
      if (chrome.runtime.lastError) {
        return reject(
          new Error(`读取 storage 失败: ${chrome.runtime.lastError.message}`),
        );
      }
      if (Array.isArray(result.scripts)) {
        const scripts = result.scripts.filter(
          (script: any) => script.id !== scriptId,
        );
        chrome.storage.local.set({ scripts }, () => {
          if (chrome.runtime.lastError) {
            return reject(
              new Error(
                `写入 storage 失败: ${chrome.runtime.lastError.message}`,
              ),
            );
          }
          resolve();
        });
      } else {
        reject(new Error("scripts 不是一个数组"));
      }
    });
  });
}

// 获取所有已保存的脚本
export function getScripts(): Promise<ScriptConfig[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get("scripts", (result) => {
      resolve(result.scripts || []);
    });
  });
}
