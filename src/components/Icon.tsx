import React from 'react';

interface IconProps {
  icon: string; // 例如：'file-code' 或完整 'fa-file-code'
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  className = '',
}) => {
  const fullIconName = icon.startsWith('fa-') ? icon : `fa-${icon}`;

  return (
    <i
      className={`fas ${fullIconName} ${className}`}
      aria-hidden="true"
    ></i>
  );
};

export default Icon;