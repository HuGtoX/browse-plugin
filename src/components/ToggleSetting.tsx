// ToggleSetting.tsx
import React from "react";

interface ToggleSettingProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="mb-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      {label}
    </label>
  </div>
);

export default ToggleSetting;
