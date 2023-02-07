import { FC } from "react";
import { Controller } from "react-hook-form";
import { Radio, Space } from "antd";

interface option {
  id: string | number;
  value: string | number;
  label: string | number;
}
interface RadioGroupControlProps {
  name: string;
  control: any;
  options: option[];
  errors?: any;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
}

const RadioGroupControl: FC<RadioGroupControlProps> = ({
  name,
  control,
  options,
  errors,
  disabled = false,
  direction = "horizontal",
}) => {
  let errMsg = errors?.[name]?.message;

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Radio.Group {...field} disabled={disabled} className="rounded my-1 w-full" size="large">
            <Space direction={direction}>
              {options?.length > 0 &&
                options?.map((option) => (
                  <Radio value={option?.value} key={option?.id}>
                    <span className="text-xs">{option?.label}</span>
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        )}
      />
      <p className="text-red-600 text-xs">{errMsg}</p>
    </>
  );
};

export default RadioGroupControl;
