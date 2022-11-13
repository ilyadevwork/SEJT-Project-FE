import create from 'zustand';
import moment from 'moment';
import snapshots from '../data/jobs.json';
import { toggleAction, dataAction, toggleActionType } from '../types/actionTypes';
import { toggleActionReducer, dataActionReducer } from './reducers';
import { Select } from 'antd';
import {
  tableDataType,
  rootIdxType,
  branchIdxType,
  Dictionary,
  optionWithTallyType,
  configState,
} from '../types/utilityTypes';

const { Option } = Select;

export const stateStore = create<configState>((set, get) => ({
  routeID: 2,
  category: '',
  isSeries: false,
  selectedSubCategories: [],
  selectedTechnologies: [],
  chartData: {
    data: [{}],
    theme: 'default', // 'dark',
    seriesField: '',
    slider: {
      start: 0,
      end: 1,
    },
    xField: 'identifier',
    yField: 'value',
    smooth: true,
    label: {
      style: {
        fill: '#aaa',
      },
    },
    point: {
      size: 3,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    isGroup: true,
  },
  tableData: [],
  selectedDate: [moment(null), moment(null)],
  currentSnapshot: 0,
  currentSnapshotSeries: [0, 1],
  isAggregate: true,
  isAllTechChecked: true,
  toggleDispatch(action: toggleAction) {
    set((state) => toggleActionReducer(state, action));
  },
  dataDispatch(action: dataAction) {
    set((state) => dataActionReducer(state, get().routeID, action) ?? state);
  },
  selectableSubCategories: [],
  selectableTechnologies: [],
  updateSubCategoryOptions(newCategory?: string) {
    const agg = get().isAggregate;
    let category: string;

    if (newCategory) category = newCategory;
    else category = get().category;

    const currentSnapshot = get().currentSnapshot;

    if (agg === false) {
      const selection = category as branchIdxType;
      let subCategoryOptions: optionWithTallyType[] = [];
      const seenIdx: Dictionary<number> = {};
      const techCache: Dictionary<Array<string>> = {};
      const categorycache: string[] = [];

      for (let i = 0; i < snapshots[currentSnapshot].techBranch.length; i++) {
        const data: any = snapshots[currentSnapshot].techBranch[i][selection];
        for (const d of data) {
          if (seenIdx[d.identifier] === undefined) {
            techCache[d.identifier] = [];
            seenIdx[d.identifier] = 1;
            categorycache.push(d.identifier);
            techCache[d.identifier].push(snapshots[currentSnapshot].techBranch[i].name);
          } else {
            seenIdx[d.identifier]++;
            techCache[d.identifier].push(snapshots[currentSnapshot].techBranch[i].name);
          }
        }
      }

      if (selection === 'salaryEst') {
        categorycache.sort((a, b) => (parseInt(a.substring(1, 4)) > parseInt(b.substring(1, 4)) ? 1 : -1));
      }

      for (const entry of categorycache) {
        subCategoryOptions.push({ identifier: entry, occurences: seenIdx[entry] });
      }

      set((state) => ({
        selectableSubCategories: subCategoryOptions,
        currentTechCache: techCache,
      }));
    } else {
      const selection = category as keyof rootIdxType;
      const data: any = snapshots[currentSnapshot].techRoot[selection];
      const subCategoryOptions: optionWithTallyType[] = [];
      for (const i of data) {
        subCategoryOptions.push({ identifier: i });
      }
      set((state) => ({ selectableSubCategories: subCategoryOptions }));
    }
  },
  updateTechnologiesOptions(selectedSubCategories: string[]) {
    const techCache = get().currentTechCache;
    const seenIdx: Dictionary<string> = {};
    const newTechOptions: string[] = [];

    selectedSubCategories.forEach((element) => {
      for (let i = 0; i < techCache[element].length; i++) {
        const currIteration = techCache[element][i];
        if (seenIdx[currIteration] === undefined) seenIdx[currIteration] = currIteration;
      }
    });

    for (const item in seenIdx) {
      newTechOptions.push(item);
    }
    set(() => ({ selectableTechnologies: newTechOptions }));
  },
  currentTechCache: {},
  selectableTechnologiesAsString: [],
}));
