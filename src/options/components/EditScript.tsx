import React, { useState } from "react";
import Button from "../../components/Button";
import message from "../../components/Message";
import Modal from "../../components/Modal";
import { updateScript } from "../utils";

interface EditScriptProps {
  scriptId: number;
  scriptData: any;
  reload: () => void;
}

export default function EditScript(props: EditScriptProps) {
  const { scriptId, scriptData } = props;
  const [showModal, setShowModal] = useState(false);
  const [scriptContent, setScriptContent] = useState(scriptData);

  const handleUpdate = async () => {
    await updateScript(scriptId, scriptContent);
    message.success("保存成功！");
      props.reload?.();
    setShowModal(false);
  };

  return (
    <>
      <Button
        text
        type="primary"
        icon={<i className="fas fa-edit"></i>}
        onClick={() => setShowModal(true)}
      />
      <Modal
        width="900px"
        title="添加脚本"
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        confirmText="保存"
        onConfirm={handleUpdate}
      >
        <div className="p-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            脚本代码
          </label>
          <textarea
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            rows={12}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          ></textarea>
        </div>
      </Modal>
    </>
  );
}
