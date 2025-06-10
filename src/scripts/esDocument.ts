let timer: any = null;

// 等待页面DOM加载完成
window.addEventListener("load", () => {
  // 封装目录生成逻辑为独立函数，便于复用
  const generateTOC = () => {
    // 移除旧的目录容器（避免重复生成）
    const existingToc = document.getElementById("custom-toc");
    if (existingToc) existingToc.remove();

    // 提取所有章节标题（根据目标页面实际结构调整选择器）
    const headers = document.querySelectorAll("h2");

    // 创建目录容器
    const tocContainer = document.createElement("div");
    tocContainer.id = "custom-toc";
    tocContainer.style.cssText = `
        position: fixed;
        top: 100px;
        right: 100px;
        width: 240px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow-y: auto;
        max-height: 80vh;
        z-index: 1000;
      `;

    // 根据视口宽度设置初始right值
    const setTocPosition = () => {
      if (window.innerWidth > 1400) {
        // 计算超出1400px的宽度部分，按比例增加right值（可调整系数）
        const extraWidth = window.innerWidth - 1400;
        const extraRight = Math.min(extraWidth * 0.05, 100); // 每宽100px增加5px，最大额外增加100px（即right最大200px）
        tocContainer.style.right = `${100 + extraRight}px`;
      } else {
        tocContainer.style.right = "20px"; // 小于1400px时固定20px
      }
    };
    setTocPosition(); // 初始设置

    // 创建目录标题
    const tocTitle = document.createElement("h3");
    tocTitle.textContent = "章节目录";
    tocTitle.style.cssText =
      "margin: 0 0 12px 0; color: #333; font-size: 16px;";
    tocContainer.appendChild(tocTitle);

    // 生成目录项
    headers.forEach((header) => {
      if (!header.id) return; // 跳过无id的标题

      const tocItem = document.createElement("a");
      tocItem.textContent = header.textContent;
      // 移除href避免hash路由跳转，改用点击事件滚动定位
      tocItem.style.cssText = `
          cursor: pointer;
          display: block;
          margin: 4px 0;
          padding: 4px 8px;
          color: #666;
          font-size: 14px;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        `;

      // 点击时滚动到目标位置（替代href跳转）
      tocItem.addEventListener("click", (e) => {
        e.preventDefault(); // 阻止默认跳转行为
        const target = document.getElementById(header.id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      // 根据标题级别缩进（h3比h2缩进）
      if (header.tagName === "H3") {
        tocItem.style.paddingLeft = "16px";
        tocItem.style.fontSize = "13px";
      }

      // 悬停样式
      tocItem.addEventListener("mouseover", () => {
        tocItem.style.background = "#e9ecef";
        tocItem.style.color = "#2c3e50";
      });
      tocItem.addEventListener("mouseout", () => {
        tocItem.style.background = "transparent";
        tocItem.style.color = "#666";
      });

      tocContainer.appendChild(tocItem);
      // 监听窗口大小变化，动态调整right值
      window.addEventListener("resize", setTocPosition);
    });

    // 注入页面
    document.body.appendChild(tocContainer);
  };

  // 初始生成目录
  generateTOC();

  // 监听hash路由切换，重新生成目录
  window.addEventListener("hashchange", () => {
    // 目标容器（根据页面实际结构调整，例如内容区的父元素）
    const contentContainer =
      document.querySelector("#content") || document.body;

    // 创建MutationObserver检测DOM变化稳定
    const observer = new MutationObserver((mutations, observerInstance) => {
      // 变化发生后，延迟300ms确认是否稳定
      clearTimeout(timer);
      timer = setTimeout(() => {
        generateTOC();
        observerInstance.disconnect(); // 停止监听
      }, 300);
    });

    // 配置监听选项（根据页面实际变化类型调整）
    observer.observe(contentContainer, {
      childList: true, // 子节点变化
      subtree: true, // 子树变化
      attributes: true, // 属性变化
      characterData: true, // 文本内容变化
    });
  });
});
