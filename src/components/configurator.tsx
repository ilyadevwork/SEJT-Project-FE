import snapshots from "../data/jobsNew.json";
import moment from "moment";
import type { RangePickerProps } from "antd/es/date-picker";
import React from "react";

export interface tableData {
  identifier: string;
  value: number;
  catagory?: string;
}

export interface dashboard {
  chart: {
    data: any;
    xField: string;
    yField: string;
    seriesField: string;
    smooth: boolean;
    slider: {};
    theme: string; // 'dark',
    point: {
      size: number;
      shape: string;
    };
    label: {
      style: {
        fill: string;
      };
    };
  };
  selectedDate: [moment.Moment, moment.Moment];
  currentSnapshot: number;
  table: {
    data: any[];
  };
}

const dashConfig: dashboard = {
  chart: {
    data: snapshots[0].techRoot.skills,
    theme: "default", // 'dark',
    seriesField: "",
    slider: {
      start: 0,
      end: 1,
    },
    xField: "identifier",
    yField: "value",
    smooth: false,
    point: {
      size: 5,
      shape: "circle",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  },
  selectedDate: [moment(snapshots[0].date), moment(snapshots[0].date)],
  currentSnapshot: 0,
  table: {
    data: [],
  },
};

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

export const useDashboard = (initial: dashboard) =>
  React.useState<dashboard>(initial);
export type useDashType = ReturnType<typeof useDashboard>;
export type dashState = useDashType[0];
export type setDashState = useDashType[1];

const DashContext = React.createContext<useDashType | null>(null);

export const useDashContext = () => React.useContext(DashContext)!;
export const DashProvider = ({ children }: { children: React.ReactNode }) => (
  <DashContext.Provider value={useDashboard(dashConfig)}>
    {children}
  </DashContext.Provider>
);
