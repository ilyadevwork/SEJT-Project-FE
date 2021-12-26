import _ from "underscore";

const snapshots = require("./data/jobs.json");

const jobs: jobsInterface = JSON.parse(snapshots[0].EntryData);

function valuesCompare(a: Object, b: Object) {
    if (_.values(a)[0] < _.values(b)[0]) return 1;
    else return -1;
  }

jobs.data.techRoot.skills.sort(valuesCompare);

const namesExtractor = function (data: Object) {
    let temp: string[] = [];
  
    for (let key of Object.values(data)) {
      temp.push(Object.keys(key)[0]);
    }
  
    return temp;
  };
  
  const valuesExtractor = function (data: Object) {
    let temp: number[] = [];
  
    for (let key of Object.values(data)) {
      temp.push(Object.values(key)[0] as number);
    }
  
    return temp;
  };
  

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


export {namesExtractor, valuesExtractor, jobs, snapshots, valuesCompare}
  