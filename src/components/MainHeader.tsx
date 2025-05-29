import React from "react";

interface MainHeaderProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  label?: string;
}

export default function MainHeader({
  children,
  title,
  label,
  icon,
}: MainHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-blue-600 px-6 py-4">
      <div className="flex items-center">
        {icon}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-blue-100">{label}</p>
        </div>
      </div>
      {/* 添加脚本操作区域 */}
      {children}
    </div>
  );
}
