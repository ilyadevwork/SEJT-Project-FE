import type { dashboard, tableData } from "../components/configurator";
import snapshots from "../data/jobsNew.json";
import moment from "moment";
import create from "zustand";

interface configState {
  catagory: string;
  setCatagory: (str: string) => void;
}

export const stateStore = create<configState>((set) => ({
  catagory: "Technologies",
  setCatagory: (str) => set((state) => ({ catagory: str })),
}));

export function dateUpdate(
  val: dashboard,
  date: [moment.Moment, moment.Moment],
  aggregate: boolean,
  catagory?: string
) {
  if (aggregate === true) {
    const tempState = { ...val };

    if (tempState.currentSnapshot === undefined) {
      console.log("Invalid");
      return { ...tempState };
    }

    tempState.selectedDate = date;
    tempState.currentSnapshot = snapshots.findIndex(
      (x) =>
        moment(x.date).format("YYYY-MM-DD") === date[0].format("YYYY-MM-DD")
    );
    switch (catagory) {
      case "Technologies":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.skills;
        break;
      case "Remote":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.remote;
        break;
      case "Salary Estimates":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.salaryEst;
        break;
      case "Employment Type":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.jobType;
        break;
      case "Experiance Level":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.expLevel;
        break;
      case "Education Level":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.eduLevel;
        break;
      case "Location":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.location;
        break;
      case "Company Openings":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.company;
        break;
      default:
        console.log("Something is broken");
        break;
    }
    console.log("Update From Date")
    return { ...tempState };
  }
}

export function catagoryUpdate(
  val: dashboard,
  aggregate: boolean,
  catagory: string
) {
  if (aggregate === true) {
    const tempState = { ...val };
    switch (catagory) {
      case "Technologies":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.skills;
        break;
      case "Remote":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.remote;
        break;
      case "Salary Estimates":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.salaryEst;
        break;
      case "Employment Type":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.jobType;
        break;
      case "Experiance Level":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.expLevel;
        break;
      case "Education Level":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.eduLevel;
        break;
      case "Location":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.location;
        break;
      case "Company Openings":
        tempState.chart.data =
          snapshots[tempState.currentSnapshot].techRoot.company;
        break;
      default:
        console.log("Something is broken");
        break;
    }
    console.log("Update From Catagory")
    return { ...tempState };
  }
}

export function tableUpdate(val: dashboard, aggregate: boolean) {
  if (aggregate === true) {
    const tempState: dashboard = { ...val };
    const tempData: [tableData] = tempState.chart.data;
    const returnData: {}[] = [];
    var marketShareTotal = 0;

    tempData.forEach((val) => {
      marketShareTotal = marketShareTotal + val.value;
    });

    tempData.forEach((val, idx) => {
      const someItem = {
        key: idx,
        ...val,
        marketshare: ((val.value / marketShareTotal) * 100).toFixed(2),
      };
      returnData.push(someItem);
    });
    tempState.table.data = returnData;


    console.log("Update From Table")
    return { ...tempState };
  }
}
