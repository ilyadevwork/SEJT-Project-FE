import { DatePicker, Space } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import React from "react";
import {
  disabledDate,
  firstDate,
  useDashContext,
} from "./configurator";
import moment from "moment";
import { render } from "react-dom";

const { RangePicker } = DatePicker;


const MyThingPicker2: React.FC = () => {
  const [dashState, setDashState] = useDashContext();

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    const tempState: any = {...dashState};
    if (typeof dateString === 'string'){
      tempState.selectedDate=[moment(dateString), moment(dateString)];
      console.log(tempState.selectedDate)
      setDashState(tempState);
      console.log(dashState);
    }
    else {
      tempState.selectedDate = [moment(dateString[0]), moment(dateString[1])];
      console.log(tempState.selectedDate)
      setDashState({...tempState});
      console.log(dashState);
    }
  };
  return (
    <Space direction="vertical" size={12}>
      <DatePicker onChange={onChange}/>
      <RangePicker
        onChange={onChange}
      />
    </Space>
  );
};
export default MyThingPicker2;
