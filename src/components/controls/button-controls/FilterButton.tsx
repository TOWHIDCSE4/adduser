import { FC } from "react";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";

interface FilterButtonProps {
  onFilter: () => void;
}
export const FilterButton: FC<FilterButtonProps> = ({ onFilter }) => {
  return (
    <Button
      size="large"
      icon={<FilterOutlined className="relative -left-0.5 !text-xs" />}
      className="px-4 xl:px-6 text-gray-500 !rounded"
      onClick={onFilter}
      style={{ fontSize: "10px" }}
    >
      <span className="relative top-0.5">Filter by</span>
    </Button>
  );
};
