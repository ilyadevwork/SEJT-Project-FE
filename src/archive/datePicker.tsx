import React, { useState } from "react";
import { DatePicker, Space, Switch } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { disabledDate, firstDate, useDashContext } from "../components/configurator";
import moment from "moment";

const { RangePicker } = DatePicker;

type PickerType = "range" | "date";

const MyDatePicker: React.FC = () => {
  const [dashState,] = useDashContext();
  const [type, setType] = useState<PickerType>("date");

  const changeType = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {};

  const PickerWithType = ({
    type,
    onChange,
  }: {
    type: PickerType;
    onChange: typeof changeType;
  }) => {
    if (type === "range")
      return (
        <RangePicker
          bordered={false}
          defaultPickerValue={firstDate}
          disabledDate={disabledDate}
          onChange={onChange}
        />
      );
    if (type === "date")
      return (
        <DatePicker
          bordered={false}
          defaultPickerValue={firstDate![0]}
          disabledDate={disabledDate}
          onChange={onChange}
        />
      );
    return <DatePicker picker={type} onChange={onChange} />;
  };

  return (
    <Space direction="horizontal" size={12}>
      <Switch
        checkedChildren="Aggregate"
        unCheckedChildren="Disaggregate"
        onChange={(checked) => {
          if (checked === true) {
            setType("range");
          } else setType("date");
        }}
      ></Switch>
      <PickerWithType
        type={type}
        onChange={(value, datestr) => {
          if (typeof datestr === "string") {
            const tempState = dashState;
            tempState.selectedDate = [moment(datestr), moment(datestr)];

            console.log("Proof it runs");
            console.log(datestr);
          } else {
            console.log("this is the range picker");
          }
        }}
      />
    </Space>
  );
};

export default MyDatePicker;
