import { DatePicker, Space, Switch } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import React from "react";
import { disabledDate, firstDate, useDashContext } from "./configurator";
import moment from "moment";
import { stateStore } from "../utility/state";
import { dateUpdate, tableUpdate } from "../utility/store";
const { RangePicker } = DatePicker;


const MyDatePicker: React.FC = () => {
  const [dashState, setDashState] = useDashContext();
  const useStore = stateStore();

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    if (useStore.isAggregate === true) {
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
      if (value === null) {
      } else
        setDashState(
          dateUpdate(
            dashState,
            [moment(dateString[0]), moment(dateString[1])],
            false,
            useStore.catagory,
            useStore.selectedTech,
            useStore.branchLoadedItems,
          )!
        );
      setDashState(tableUpdate(dashState, true)!);
    }
  };

  return (
    <Space direction="horizontal" size={12}>
      <Switch
        defaultChecked={true}
        checkedChildren="Single"
        unCheckedChildren="Series"
        onChange={(val) => useStore.setAggregation(val)}
      ></Switch>
      {useStore.isAggregate ? (
        <DatePicker
          onChange={onChange}
          defaultPickerValue={firstDate![0]}
          defaultValue={firstDate![0]}
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
