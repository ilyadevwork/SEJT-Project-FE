import type { dashboard, tableData } from "../components/configurator";
import snapshots from "../data/jobsNew.json";
import moment from "moment";
import { stateStore } from "./state";

export function dateUpdate(
  val: dashboard,
  date: [moment.Moment, moment.Moment],
  aggregate: boolean,
  catagory?: string,
  selectedTech?: string[],
  loadedData?: [
    {
      name: string;
      location: number;
    }
  ]
) {
 // const stateStrr = stateStore();
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
    console.log("Update From Date");
    return { ...tempState };
  } else {
    if (aggregate === false) {
      const tempState: dashboard = { ...val }; // Load Copy of Current State
      tempState.selectedDate = date; // Update Date State
      console.log(tempState.selectedDate);
      const indexes = snapshots
        .map((element, index) => {
          const tempDate = moment(element.date);
          if (
            tempDate > tempState.selectedDate[0] &&
            tempDate < tempState.selectedDate[1]
          ) {
            return index;
          }
        })
        .filter((element) => element! >= 0); // Computes an Array of the locations in database object array, where the indexes point to the days included and between the two dates selected.

      selectedTech!.forEach((element, idx) => {
        // Current user selected list of Technologies to return historical data for.
        if (loadedData!.find((item) => selectedTech![idx] === item.name))
          // If the technology is already loaded, avoid processing it and move onto next item.
          return null;
        indexes.forEach((thing, idx) => {
          // Iterates through pointers to days in the database.
          var result = snapshots[indexes[idx]!].techBranch.find(
            (item) => item.name === selectedTech![idx]
          ); // Finds in the techBranch's array, the requested technology by name and returns that object.

          switch (
            catagory // Filters the resulting object, by the current catagory specified.
          ) {
            case "Remote":
              tempState.chart.data = result!.remote.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Salary Estimates":
              tempState.chart.data = result!.salaryEst.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Employment Type":
              tempState.chart.data = result!.jobType.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Experiance Level":
              tempState.chart.data = result!.expLevel.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Education Level":
              tempState.chart.data = result!.eduLevel.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Location":
              tempState.chart.data = result!.location.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            case "Company Openings":
              tempState.chart.data = result!.company.map((ele) => ({
                ...ele,
                date: snapshots[indexes[idx]!].date,
              }));
              break;
            default:
              console.log(
                "Something is broken & Please find a better way to manage errors"
              );
              break;
          }
          loadedData!.push({
            name: result!.name,
            location: indexes[idx]!,
          });
        });
      });
    //  stateStrr.branchLoadedItems = loadedData!;
    console.log(tempState);
      console.log("Update From Date");
      return { ...tempState };
    }
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
    console.log("Update From Catagory");
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

    console.log("Update From Table");
    return { ...tempState };
  }
}

// Should return array of objects arranged as the forllowing
/*

{
  date : ...... ( X Axis )
  identifier: ...... ( Name of Technology ) -> Maps to wsCatagory
  value : ...... ( Value... Duh )
}

*/
