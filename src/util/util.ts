import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';
import snapshots from '../data/jobs.json';
import type { Dictionary, stringOrMoment } from '../types/utilityTypes';

const toDay = (date: stringOrMoment) => moment(date).format('YYYY-MM-DD');

export const isSameDay = (firstDateString: stringOrMoment, secondDateString: stringOrMoment) =>
  /* eslint-ignore implicit-arrow-linebreak */
  toDay(firstDateString) === toDay(secondDateString);

export const initalDate: [moment.Moment, moment.Moment] = [moment(snapshots[0].date), moment(snapshots[1].date)];

export const disabledDate: RangePickerProps['disabledDate'] = (current) =>
  snapshots.find((obj) => moment(obj.date).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')) !== undefined;

export const buildTechIndex = (curSnap: number): Dictionary<number> => {
  const index: Dictionary<number> = {};
  for (let i = 0; i < snapshots[curSnap].techBranch.length; i += 1) index[snapshots[curSnap].techBranch[i].name] = i;

  return index;
};

export const routeCalculator = (isAgg: boolean, isAllTech: boolean, isSeries: boolean): number => {
  if (isSeries === true) return 3;
  if ((isAgg && isAllTech === true) || (isAgg === true && isAllTech === false)) return 2;
  if (isAgg === false && isAllTech === true) return 1;
  return 0;
};
