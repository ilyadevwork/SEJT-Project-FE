const data = require('../data/jobs.json');

interface jobsInterface {
    data: {
      techBranch: [
        {
          name: "";
          remote: [];
          salaryEst: [];
          jobType: [];
          expLevel: [];
          eduLevel: [];
          location: [];
          company: [];
        }
      ];
      techRoot: {
        jobs: 0;
        skills: [];
        remote: [];
        salaryEst: [];
        jobType: [];
        expLevel: [];
        eduLevel: [];
        location: [];
        company: [];
      };
    };
  }

const jobs: jobsInterface = data;

const namesExtractor = function() {
    let temp = [];
  
    for (let key of Object.values(jobs.data.techRoot.skills)) {
          temp.push(Object.keys(key)[0]);
    };

    return temp;
  }

  const valuesExtractor = function() {
    let temp:number[] = [];
  
    for (let key of Object.values(jobs.data.techRoot.skills)) {
          temp.push((Object.values(key)[0] as number));
    };

    return temp;
  }
  
  const graphutil = function(labels: string[], values: number[]): Object[] {
      let temp: Object[] = [];

      for (let j = 0; j < labels.length; j++) {
        temp.push({x:labels[j],y:values[j]})
      }
          
    return temp;
  }


export {namesExtractor, valuesExtractor, graphutil};

