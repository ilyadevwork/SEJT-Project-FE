import moment from "moment";
import snapshots from "../data/jobs.json";
import type { RangePickerProps } from "antd/es/date-picker";

export const firstDate: RangePickerProps["defaultPickerValue"] = [
  moment(snapshots[0].date),
  moment(snapshots[0].date),
];

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  if (current === null) {
    console.log("foo");
  }
  if (
    snapshots.find(
      (obj) =>
        moment(obj.date).format("YYYY-MM-DD") === current.format("YYYY-MM-DD")
    ) !== undefined
  )
    return false;
  else return true;
};