function addStyle(css: string): void {
  try {
    const style = document.createElement("style");
    style.textContent = css;
    (
      document.head ||
      document.body ||
      document.documentElement ||
      document
    ).appendChild(style);
  } catch (e) {
    console.log("Error: env: adding style " + e);
  }
}

async function getTabId() {
  // 使用 chrome.tabs.query 获取当前激活的标签页
  let queryOptions = { active: true };
  let tab = await chrome.tabs.query?.(queryOptions);

  return tab[0]?.id ? tab[0].id : undefined;
}

function excutedCallback(code: any, tabId: any) {
  chrome.tabs.sendMessage(tabId, { action: "injectScript", code });
}

async function injectScript(code: string, scriptId: string) {
  const tabId = await getTabId();

  if (!tabId) return;

  try {
    excutedCallback(code, tabId);
    // chrome.scripting.executeScript(
    //   {
    //     target: { tabId },
    //     func: (code) => code,
    //     args: [code],
    //   },
    //   (result) => {
    //     console.log("injected a function", result);
    //     excutedCallback(code, tabId);
    //   },
    // );
  } catch (e) {
    console.log("Error: env: injectScript " + e);
  }
}

// 检查URL是否匹配 @match/@include 规则
function isUrlMatched(url: string, patterns: string[]) {
  return patterns?.some((pattern) => {
    try {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(url);
    } catch (e) {
      console.log("-- [ e ] --", e);
      return false;
    }
  });
}

export { addStyle, injectScript, isUrlMatched, getTabId };
