import React, { useState } from "react";
import Modal from "../../components/Modal";
import { saveScript } from "../utils";
import message from "../../components/Message";

export default function AddScripts() {
  const [showAddScriptModal, setShowAddScriptModal] = useState(false);
  const [newScriptName, setNewScriptName] = useState("");

  const handleSave = () => {
    saveScript(newScriptName);
    message.success("保存成功！");
    setShowAddScriptModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowAddScriptModal(true)}
        className="!rounded-button inline-flex items-center whitespace-nowrap rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <i className="fas fa-plus mr-2"></i>
        添加脚本
      </button>
      <Modal
        width="900px"
        title="添加脚本"
        isOpen={showAddScriptModal}
        onCancel={() => setShowAddScriptModal(false)}
        onConfirm={handleSave}
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                脚本名称
              </label>
              <input
                type="text"
                value={newScriptName}
                onChange={(e) => setNewScriptName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                脚本代码
              </label>
              <textarea
                value={newScriptName}
                onChange={(e) => setNewScriptName(e.target.value)}
                rows={12}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
