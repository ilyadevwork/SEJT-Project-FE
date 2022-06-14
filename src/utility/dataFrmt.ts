import type { dashboard } from "../components/configurator";
import snapshots from "../data/jobsNew.json";
import moment from 'moment';

export function chartDataFrmt (val: dashboard, aggregate: boolean) {
  if (aggregate === true) {
      const tempState = {...val};
      const snapShot = snapshots.find(x =>
        moment(x.date).format("YYYY-MM-DD") === val.selectedDate[0].format("YYYY-MM-DD"))
      tempState.chart.data = snapShot!.techRoot;
      return ({...tempState});
  }
}
