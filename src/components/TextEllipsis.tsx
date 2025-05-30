import React, { useState } from "react";

interface TextEllipsisProps {
  text: string;
  maxLines?: number; // 控制最大显示行数
  ellipsisChar?: string; // 自定义省略字符
}

const TextEllipsis: React.FC<TextEllipsisProps> = ({
  text,
  maxLines = 2,
  ellipsisChar = "...",
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <p
        className={`text-xs text-gray-500 ${
          expanded ? "" : `line-clamp-${maxLines}`
        }`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {text}
      </p>

      {/* 判断是否需要显示“展开”按钮 */}
      <HasEllipsis text={text} maxLines={maxLines}>
        <button
          onClick={toggleExpand}
          className="mt-1 text-xs text-blue-500 underline"
        >
          {expanded ? "收起" : "展开"}
        </button>
      </HasEllipsis>
    </div>
  );
};

// 辅助组件：检测是否溢出
const HasEllipsis: React.FC<{
  text: string;
  maxLines: number;
  children: React.ReactNode;
}> = ({ text, maxLines, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasEllipsis, setHasEllipsis] = React.useState(false);

  React.useEffect(() => {
    const checkEllipsis = () => {
      const el = ref.current;
      if (el) {
        const isOverflowed =
          el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
        setHasEllipsis(isOverflowed);
      }
    };

    checkEllipsis();
    window.addEventListener("resize", checkEllipsis);
    return () => window.removeEventListener("resize", checkEllipsis);
  }, [text, maxLines]);

  return <div ref={ref}>{hasEllipsis ? children : null}</div>;
};

export default TextEllipsis;
