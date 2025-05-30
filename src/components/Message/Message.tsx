// Message.tsx
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type MessageType = "success" | "error" | "warning" | "info";

interface MessageProps {
  type: MessageType;
  content: string;
  duration?: number;
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({
  type,
  content,
  duration = 1000,
  onClose,
}) => {
  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messageRef.current;

    // 下一帧触发 fade in 动画
    const timerShow = requestAnimationFrame(() => {
      if (el) {
        el.style.opacity = "1";
        el.style.top = "40px";
      }
    });

    const timerHide = setTimeout(() => {
      if (el) {
        el.style.opacity = "0";
      }
      const timerRemove = setTimeout(() => {
        onClose();
      }, 300); // 与动画时间一致

      return () => clearTimeout(timerRemove);
    }, duration);

    return () => {
      clearTimeout(timerHide);
      cancelAnimationFrame(timerShow);
    };
  }, [duration, onClose]);

  return ReactDOM.createPortal(
    <div
      ref={messageRef}
      style={{
        position: "fixed",
        top: "70px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        zIndex: 10000,
        borderLeft: `4px solid ${
          type === "success"
            ? "green"
            : type === "error"
              ? "red"
              : type === "warning"
                ? "orange"
                : "blue"
        }`,
        display: "flex",
        alignItems: "center",
        opacity: 0,
        transition: "opacity 0.3s ease-out, top 0.3s ease-out",
      }}
    >
      <span style={{ marginRight: 8 }}>{iconMap[type]}</span>
      <span>{content}</span>
    </div>,
    document.body,
  );
};

export default Message;
