import { FC } from "react";
import { Controller } from "react-hook-form";
import type { RangePickerProps } from "antd/es/date-picker";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  // return current && current < dayjs().endOf('day');

  //   disable dates before current date and after 1 month of current date.
  //   return dayjs().add(-1, 'days')  >= current ||
  //   dayjs().add(1, 'month')  <= current;

  return dayjs() <= current;

  // return dayjs().endOf("day") <= current;
};

const disabledForAduldDate: RangePickerProps["disabledDate"] = (current) => {
  return dayjs().add(-18, "years") < current;
};
interface DatePickerProps {
  name: string;
  control: any;
  errors?: any;
  defaultValue?: any;
  isDisabled?: boolean;
  placeholder?: string;
  format?: string;
  className?: string;
  allowClear?: boolean;
  checkAdult?: boolean;
  onChangeField?: () => void;
}
const DatePickerControl: FC<DatePickerProps> = ({
  name,
  control,
  errors,
  defaultValue,
  isDisabled = false,
  placeholder = "2022-01-01",
  format = "YYYY-MM-DD",
  className = "",
  allowClear = false,
  checkAdult = false,
  onChangeField,
}) => {
  let errMsg = errors?.[name]?.message;
  return (
    <div className="w-full">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            allowClear={allowClear}
            {...field}
            id={name}
            defaultValue={defaultValue}
            className={`rounded my-1 w-full ${className}`}
            status={errMsg && "error"}
            size="large"
            disabled={isDisabled}
            placeholder={placeholder}
            placement={"bottomLeft"}
            format={format}
            style={{ width: "100%" }}
            onChange={(e) => {
              onChangeField && onChangeField();
              field.onChange(e);
            }}
            // disabledDate={checkAdult ? disabledForAduldDate : disabledDate}
          />
        )}
      />
      <p className="text-red-600 text-xs">{errMsg}</p>
    </div>
  );
};

export default DatePickerControl;
