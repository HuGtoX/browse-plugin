import { addStyle } from "../utils";

// 拖动相关变量
let isDragging = false;
let wasDragging = false; // 新增：标记是否刚刚拖动过
let offsetX = 0;
let offsetY = 0;


document.addEventListener("DOMContentLoaded", function () {
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

    const button = document.createElement("button");
    button.className = "BackToTop";
    button.textContent = "Top";
    document.body.appendChild(button);

    function onClick(e) {
        if (wasDragging) {
            e.preventDefault(); // 阻止默认行为
            wasDragging = false; // 重置状态
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function onMouseDown(e) {
        isDragging = true;
        wasDragging = false;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        button.style.cursor = "grabbing";
    }
    function onMouseMove(e) {
        if (isDragging) {
            const rect = button.getBoundingClientRect();
            const buttonWidth = rect.width;
            const buttonHeight = rect.height;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 获取视口宽度和高度
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const margin = 10;
            // 限制按钮位置在视口内
            const newX = Math.max(0, Math.min(x, viewportWidth - buttonWidth - margin));
            const newY = Math.max(0, Math.min(y, viewportHeight - buttonHeight - margin));

            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
            button.style.right = "auto";
            button.style.bottom = "auto";

            wasDragging = true; // 拖动过程中标记为已拖动
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
    // 清理函数（例如页面卸载前调用）
    function cleanup() {
        button.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        button.removeEventListener("click", onClick);

        if (button && button.parentNode) {
            button.parentNode.removeChild(button);
        }

        // 防止闭包造成内存泄露
        onMouseDown = null;
        onMouseMove = null;
        onMouseUp = null;
        onClick = null;
        handleScroll = null;
    }

    setTimeout(() => {
        setButtonEventListener()
    }, 1000);


    // 可以在合适的时候调用 cleanup，比如 beforeunload 或组件卸载时
    window.addEventListener("beforeunload", cleanup);
});


