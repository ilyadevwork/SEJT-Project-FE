import _ from 'underscore';
const data = require('../data/jobs.json');

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

const jobs: jobsInterface = data;

function valuesCompare(a:object, b:object) {
  if (_.values(a)[0] < _.values(b)[0]) return 1;
  else return -1;

  return 0;
}

jobs.data.techRoot.skills.sort(valuesCompare);

const namesExtractor = function() {
  let temp = [];

  for (let key of Object.values(jobs.data.techRoot.skills)) {
    temp.push(Object.keys(key)[0]);
  };

  return temp;
}

const valuesExtractor = function() {
  let temp = [];

  for (let key of Object.values(jobs.data.techRoot.skills)) {
    temp.push(Object.values(key)[0]);
  };

  return temp;
}
  
export { namesExtractor, valuesExtractor};