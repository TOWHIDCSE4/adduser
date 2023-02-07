import { FC } from "react";
import { Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
  size?: "SMALL" | "MEDUIM" | "LARGE";
}

export const ResetButton: FC<ResetButtonProps> = ({ onReset, className, size = "MEDUIM" }) => {
  return (
    <Tooltip placement="bottom" title="Reset">
      <Button
        className={`bg-sky-800 hover:bg-sky-700 focus:bg-sky-700 border-sky-700 !rounded shadow-none  ${className} ${
          size === "SMALL" ? "!h-9" : ""
        }`}
        type="primary"
        size="large"
        htmlType="button"
        onClick={onReset}
        icon={<ReloadOutlined className="text-gray-200 relative -top-1" />}
      />
    </Tooltip>
  );
};
