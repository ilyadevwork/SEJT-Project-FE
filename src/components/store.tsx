import _ from "underscore";
import { DateRange } from "@mui/lab/DateRangePicker/RangeTypes";
import snapshots from "../data/jobs.json";
import React from "react";

interface jobsInterface {
  data: {
    techBranch: [
      {
        name: string;
        remote: Array<object>;
        salaryEst: Array<object>;
        jobType: Array<object>;
        expLevel: Array<object>;
        eduLevel: Array<object>;
        location: Array<object>;
        company: Array<object>;
      }
    ];
    techRoot: {
      jobs: number;
      skills: Array<object>;
      remote: Array<object>;
      salaryEst: Array<object>;
      jobType: Array<object>;
      expLevel: Array<object>;
      eduLevel: Array<object>;
      location: Array<object>;
      company: Array<object>;
    };
  };
}

interface jobsData {
  dates: Date[];
  data: jobsInterface[];
}

interface dash {
  chartdata: {
    datasets: [
      {
        label: string;
        data: number[];
        backgroundColor?: string,
      }
    ];
    labels: string[];
  };
  options: {
    responsive: boolean;
    plugins: {
      legend: {
        position: any;
      };
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

var jobsStore: jobsData = {
  dates: [],
  data: [],
};

const firstDate = new Date(snapshots[0].EntryDate);
const lastDate = new Date(snapshots[snapshots.length - 1].EntryDate);
firstDate.setHours(0, 0, 0, 0);
lastDate.setHours(0, 0, 0, 0);

snapshots.map((snapshot: { EntryDate: string; EntryData: string }) => {
  const tempDate: Date = new Date(snapshot.EntryDate);
  const tempData: jobsInterface = JSON.parse(snapshot.EntryData);
  tempData.data.techRoot.skills.sort(valuesCompare);
  jobsStore.data.push(tempData);
  tempDate.setHours(0, 0, 0, 0);
  jobsStore.dates.push(tempDate);
  return true;
});

const initDash: dash = {
  chartdata: {
    datasets: [
      {
        label: jobsStore.dates[0].toString(),
        data: valuesExtractor(jobsStore.data[0].data.techRoot.skills),
      },
    ],
    labels: namesExtractor(jobsStore.data[0].data.techRoot.skills),
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Temp",
      },
    },
  },
};

/*function remapData(name: string[], value: number[]): tableData[] {
  const tempArr: tableData[] = [];
  for (var index in value) {
    tempArr.push({
      name: name[index],
      value: value[index],
    });
  }
  return tempArr;
}*/

const updateData = (curState: dash, range: DateRange<Date>): dash => {
  const newState = { ...curState };
  if ((range[0]!.toString() === range[1]!.toString())) {
    const idx = jobsStore.dates.findIndex(
      (value) => value.valueOf() === range[0]?.valueOf()
    );

    newState.chartdata.datasets.push({
      label: jobsStore.dates[idx].toString(),
      data: valuesExtractor(jobsStore.data[idx].data.techRoot.skills),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    });

    newState.chartdata.labels = namesExtractor(
      jobsStore.data[idx].data.techRoot.skills
    );

  } else {
  }
  return { ...newState };
};

// Function which takes a date, and returns true if it should be disabled in
// the date range picker component.
function disableDates(date: Date): boolean {
  if (excludedDates.find((value) => value === date.getTime()) !== undefined) {
    return true;
  }
  else return false;
}

// Takes the domain of dates designated by database source and returns and array
// of those dates in ms.
var excludedDates: number[] = [];

function dateFilter(arr: number[], target: number) {
  if (arr.find((element) => element === target) === undefined) {
    excludedDates.push(target); 
  }
}

function dates2disable() {
  const totalDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / 86400000
  );
  var storeArr: number[] = [];

  // Fills an array with the time value for every day data was collected. (gaps)
  for (var index = 0; index < jobsStore.dates.length; index++)
    storeArr.push(jobsStore.dates[index].getTime());

  // Loops through the domain of days, if the time value is not
  // found in the store, condition returns undefined which then
  // stores the value.
  for (var i = 0; i < totalDays; i++) {
    var tempVal = firstDate.getTime() + (i * 86400000);
    dateFilter(storeArr, tempVal)
  }
}

dates2disable();

function valuesCompare(a: Object, b: Object) {
  if (_.values(a)[0] < _.values(b)[0]) return 1;
  else return -1;
}

function namesExtractor(data: Object) {
  let temp: string[] = [];

  for (let key of Object.values(data)) {
    temp.push(Object.keys(key)[0]);
  }
  return temp;
}

function valuesExtractor(data: Object) {
  let temp: number[] = [];

  for (let key of Object.values(data)) {
    temp.push(Object.values(key)[0] as number);
  }

  return temp;
}

function getDateRange() {
  const recordRange: DateRange<Date> = [firstDate, lastDate];
  return recordRange;
}

export const useDashboard = (initial: dash) => React.useState<dash>(initial);
export type useDashType = ReturnType<typeof useDashboard>;
export type dashState = useDashType[0];
export type setDashState = useDashType[1];

const DashContext = React.createContext<useDashType | null>(null);
export const useDashContext = () => React.useContext(DashContext)!;
export const DashProvider = ({ children }: { children: React.ReactNode }) => (
  <DashContext.Provider value={useDashboard(initDash)}>
    {children}
  </DashContext.Provider>
);

export { updateData, getDateRange, disableDates};
