import React, { useState, useEffect } from "react";
import MainHeader from "../components/MainHeader";
import AddScripts from "./components/AddScripts";
import ToggleSwitch from "../components/ToggleSwitch";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Popconfirm from "../components/PopConfirm";
import { getScripts, updateScript, deleteScript } from "./utils";
import { ScriptConfig } from "./utils/types";
import message  from "../components/Message";

export default function Scripts() {
  const [scripts, setScripts] = useState<ScriptConfig[]>([]);

  const deleteScriptHandle = async (id: number) => {
    await deleteScript(id);
    getScriptList();
  };

  const getScriptList = async () => {
    const data = await getScripts();
    console.log('-- [ data ] --', data);
    setScripts(data);
  };

  const updateScriptHandle = async (script: ScriptConfig) => {
    const newScript = {
      ...script,
      enabled: !script.enabled,
    };
    await updateScript(script.id, newScript);
    getScriptList()
  };

  useEffect(() => {
    getScriptList();
  }, []);

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
          <div key={script.id} className="flex justify-between p-4">
            <div className="flex max-w-[520px] items-center">
              <Icon icon="file-code" className="mr-5 text-xl text-blue-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {script.name}
                </h3>
                <p className="text-xs text-gray-500">{script.description}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="px-4">
                <ToggleSwitch
                  checked={script.enabled}
                  onChange={() => updateScriptHandle(script)}
                />
              </div>

              <Button
                text
                type="primary"
                icon={<i className="fas fa-edit"></i>}
                onClick={() => message.success('提交成功！')}
              />

              <Popconfirm
                title="确定要删除吗？"
                content="删除后无法恢复，请谨慎操作"
                onConfirm={() => deleteScriptHandle(script.id)}
                onCancel={() => console.log("取消")}
                okText="删除"
                cancelText="取消"
                placement="left"
              >
                <Button
                  text
                  type="danger"
                  icon={<i className="fas fa-trash"></i>}
                />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
