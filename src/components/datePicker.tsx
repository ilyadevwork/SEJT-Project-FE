import { DatePicker, Space, Switch } from "antd";
import moment from "moment";
import React from "react";
import { stateStore } from "../utility/state";
import { disabledDate, firstDate } from "../utility/store";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

const MyDatePicker: React.FC = () => {
  const { setDate, isAggregate, setAggregation} = stateStore();

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    if (isAggregate) {
      console.log("I'm Agg")
      if (value === null) 
      console.log("Null Date");
      else {
        setDate([moment(dateString), moment(dateString)]);   
      }
    } else {
      if (value === null) {
      } else setDate([moment(dateString[0]), moment(dateString[1])]);
    }
  };

  return (
    <Space direction="horizontal" size={12}>
      <Switch
        defaultChecked={true}
        checkedChildren="Single"
        unCheckedChildren="Series"
        onChange={(val) => setAggregation(val)}
      ></Switch>
      {isAggregate ? (
        <DatePicker
          onChange={onChange}
          defaultPickerValue={firstDate![0]}
          size={"small"}
          allowClear={false}
          disabledDate={disabledDate}
          bordered={false}
        />
      ) : (
        <RangePicker
          allowClear={false}
          size={"small"}
          disabledDate={disabledDate}
          defaultPickerValue={firstDate}
          onChange={onChange}
          bordered={false}
        />
      )}
    </Space>
  );
};

export default MyDatePicker;
