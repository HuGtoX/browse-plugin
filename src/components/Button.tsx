import React from "react";

type ButtonType = "default" | "primary" | "danger";
type ButtonHTMLType = "button" | "submit" | "reset";
type ButtonSize = "large" | "middle" | "small";

interface ButtonProps {
  type?: ButtonType;
  text?: boolean;
  loading?: boolean;
  block?: boolean;
  size?: ButtonSize;
  htmlType?: ButtonHTMLType;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = "default",
  text = false,
  loading = false,
  block = false,
  size = "middle",
  htmlType = "button",
  className = "",
  onClick,
  disabled = false,
  icon,
  children,
}) => {
  const getButtonTypeStyle = () => {
    if (text) {
      switch (type) {
        case "primary":
          return "text-blue-600 hover:text-blue-800 bg-transparent shadow-none px-0";
        case "danger":
          return "text-red-500 hover:text-red-700 bg-transparent shadow-none px-0";
        case "default":
        default:
          return "text-gray-700 hover:text-gray-900 bg-transparent shadow-none px-0";
      }
    }

    switch (type) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "danger":
        return "text-red-500 hover:text-red-700";
      case "default":
      default:
        return "text-gray-700 hover:text-gray-900";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "large":
        return "px-6 py-3 text-base rounded-lg";
      case "small":
        return "px-2 py-1 text-xs rounded-md";
      case "middle":
      default:
        return "px-3 py-2 text-sm rounded-md";
    }
  };

  // focus:ring-2 focus:ring-offset-2
  const baseStyle = `
    flex items-center justify-center
    font-medium
    transition-colors duration-200
    focus:outline-none 
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${block ? "w-full" : ""}
  `;

  const combinedClassName = `${baseStyle} ${getButtonTypeStyle()} ${getSizeStyle()} ${className}`;

  return (
    <button
      type={htmlType}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <i
          className={`fas fa-spinner mr-1 animate-spin ${size === "small" ? "text-xs" : ""}`}
        ></i>
      ) : icon ? (
        <span className={`mr-1 ${size === "small" ? "text-xs" : ""}`}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
