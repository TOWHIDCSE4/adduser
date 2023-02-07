import React, { useState, useEffect, useRef } from "react";
import { Upload, Modal } from "antd";
import { UploadFile } from "antd/lib/upload/interface";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UploadMultilField = ({
  onChange,
  listFile = [],
  children,
  beforeUpload,
  listType,
  multiple,
  limit,
  isImg,
  ...otherProps
}: {
  onChange?: Function;
  listFile?: UploadFile[];
  children: JSX.Element;
  isImg: boolean;
  beforeUpload?: Function;
  listType?: "text" | "picture" | "picture-card";
  multiple?: boolean;
  limit?: number;
  [x: string]: any;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([...listFile]);
  const [previewImg, setPreview] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const isInitialMount = useRef(true);

  let _limit = multiple ? limit : 1;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (onChange) onChange(fileList);
    }
  }, [fileList.length]);

  useEffect(() => {
    setFileList(listFile);
  }, [listFile.length]);

  const addFile = async (file: UploadFile) => {
    if (isImg) file.url = (await getBase64(file)) as string;
    if (multiple) {
      setFileList((prevFileList) => []);
      setFileList((prevFileList) => [file]);
    } else {
      setFileList((prevFileList) => [...prevFileList, file]);
    }
  };

  const _beforeUpload = (file: UploadFile) => {
    if (beforeUpload) file = beforeUpload(file);
    addFile(file);
    return false;
  };

  const onRemove = (file: UploadFile) => {
    const newList = [...fileList.filter((f) => f !== file)];
    setFileList(newList);
    if (onChange) onChange(newList);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!isImg) return;
    file.url ? file.url : (file.url = (await getBase64(file)) as string);
    setPreview(file.url);
    setPreviewVisible(true);
  };
  // console.log(fileList)
  return (
    <div>
      <Upload
        listType={listType}
        {...otherProps}
        multiple
        beforeUpload={_beforeUpload}
        onRemove={onRemove}
        fileList={fileList}
        onPreview={handlePreview}
      >
        {!_limit || fileList.length < _limit ? children : ""}
      </Upload>
      <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImg} />
      </Modal>
    </div>
  );
};

export default UploadMultilField;
