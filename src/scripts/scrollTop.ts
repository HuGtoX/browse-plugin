(() => {
  // 拖动相关变量
  let isDragging = false;
  let wasDragging = false; // 新增：标记是否刚刚拖动过
  let offsetX = 0;
  let offsetY = 0;
  let $button: JQuery<HTMLElement>;

  // 初始化函数
  function init() {
    chrome.storage.sync.get("backToTopEnabled", (result) => {
      if (result.backToTopEnabled !== false) {
        GM_addStyle(`.BackToTop {
                display: none;
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 8px;
                font-size: 14px;
                background-color: #07DBBB;
                color: white;
                border-radius: 5px;
                border:none;
                cursor: pointer;
                z-index: 1000;
            }`);

        $button = $("<button>", {
          class: "BackToTop",
          text: "Top",
        }).appendTo("body");

        function onClick(e: any) {
          if (wasDragging) {
            e.preventDefault();
            wasDragging = false;
            return;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        function onMouseDown(e: any) {
          isDragging = true;
          wasDragging = false;
          const rect = $button[0].getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          $button.css("cursor", "grabbing");
        }
        function onMouseMove(e: any) {
          if (isDragging) {
            const rect = $button[0].getBoundingClientRect();
            const buttonWidth = rect.width;
            const buttonHeight = rect.height;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const margin = 10;
            const newX = Math.max(
              0,
              Math.min(x, viewportWidth - buttonWidth - margin),
            );
            const newY = Math.max(
              0,
              Math.min(y, viewportHeight - buttonHeight - margin),
            );

            $button.css({
              left: `${newX}px`,
              top: `${newY}px`,
              right: "auto",
              bottom: "auto",
            });

            wasDragging = true;
          }
        }
        function onMouseUp() {
          isDragging = false;
          $button.css("cursor", "pointer");
        }

        function handleScroll() {
          if (window.scrollY > 300) {
            $button.show();
          } else {
            $button.hide();
          }
        }
        function setButtonEventListener() {
          window.addEventListener("scroll", handleScroll);
          $button.on("click" as any, onClick);
          $button.on("mousedown" as any, onMouseDown);
          $(document).on("mousemove" as any, onMouseMove);
          $(document).on("mouseup" as any, onMouseUp);
        }
        function cleanup() {
          if ($button) {
            $button.off("mousedown" as any, onMouseDown);
            $(document).off("mousemove" as any, onMouseMove);
            $(document).off("mouseup" as any, onMouseUp);
            $button.off("click" as any, onClick);
            $button.remove();
          }
        }

        setTimeout(() => {
          setButtonEventListener();
        }, 1000);

        window.addEventListener("beforeunload", cleanup);
      }
    });
  }
  // 监听消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleBackToTop") {
      if (message.enabled) {
        init();
      } else {
        if ($button) {
          $button.remove();
        }
      }
    }
  });

  // 页面加载时初始化
  $(init);
})();
