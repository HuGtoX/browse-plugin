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

function injectScript(code: string, scriptId: string) {
  chrome.tabs.executeScript(
    {
      code: `(function() {
      ${code}
      // 标记脚本已执行，避免重复注入
      window._tmInjected = window._tmInjected || [];
      if (!window._tmInjected.includes('${scriptId}')) {
        window._tmInjected.push('${scriptId}');
      }
    })();`,
    },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error("注入失败:", chrome.runtime.lastError);
      }
    },
  );
}

// 检查URL是否匹配 @match/@include 规则
function isUrlMatched(url: string, patterns: string[]) {
  return patterns.some((pattern) => {
    try {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(url);
    } catch (e) {
      return false;
    }
  });
}

export { addStyle, injectScript, isUrlMatched };
