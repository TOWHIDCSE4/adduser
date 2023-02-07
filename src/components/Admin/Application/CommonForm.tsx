import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Select, Upload } from "antd";
import axios from "axios";
import { FC, useState } from "react";
const { TextArea } = Input;
interface CommonFormProps {
  formField: any;
  form: any;
}

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  return isJpgOrPng;
};
export const CommonForm: FC<CommonFormProps> = ({ formField, form }) => {
  // const { control, setValue } = useFormContext();
  const {
    fieldName,
    label,
    inputType,
    // options,
    defaultValue,
    isDisabled,
    validations,
    col,
    position,
    list,
  } = formField || {};

  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl]:any[] = useState();

  const handleImagePreview = (e) => {
    e.preventDefault();
    setIsUploaded(false);
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
      )}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const onChangeImage = async (info, field) => {
    try {
      const formData = new FormData();
      const { status } = info.file;
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      }
      formData.append("profileImg", info.file.originFileObj);
      const res = await axios
        .post("http://localhost:3333/upload", formData, {}) //update to config
        .then((res) => {
          return res.data.profileImg;
        });

      console.log(res, field, form?.getFieldsValue());
      form?.setFieldsValue({ [field]: res });
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  const onDropImage = (e) => {};
  const getFile = async (e) => {
    const result = await toBase64(e.file.originFileObj).then((res) => res);
    setSelectedImage(JSON.stringify(result));
    console.log(selectedImage);

    return result;
  };

  const handlePreview = async (file) => {};

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const customValidation = (rules, fieldName) => {
    console.log(rules.map((rule) => JSON.parse(JSON.stringify(rule))));

    // if (currentvalue.trim().length !== 0) {
    //   return Promise.resolve();
    // } else {
    //   return Promise.reject("Some message here");
    // }
    if (rules) {
      return [
        // { required: rules[0], message: `${fieldName} is required` },
        { required: true, message: `${fieldName} is required` },
        // { max: 5, message: "is required" },
        {
          message: "white-space is not valid",
          validator: (_, value) => {
            if (value.trim().length !== 0) {
              return Promise.resolve();
            } else {
              return Promise.reject("");
            }
            // return customValidation(validations, value);
          },
        },
        {
          message: `${fieldName} length is exceed`,
          validator: (_, value) => {
            if (value.length > 0 && value.length < 255) {
              return Promise.resolve();
            } else {
              return Promise.reject("");
            }
            // return customValidation(validations, value);
          },
        },
      ];
    }
  };

  if (inputType === "textInput") {
    validations.map((validate) => console.log(validate));

    return (
      <Form.Item
        name={fieldName}
        label={label}
        rules={customValidation(validations, fieldName)}
      >
        <Input
          // control={control}
          name={"data.firstName"}
          type={"text"}
          size="large"
        />
      </Form.Item>
      // <div>
      // 	<FieldLabel name={fieldName} label={label} />
      // 	<Input
      // 		control={control}
      // 		name={fieldName}
      // 		type={inputType}
      // 		size="large"
      // 	/>
      // </div>
    );
  } else if (inputType === "numberInput") {
    return (
      <div>
        <Form.Item
          name={fieldName}
          label={label}
          rules={customValidation(validations, fieldName)}
        >
          <Input
            // control={control}
            name={"data.numberInput"}
            type={"number"}
            size="large"
          />
        </Form.Item>
      </div>
    );
  } else if (inputType === "textAreaInput") {
    return (
      <div>
        <Form.Item name={fieldName} label={label}>
          <TextArea
            showCount
            maxLength={100}
            disabled={isDisabled}
            style={{
              height: 120,
              marginBottom: 24,
            }}
          />
        </Form.Item>
      </div>
    );
  } else if (inputType === "selectInput") {
    let options: any = [];

    if (list?.sourceType === "manual") {
      const optionData = list?.source?.split(", ");
      options = optionData?.map((item: any) => {
        return { label: item, value: item };
      });
    }

    return (
      <div>
        <Form.Item name={fieldName} label={label}>
          <Select
            // name={"data.selectInput"}
            // type={'sle'}
            size="large"
            options={options}
          />
        </Form.Item>
      </div>
    );
  } else if (inputType === "dateTimeInput") {
    return (
      <div>
        <Form.Item
          name={fieldName}
          label={label}
          rules={validations?.map((element) => ({
            required: true,
            message: element.message,
          }))}
        >
          <DatePicker
            name={"data.dateTimeInput"}
            style={{ display: "flex", padding: "10px 5px" }}
          />
        </Form.Item>
      </div>
    );
  } else if (inputType === "fileInput") {
    return (
      <>
        {/* {isUploaded && (<div className="container">
				<img src={selectedImage} alt="my image" className="image" />
				<div className="middle">
					<button className="button-text" onClick={handleImagePreview}>&#10060;</button>
				</div>
				</div>)} */}

        <Form.Item
          name={fieldName}
          label={label}
          noStyle
          getValueProps={(value) => setImageUrl(value)}
        >
          <Upload.Dragger
            name={fieldName}
            onChange={(info) => onChangeImage(info, fieldName)}
            onDrop={onDropImage}
            onPreview={handlePreview}
            showUploadList={false}
            listType="picture-card"
            className="avatar-uploader"
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100px",
				  height: '100px'
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload.Dragger>
        </Form.Item>
      </>
    );
  } else {
    return <></>;
  }
};