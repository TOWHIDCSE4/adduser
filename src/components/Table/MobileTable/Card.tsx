import React from "react";
import { Descriptions } from "antd";
import _ from "lodash";

interface CardComponentProps {
  columns?: any[];
  record?: any;
  otherProps?: any;
  alignValue?: string;
}

const CardComponent = ({
  columns = [],
  record = {},
  alignValue = "left",
  ...otherProps
}: CardComponentProps) => {

  const renderValue = (column: any) => {
    return (
      <div style={{ textAlign: alignValue as any }}>
        {typeof column.render == "function"
          ? column.render(record[column.dataIndex], record)
          : record[column.dataIndex]}
      </div>
    );
  };
  return (
    <Descriptions
      bordered
      column={3}
      {...otherProps}
      style={{ marginBottom: "8px" }}
    >
      {columns.map((column: any, index: any) => {
        return (
          <Descriptions.Item label={column.title} span={3} key={index}>
            {renderValue(column)}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
};

export default CardComponent;
