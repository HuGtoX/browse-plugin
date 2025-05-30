// message.ts
import React from 'react';
import { createRoot } from 'react-dom/client';
import Message from './Message';

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageApi {
  (content: string, duration?: number): void;
  success(content: string, duration?: number): void;
  error(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  info(content: string, duration?: number): void;
}

const containerStyle = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
} as const;

// 独立容器用于挂载所有 message 的外层容器（仅一个）
const container = document.createElement('div');
Object.entries(containerStyle).forEach(([key, value]) => {
  // @ts-ignore
  container.style[key] = value;
});
document.body.appendChild(container);


const showMessage = (type: MessageType, content: string, duration = 1000) => {
  const root = createRoot(container);
  const destroy = () => {
    root.unmount(); // 卸载组件
  };

  root.render(
    <Message
      type={type}
      content={content}
      duration={duration}
      onClose={destroy}
    />
  );
};

const api = ((content: string, duration?: number) => {
  showMessage('info', content, duration);
}) as MessageApi;

api.success = (content: string, duration?: number) => {
  showMessage('success', content, duration);
};

api.error = (content: string, duration?: number) => {
  showMessage('error', content, duration);
};

api.warning = (content: string, duration?: number) => {
  showMessage('warning', content, duration);
};

api.info = (content: string, duration?: number) => {
  showMessage('info', content, duration);
};

export default api;