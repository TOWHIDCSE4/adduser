import { FC } from "react";
import { Upload, Button } from "antd";
import { Controller } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";

interface UploaderButtonProps {
  control: any;
  name: string;
  label: string;
  acceptFileFormat: any;
  afterFileUpload?: () => void;
}

export const UploaderButton: FC<UploaderButtonProps> = ({
  control,
  name,
  label,
  acceptFileFormat,
  afterFileUpload,
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Upload
            {...field}
            multiple={false}
            accept={acceptFileFormat}
            maxCount={1}
            onChange={(e) => {
              field.onChange(e);
              afterFileUpload && afterFileUpload();
            }}
            onRemove={(file) => {}}
            beforeUpload={() => false}
          >
            <Button
              htmlType="button"
              type="primary"
              size="middle"
              className="btn-cancel text-xs"
              icon={<UploadOutlined className="relative -top-0.5" />}
            >
              {label}
            </Button>
          </Upload>
        )}
      />
    </>
  );
};
