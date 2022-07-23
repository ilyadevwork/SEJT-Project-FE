import create from "zustand";
import moment from "moment";
import snapshots from "../data/jobs.json";
import { stringify } from "querystring";

export type rootIdxType = typeof snapshots[0]["techRoot"];
export type branchIdxType = typeof snapshots[0]["techBranch"];

interface tableDataType {
  key: React.Key;
  identifier: string;
  marketshare: number;
  value: number;
}

interface chartConfig {
  data: any;
  xField: string;
  yField: string;
  seriesField: string;
  smooth: boolean;
  slider: {};
  theme: string; // 'dark',
  catagory?: string;
  point: {
    size: number;
    shape: string;
  };
  label: {
    style: {
      fill: string;
    };
  };
}

interface configState {
  chartData: chartConfig;

  catagory: string;
  setCatagory: (str: string) => void;

  isAggregate: boolean;
  setAggregation: (val: boolean) => void;

  selectedSubCatagories: string[];
  setSelectedSubCatagories: (entry: string[]) => void;

  tableData: tableDataType[];
  setTableData: (entry: tableDataType[]) => void;

  selectedDate: [moment.Moment, moment.Moment];
  setDate: (entry: [moment.Moment, moment.Moment]) => void;

  currentSnapshot: number;
  setCurrentSnapshot: (entry: number) => void;

  currentSnapshotSeries: number[];
  setCurrentSeries: (entry: number[]) => void;
}

export const stateStore = create<configState>((set, get) => ({
  catagory: "skills",
  setCatagory: (str) => {
    set((state) => ({ catagory: str }));

    const isAgg = get().isAggregate;

    if (isAgg) {
      const selectedSnap = get().currentSnapshot;
      const catagory = get().catagory as keyof rootIdxType;

      set((state) => ({
        chartData: {
          ...state.chartData,
          data: snapshots[selectedSnap].techRoot[catagory],
        },
      }));

      let marketShareTotal = 0;
      let temptableData: tableDataType[] = [];

      for (let obj of get().chartData.data)
        marketShareTotal = marketShareTotal + obj.value;

      for (let [idx, entry] of get().chartData.data.entries()) {
        temptableData.push({
          key: idx,
          ...entry,
          marketshare: ((entry.value / marketShareTotal) * 100).toFixed(2),
        });
      }

      set((state) => ({ tableData: temptableData }));
    } else {
     // get().setSelectedSubCatagories([]);
    }
  },

  isAggregate: true,
  setAggregation: (val) => {
    set((state) => ({ isAggregate: val }));
  },

  selectedSubCatagories: [],
  setSelectedSubCatagories: (entry) => {
    
    const currSubCatagories = get().selectedSubCatagories;

    if (entry.length > currSubCatagories.length) {

    set((state) => ({ selectedSubCatagories: entry }));
    const currentSeries = get().currentSnapshotSeries;
    const catagory = get().catagory as keyof rootIdxType;


      set((state) => ({ selectedSubCatagories: entry }));
      let tempChartData: object[] = [];
      // We can just search the aggregate data when it comes to listings.
      for (let i = 0; i < currentSeries.length; i++) {
        // iterate through all the selected days in between start and finish by thier index in our data.
        for (let j = 0; j < currSubCatagories.length; j++) {
          // iterate through every selected catagory
          const data: any = snapshots[currentSeries[i]].techRoot[catagory];
          // search that day's data for the catagory and retrieve its value
          data.find((val: any) => {
            // push data to temp array. x axis will be date.
            if (val.identifier == currSubCatagories[j]) {
              tempChartData.push({
                identifier: snapshots[currentSeries[i]].date.slice(0, 10),
                value: val.value,
                category: val.identifier,
              });
            }
          });
        }
      }
      set((state) => ({
        chartData: {
          ...state.chartData,
          data: tempChartData,
          seriesField: "category",
        },
      }));
      set((state) => ({ selectedSubCatagories: entry }));
    } else {

      const exclusion = currSubCatagories.filter((ele) => !entry.includes(ele));
      const dataPtr = get().chartData.data;

      for (let i = dataPtr.length; i > 0; i--) {
        if (dataPtr[i].catagory === exclusion) dataPtr.pop(dataPtr[i]);
      }
      set((state) => ({
        chartData: {
          ...state.chartData,
          data: dataPtr,
          seriesField: "category",
        },
      }));
      console.log(dataPtr);
      set((state) => ({ selectedSubCatagories: entry }));
    }
  },

  chartData: {
    data: [{}],
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

  tableData: [],
  setTableData: (entry) => set((state) => ({ tableData: entry })),

  selectedDate: [moment(snapshots[0].date), moment(snapshots[0].date)],
  setDate: (entry) => {
    set((state) => ({ selectedDate: entry }));
    const formattedEntry = entry[0].format("YYYY-MM-DD");

    for (let i = 0; i < snapshots.length; i++) {
      if (formattedEntry === moment(snapshots[i].date).format("YYYY-MM-DD"))
        get().setCurrentSnapshot(i);
    }

    const isAgg = get().isAggregate;
    const catagory = get().catagory as keyof rootIdxType;

    if (isAgg) {
      const selectedSnap = get().currentSnapshot;

      set((state) => ({
        chartData: {
          ...state.chartData,
          data: snapshots[selectedSnap].techRoot[catagory],
        },
      }));

      let marketShareTotal = 0;
      let temptableData: tableDataType[] = [];

      for (let obj of get().chartData.data)
        marketShareTotal = marketShareTotal + obj.value;

      for (let [idx, entry] of get().chartData.data.entries()) {
        temptableData.push({
          key: idx,
          ...entry,
          marketshare: ((entry.value / marketShareTotal) * 100).toFixed(2),
        });
      }

      set((state) => ({ tableData: temptableData }));
    } else {
      set((state) => ({ selectedDate: entry }));
      const tempSeries: number[] = [];

      for (let i = 0; i < snapshots.length; i++) {
        if (
          moment(snapshots[i].date).format("YYYY-MM-DD") >=
            entry[0].format("YYYY-MM-DD") &&
          moment(snapshots[i].date).format("YYYY-MM-DD") <=
            entry[1].format("YYYY-MM-DD")
        ) {
          tempSeries.push(i);
        }
      }
      get().setCurrentSeries(tempSeries);

      const tempCatagories = get().selectedSubCatagories;

      let tempChartData: object[] = [];
      // We can just search the aggregate data when it comes to listings.
      for (let i = 0; i < tempSeries.length; i++) {
        // iterate through all the selected days in between start and finish by thier index in our data.
        for (let j = 0; j < tempCatagories.length; j++) {
          // iterate through every selected catagory
          const data: any = snapshots[tempSeries[i]].techRoot[catagory];
          // search that day's data for the catagory and retrieve its value
          data.find((val: any) => {
            // push data to temp array. x axis will be date.
            if (val.identifier == tempCatagories[j]) {
              tempChartData.push({
                identifier: snapshots[tempSeries[i]].date.slice(0, 10),
                value: val.value,
                category: val.identifier,
              });
            }
          });
        }
      }
      set((state) => ({
        chartData: {
          ...state.chartData,
          data: tempChartData,
          seriesField: "category",
        },
      }));
    }
  },

  currentSnapshot: 0,
  setCurrentSnapshot: (entry) => set((state) => ({ currentSnapshot: entry })),

  currentSnapshotSeries: [0, 1],
  setCurrentSeries: (entry) =>
    set((state) => ({ currentSnapshotSeries: entry })),
}));
