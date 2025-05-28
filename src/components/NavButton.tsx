import React from "react";

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center px-4 py-3 text-left text-base ${active ? "border-l-4 border-blue-500 bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default NavButton;
