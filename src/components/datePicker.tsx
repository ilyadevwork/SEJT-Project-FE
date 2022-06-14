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
import snapshots from "../data/jobsNew.json";

const { RangePicker } = DatePicker;

const MyDatePicker: React.FC = () => {
  const [dashState, setDashState] = useDashContext();
  const [hidden, setHidden] = useState(true);

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    const tempState: dashboard = { ...dashState };
    if (typeof dateString === "string") {
      tempState.selectedDate = [moment(dateString), moment(dateString)];
      const selectedData: any = snapshots.find(
        (x) => moment(x.date).format("YYYY-MM-DD") === dateString
      );
      tempState.chart.data = selectedData.techRoot.skills;
      console.log(tempState);
      setDashState({ ...tempState });
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
          size={"small"}
          disabledDate={disabledDate}
          bordered={false}
        />
      )}
    </Space>
  );
};
export default MyDatePicker;
