import { FC, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Select } from "antd";

const { Option } = Select;

interface option {
  value: string | number;
  label: string | number;
}
interface SelectControlProps {
  name: string;
  control: any;
  options: option[];
  defaultValue?: string | number;
  multiple?: boolean;
  errors?: any;
  msg?: string;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
  onChangeOption?: (value: any) => void
}

const SelectControl: FC<SelectControlProps> = ({
  name,
  control,
  options,
  defaultValue = "",
  multiple = false,
  errors,
  msg,
  isDisabled = false,
  placeholder = "",
  className = "",
  onChangeOption
}) => {
  const [optionList, setOptionList] = useState<any>([]);

  useEffect(() => {
    setOptionList(options);
  }, [options]);
  let errMsg = msg ? msg : errors?.[name]?.message;

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            mode={multiple ? "multiple" : undefined}
            disabled={isDisabled}
            className={`py-1 w-full ${className}`}
            status={errMsg && "error"}
            size="large"
            allowClear={false}
            bordered
            style={{width:'100%'}}
            onChange={(e)=>
              {
                onChangeOption && onChangeOption(e)
                field.onChange(e)
              }
            }
          >
            <Option value="">
              <span className="text-gray-400 wave-money-text">
                {placeholder}
              </span>
            </Option>
            {optionList?.length > 0 &&
              optionList?.map((item: any, index: any) => (
                <Option key={index} value={item?.value}>
                  <span className="wave-money-text">{item?.label}</span>
                </Option>
              ))}
          </Select>
        )}
      />
      <p className={`error-msg ${msg && "-bottom-3 left-1"} block `}>{errMsg}</p>
    </>
  );
};

export default SelectControl;
