import snapshots from "../archive/jobs.json";
import _ from "underscore";
import * as fs from "fs";

export interface jobsInterface {
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
}

interface tableData {
  identifier: string;
  value: number;
  catagory?: string;
}

function remapData(thisArr: object[]): tableData[] {
  var someArr: tableData[] = [];
  thisArr.map((element) => {
    if (element !== null || undefined) {
      const tempVal: tableData = {
        identifier: "",
        value: 0,
        catagory: "",
      };
      tempVal.value = Object.values(element)[0];
      tempVal.identifier = Object.keys(element)[0];
      someArr.push(tempVal);
    }
  });
  return someArr;
}

var snapshotsNew: any = [];

export function parseData() {
  snapshots.forEach(
    (snapshot: { EntryDate: string; EntryData: string }, idx: number) => {
      const tempData: jobsInterface = JSON.parse(snapshot.EntryData);
      tempData.techRoot.skills.sort(valuesCompare);

      var product = {
        date: snapshot.EntryDate,
        techBranch: Array(),
        techRoot: {},
      };

      tempData.techBranch.forEach((element) => {
        const Obj2 = {
          name: element.name,
          remote: remapData(element.remote),
          salaryEst: remapData(element.salaryEst),
          jobType: remapData(element.jobType),
          expLevel: remapData(element.expLevel),
          eduLevel: remapData(element.eduLevel),
          location: remapData(element.location),
          company: remapData(element.company),
        };

        Obj2.company.sort((a: tableData, b: tableData) => {
          return b.value - a.value;
        });
        Obj2.location.sort((a: tableData, b: tableData) => {
          return b.value - a.value;
        });

        if (Obj2.name === " ") {
          console.log("Empty Input");
        } else {
          product.techBranch.push({ ...Obj2 });
        }
      });

      const Obj1 = {
        jobs: tempData.techRoot.jobs,
        skills: remapData(tempData.techRoot.skills),
        remote: remapData(tempData.techRoot.remote),
        salaryEst: remapData(tempData.techRoot.salaryEst),
        jobType: remapData(tempData.techRoot.jobType),
        expLevel: remapData(tempData.techRoot.expLevel),
        eduLevel: remapData(tempData.techRoot.eduLevel),
        location: remapData(tempData.techRoot.location),
        company: remapData(tempData.techRoot.company),
      };

      Obj1.company.sort((a: tableData, b: tableData) => {
        return b.value - a.value;
      });

      product.techRoot = { ...Obj1 };

      snapshotsNew.push(product);
    }
  );
}
parseData();

const final = JSON.stringify(snapshotsNew);

fs.writeFile("./myjsonfile.json", final, "utf8", () => {});

function valuesCompare(a: Object, b: Object) {
  if (_.values(a)[0] < _.values(b)[0]) return 1;
  else return -1;
}

/*function namesExtractor(data: Object) {
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
}*/
