import { DatePicker, Space, Switch } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import React, { useState } from "react";
import {
  dashboard,
  dashState,
  disabledDate,
  firstDate,
  useDashContext,
} from "./configurator";
import moment from "moment";
import { dateUpdate, stateStore, tableUpdate } from "../utility/store";
const { RangePicker } = DatePicker;

const MyDatePicker: React.FC = () => {
  const [dashState, setDashState] = useDashContext();
  const [hidden, setHidden] = useState(true);
  const useStore = stateStore();

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    const tempState: dashboard = { ...dashState };
    if (typeof dateString === "string") {
      if (value === null) {
      } else
        setDashState(
          dateUpdate(
            dashState,
            [moment(dateString), moment(dateString)],
            true,
            useStore.catagory
          )!
        );
      setDashState(tableUpdate(dashState, true)!);
    } else {
      tempState.selectedDate = [moment(dateString[0]), moment(dateString[1])];
      console.log(tempState.selectedDate);
      setDashState({ ...tempState });
      console.log(dashState);
    }
  };

  return (
    <Space direction="horizontal" size={12}>
      <Switch
        checkedChildren="Aggregate"
        unCheckedChildren="Disaggregate"
        onChange={() => setHidden((s) => !s)}
      ></Switch>
      {!hidden ? (
        <RangePicker
          allowClear={false}
          size={"small"}
          disabledDate={disabledDate}
          defaultPickerValue={firstDate}
          onChange={onChange}
          bordered={false}
        />
      ) : (
        <DatePicker
          onChange={onChange}
          defaultPickerValue={firstDate![0]}
          defaultValue={firstDate![0]}
          size={"small"}
          allowClear={false}
          disabledDate={disabledDate}
          bordered={false}
        />
      )}
    </Space>
  );
};
export default MyDatePicker;
