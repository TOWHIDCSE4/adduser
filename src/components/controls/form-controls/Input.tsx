import { FC } from "react";
import { Controller } from "react-hook-form";
import { Input } from "antd";

interface InputControlProps {
  name: string;
  type?: string;
  control: any;
  errors?: any;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  msg?: string;
  size?: "small" | "middle" | "large";
  toUpper?: boolean
  onChangeField?: () => void
}
const InputControl: FC<InputControlProps> = ({
  name,
  type = "text",
  control,
  errors,
  msg,
  disabled = false,
  placeholder = "",
  className = "",
  size = "middle",
  defaultValue = "",
  toUpper = false,
  onChangeField
}) => {
  let errMsg = msg ? msg : errors?.[name]?.message;
  return (
    <div className="relative w-full">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            allowClear
            {...field}
            type={type}
            id={name}
            className={`rounded my-1 py-2 w-full ${className}`}
            status={errMsg && "error"}
            size={size}
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onInput={(e:any) => {
              e.target.value = toUpper ? e.target.value.toUpperCase() : e.target.value
              onChangeField && onChangeField()
            }
          }
          />
        )}
      />
      <p className="error-msg">{errMsg}</p>
    </div>
  );
};

export default InputControl;
