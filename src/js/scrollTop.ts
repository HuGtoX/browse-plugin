import { addStyle } from "../utils";

// 拖动相关变量
let isDragging = false;
let wasDragging = false; // 新增：标记是否刚刚拖动过
let offsetX = 0;
let offsetY = 0;
let button: HTMLButtonElement;

// 初始化函数
function init() {
  chrome.storage.sync.get("backToTopEnabled", (result) => {
    if (result.backToTopEnabled !== false) {
      addStyle(`.BackToTop {
                display: none;
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px;
                background-color: #07DBBB;
                color: white;
                border-radius: 5px;
                border:none;
                cursor: pointer;
                z-index: 1000;
            }`);

      button = document.createElement("button");
      button.className = "BackToTop";
      button.textContent = "Top";
      document.body.appendChild(button);

      function onClick(e: MouseEvent) {
        if (wasDragging) {
          e.preventDefault();
          wasDragging = false;
          return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      function onMouseDown(e: MouseEvent) {
        isDragging = true;
        wasDragging = false;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        button.style.cursor = "grabbing";
      }
      function onMouseMove(e: MouseEvent) {
        if (isDragging) {
          const rect = button.getBoundingClientRect();
          const buttonWidth = rect.width;
          const buttonHeight = rect.height;

          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          const margin = 10;
          const newX = Math.max(
            0,
            Math.min(x, viewportWidth - buttonWidth - margin)
          );
          const newY = Math.max(
            0,
            Math.min(y, viewportHeight - buttonHeight - margin)
          );

          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
          button.style.right = "auto";
          button.style.bottom = "auto";

          wasDragging = true;
        }
      }
      function onMouseUp() {
        isDragging = false;
        button.style.cursor = "pointer";
      }

      function handleScroll() {
        if (window.scrollY > 300) {
          button.style.display = "block";
        } else {
          button.style.display = "none";
        }
      }
      function setButtonEventListener() {
        window.addEventListener("scroll", handleScroll);
        button.addEventListener("click", onClick);
        button.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
      function cleanup() {
        if (button) {
          button.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          button.removeEventListener("click", onClick);

          if (button.parentNode) {
            button.parentNode.removeChild(button);
          }
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
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    }
  }
});

// 页面加载时初始化
document.addEventListener("DOMContentLoaded", init);
