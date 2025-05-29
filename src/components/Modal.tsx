import React, { ReactNode } from "react";

interface ModalProps {
  title?: string;
  children: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isOpen: boolean;
  width?: string;
}

export default function Modal({
  title = "",
  children,
  cancelText = "取消",
  confirmText = "添加",
  onCancel,
  onConfirm,
  isOpen,
  width,
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div
        style={width ? { width: width } : {}}
        className="w-full transform rounded-lg bg-white shadow-xl transition-all duration-300"
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>

        {/* 内容区域 */}
        <div className="p-6">{children}</div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onCancel}
            className="!rounded-button inline-flex items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="!rounded-button inline-flex items-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
