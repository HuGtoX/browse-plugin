import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import AddScripts from "./components/AddScripts";
import ToggleSwitch from "../components/ToggleSwitch";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Popconfirm from "../components/PopConfirm";

export default function Scripts() {
  const [scripts, setScripts] = useState([
    { id: 1, name: "广告拦截", enabled: true },
    { id: 2, name: "夜间模式", enabled: false },
    { id: 3, name: "自动填充", enabled: true },
  ]);

  const toggleScript = (id: number) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.id === id ? { ...script, enabled: !script.enabled } : script,
      ),
    );
  };

  const deleteScript = (id: number) => {
    setScripts((prev) => prev.filter((script) => script.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
      {/* Header */}

      <MainHeader
        icon={<i className="fas fa-code mr-4 text-3xl text-white" />}
        title="脚本管理"
        label="管理您的自定义脚本"
      >
        <AddScripts />
      </MainHeader>

      {/* Script List */}
      <div className="divide-y divide-gray-200">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center">
              <Icon
                icon="fa-file-code"
                className="mr-4 text-xl text-blue-500"
              ></Icon>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {script.name}
                </h3>
                <p className="text-xs text-gray-500">自定义脚本</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ToggleSwitch
                checked={script.enabled}
                onChange={() => toggleScript(script.id)}
              />

              <Button
                text
                type="primary"
                icon={<i className="fas fa-edit"></i>}
                onClick={() => deleteScript(script.id)}
              ></Button>

              <Popconfirm
                title="确定要删除吗？"
                content="删除后无法恢复，请谨慎操作"
                onConfirm={() => deleteScript(script.id)}
                onCancel={() => console.log("取消")}
                okText="删除"
                cancelText="取消"
                placement="left"
              >
                <Button
                  text
                  type="danger"
                  icon={<i className="fas fa-trash"></i>}
                ></Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
