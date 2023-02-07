import { useState, FC, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { Controller } from "react-hook-form";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImageUploaderProps {
  control: any;
  name: string;
  errors?: any;
  msg?: string;
  acceptFileFormat?: any;
  afterFileUpload?: () => void;
  onRemove: () => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  control,
  name,
  errors,
  msg,
  acceptFileFormat,
  afterFileUpload,
  onRemove,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  let errMsg = msg ? msg : errors?.[name]?.message;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }} className="wave-money-text">
        Upload
      </div>
    </div>
  );
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
              handleChange(e);
              afterFileUpload && afterFileUpload();
            }}
            onRemove={(file) => {
              setFileList([]);
              onRemove();
            }}
            onPreview={handlePreview}
            fileList={fileList}
            listType="picture-card"
            beforeUpload={() => false}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        )}
      />
      {fileList.length > 0 && <p className="error-msg">{errMsg}</p>}
      <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="profile image" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUploader;
