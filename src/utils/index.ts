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

async function getTabId()  {
  // 使用 chrome.tabs.query 获取当前激活的标签页
  let queryOptions = { active: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);

    console.log('-- [ tab ] --', tab);
    return tab[0]?.id ? tab[0].id : undefined;
}

async function injectScript(code: string, scriptId: string) {
  const tabId = await getTabId();
  console.log('-- [ tabId ] --', tabId);
  if (!tabId) return;
  try {
    chrome.scripting
      .executeScript({
        target: { tabId },
        func: () => `(function() {
        ${code}
        // 标记脚本已执行，避免重复注入
        window._tmInjected = window._tmInjected || [];
        if (!window._tmInjected.includes('${scriptId}')) {
          window._tmInjected.push('${scriptId}');
        }
        })();`,
      })
      .then(() => console.log("injected a function"));
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

export { addStyle, injectScript, isUrlMatched };
