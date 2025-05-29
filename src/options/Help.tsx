import React from "react";
import MainHeader from "../components/MainHeader";
import HelpContent from "./components/HelpContent";

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
      {/* Header */}
      <MainHeader
        icon={
          <i className="fas fa-question-circle mr-4 text-3xl text-white"></i>
        }
        title="帮助中心"
        label="获取使用帮助和常见问题解答"
      >
      </MainHeader>

      {/* Help Content */}
      <HelpContent />
    </div>
  );
}
