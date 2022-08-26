import { DatePicker, Space, Switch } from "antd";
import moment from "moment";
import React from "react";
import { stateStore, disabledDate, initalDate } from "../store/state";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toggleActionType } from "../types/actionTypes";
const { RangePicker } = DatePicker;

const MyDatePicker: React.FC = () => {
  const setDate = stateStore((state) => state.setDate);
  const isSeries = stateStore((state) => state.isSeries);
  const dispatch = stateStore((state) => state.toggleDispatch);

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    if (!isSeries) {
      if (value === null) {
      } else {
        setDate([moment(dateString), moment(dateString)]);
      }
    } else {
      if (value === null) {
      } else setDate([moment(dateString[0]), moment(dateString[1])]);
    }
  };

  return (
    <Space direction="horizontal" size={24}>
      <Switch
        defaultChecked={false}
        checkedChildren="Series"
        unCheckedChildren="Series"
        onChange={(value) =>
          dispatch({ type: toggleActionType.TOGGLE_SERIES, payload: value })
        }
      ></Switch>
      {isSeries ? (
        <RangePicker
          allowClear={false}
          size={"small"}
          disabledDate={disabledDate}
          defaultValue={initalDate}
          defaultPickerValue={initalDate}
          onChange={onChange}
          bordered={false}
        />
      ) : (
        <DatePicker
          onChange={onChange}
          defaultPickerValue={initalDate![0]}
          defaultValue={initalDate![0]}
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
