import React from "react";

export default function HelpContent() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-lg font-medium text-gray-900">
            如何使用扩展
          </h2>
          <p className="text-sm text-gray-600">
            安装扩展后，您可以通过点击浏览器工具栏中的扩展图标来访问主要功能。您可以在设置页面中自定义扩展的行为和外观。
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium text-gray-900">常见问题</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                扩展不工作怎么办？
              </h3>
              <p className="text-xs text-gray-500">
                请检查扩展是否已启用，并确保您没有在扩展的黑名单网站中。如果问题仍然存在，请尝试重新加载页面或重启浏览器。
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                如何添加自定义脚本？
              </h3>
              <p className="text-xs text-gray-500">
                在"脚本管理"页面中，点击"添加脚本"按钮，输入脚本名称并保存。您可以在脚本编辑器中编写或粘贴您的自定义JavaScript代码。
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium text-gray-900">联系我们</h2>
          <p className="text-sm text-gray-600">
            如果您需要进一步的帮助，请发送邮件至 support@extension.com
            或访问我们的网站 www.extension.com/support
          </p>
        </div>
      </div>
    </div>
  );
}
