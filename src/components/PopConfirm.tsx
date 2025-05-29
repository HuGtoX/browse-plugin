import React, { useState, useRef, useEffect } from "react";
import { useMemo } from "react";

type PopconfirmProps = {
  title: string;
  content?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  title,
  content,
  onConfirm,
  onCancel = () => {},
  okText = "确认",
  cancelText = "取消",
  placement = "top",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 计算弹窗位置
  const getPositionStyle = () => {
    if (!triggerRef.current || !popoverRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const triggerOffset = triggerRef.current.getBoundingClientRect(); // 获取触发元素相对于视口的位置

    switch (placement) {
      case "top":
        return {
          top: `${triggerOffset.top - popoverRect.height - 8}px`, // 顶部间距 8px
          left: `${triggerOffset.left + triggerRect.width / 2 - popoverRect.width / 2}px`, // 水平居中
        };
      case "bottom":
        return {
          top: `${triggerOffset.top + triggerRect.height + 8}px`, // 底部间距 8px
          left: `${triggerOffset.left + triggerRect.width / 2 - popoverRect.width / 2}px`, // 水平居中
        };
      case "left":
        return {
          top: `${triggerOffset.top + triggerRect.height / 2 - popoverRect.height / 2}px`, // 垂直居中
          left: `${triggerOffset.left - popoverRect.width - 8}px`, // 左侧间距 8px
        };
      case "right":
        return {
          top: `${triggerOffset.top + triggerRect.height / 2 - popoverRect.height / 2}px`, // 垂直居中
          left: `${triggerOffset.left + triggerRect.width + 8}px`, // 右侧间距 8px
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    if (visible) {
      const style = getPositionStyle();
      setPopoverStyle({ ...style, opacity: 1 });
    }
  }, [visible, placement]);

  return (
    <div ref={triggerRef} className="relative inline-block">
      {/* 触发元素 */}
      <div onClick={() => setVisible(!visible)}>{children}</div>

      {/* 确认弹窗 */}
      {visible && (
        <div
          ref={popoverRef}
          style={popoverStyle}
          className="fixed z-30 w-[220px] rounded-lg bg-white p-4 opacity-0 shadow-lg"
        >
          <div className="mb-3 text-sm font-medium text-gray-800">{title}</div>
          {content && (
            <div className="mb-4 text-sm text-gray-600">{content}</div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setVisible(false);
                onCancel();
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                setVisible(false);
                onConfirm();
              }}
              className="rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              {okText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popconfirm;
