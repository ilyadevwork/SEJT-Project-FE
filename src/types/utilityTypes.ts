import snapshots from '../data/jobs.json';
import { toggleAction, dataAction } from '../types/actionTypes';

export type rootIdxType = typeof snapshots[0]['techRoot'];
export type branchIdxType =
  | 'name'
  | 'remote'
  | 'salaryEst'
  | 'jobType'
  | 'expLevel'
  | 'eduLevel'
  | 'location'
  | 'company';

export interface tableDataType {
  key: React.Key;
  identifier: string;
  category?: string;
  marketshare: number;
  value: number;
}

export type altDataType = typeof snapshots[0]['techBranch'][0][branchIdxType];
export type justObjects = Exclude<altDataType, string>;

export type Dictionary<T> = {
  [index: string]: T;
};

export interface chartConfig {
  data: any;
  xField: string;
  yField: string;
  seriesField: string;
  smooth: boolean;
  slider: any;
  theme: string;
  category?: string;
  label: {
    style: {
      fill: string;
    };
  };
  point: any;
  isGroup: any;
}

export interface optionWithTallyType {
  identifier: string;
  occurences?: number;
}

export interface configState {
  chartData: chartConfig;
  tableData: tableDataType[];
  category: string;
  selectedSubCategories: string[];
  selectedTechnologies: number[];
  selectedDate: [moment.Moment, moment.Moment];
  currentSnapshot: number;
  currentSnapshotSeries: number[];
  isSeries: boolean;
  isAggregate: boolean;
  isAllTechChecked: boolean;
  routeID: number;
  selectableSubCategories: optionWithTallyType[];
  selectableTechnologies: string[];
  currentTechCache: Dictionary<Array<string>>;
  toggleDispatch: (action: toggleAction) => void;
  dataDispatch: (action: dataAction) => void;
  updateSubCategoryOptions: (arg?: string) => void;
  updateTechnologiesOptions: (arg: string[]) => void;
}

export type stringOrMoment = string | moment.Moment;