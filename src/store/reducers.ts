import moment from 'moment';
import { toggleAction, toggleActionType, dataAction, dataActionType } from '../types/actionTypes';
import snapshots from '../data/jobs.json';
import { rootIdxType, branchIdxType, tableDataType, justObjects, configState } from '../types/utilityTypes';
import { isSameDay, routeCalculator, buildTechIndex } from '../util/util';

export const toggleActionReducer = (state: configState, action: toggleAction) => {
  switch (action.type) {
    case toggleActionType.TOGGLE_SERIES: {
      return {
        isSeries: action.payload,
        routeID: routeCalculator(state.isAggregate, state.isAllTechChecked, action.payload),
      };
    }
    case toggleActionType.TOGGLE_AGGREGATION: {
      return {
        isAggregate: action.payload,
        routeID: routeCalculator(action.payload, state.isAllTechChecked, state.isSeries),
      };
    }
    case toggleActionType.TOGGLE_ALLTECHNOLOGIES: {
      return {
        isAllTechChecked: action.payload,
        routeID: routeCalculator(state.isAggregate, action.payload, state.isSeries),
      };
    }
    default:
      return state;
  }
};

export const dataActionReducer = (state: configState, routeID: number, action: dataAction): object => {
  const category = state.category as keyof rootIdxType;
  const branchCategory = state.category as branchIdxType;


  switch (routeID) {
    case 0: {
      // Series 0 Aggregate 0 All Tech 0
      // Series False, Aggregate False, All Tech False
      // Loading 1 Day only, We're not loading from Root, and We're only loading
      // those technologies the user has selected.

      // prior to loading -> action will tell us from where the update is coming.

      switch (action.type) {
        case dataActionType.SET_CATEGORY: {
          // This route only updates data on sub category change.
          // Clearing Sub Categories.

          state.updateSubCategoryOptions(action.payload);
          return { category: action.payload, selectedSubCategories: [] };
        }
        case dataActionType.SET_DATE: {
          // This route needs total update with all var. subcategories & tech.
          // We don't have to check that the date is differant, we know the date passed is new.
          let tempSnapshot = 0;
          const formattedEntry = action.payload[0].format('YYYY-MM-DD');

          // Searching for a match in the selected date, and those that exist in the data set.
          for (let i = 0; i < snapshots.length; i += 1) {
            if (formattedEntry === moment(snapshots[i].date).format('YYYY-MM-DD')) tempSnapshot = i;
          }

          // Checking if the required data is selected, if its not ready just change date.
          if (state.selectedSubCategories.length === 0 || state.selectedTechnologies.length === 0) {
            state.updateSubCategoryOptions();
            return { currentSnapshot: tempSnapshot };
          }

          // Entry here means user selected sub cate and selected tech.

          const tempChartData: object[] = [];
          const temptableData: tableDataType[] = [];
          let keyPool = 0;

          for (let i = 0; i < state.selectedTechnologies.length; i += 1) {
            for (let j = 0; j < state.selectedSubCategories.length; j += 1) {
              const data = snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]][
                branchCategory
              ] as justObjects;

              for (let k = 0; k < data.length; k += 1) {
                if (data[k].identifier === state.selectedSubCategories[j]) {
                  tempChartData.push({
                    identifier: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                    value: data[k].value,
                    category: data[k].identifier,
                  });
                  temptableData.push({
                    identifier: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                    key: (keyPool += 1),
                    category: data[k].identifier,
                    marketshare: 0,
                    value: data[k].value,
                  });
                  break;
                }
              }
            }
          }
          return {
            chartData: {
              ...state.chartData,
              data: tempChartData,
              seriesField: 'category',
            },
            tableData: temptableData,
            currentSnapshot: tempSnapshot,
          };
        }
        case dataActionType.SET_SUBCATEGORIES: {
          // This route assumes user has selected a category, so we just need to check if technologies is selected,
          // if not then we just update sub categories.
          if (state.selectedTechnologies.length === 0) {
            state.updateTechnologiesOptions(action.payload);
            return { selectedSubCategories: action.payload };
          }

          if (action.payload > state.selectedSubCategories) {
            const tempChartData: object[] = [...state.chartData.data];
            const tempTableData: tableDataType[] = [...state.tableData];

            for (let i = 0; i < state.selectedTechnologies.length; i += 1) {
              const data = snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]][
                branchCategory
              ] as justObjects;
              let keyPool = 0;

              for (let k = 0; k < data.length; k += 1) {
                if (data[k].identifier === action.payload[action.payload.length - 1]) {
                  // Here we know that the entry has been pushed onto the end of the array, so we just look at the end.
                  tempChartData.push({
                    identifier: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                    value: data[k].value,
                    category: data[k].identifier,
                  });
                  tempTableData.push({
                    identifier: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                    key: (keyPool += 1),
                    category: data[k].identifier,
                    marketshare: 0,
                    value: data[k].value,
                  });
                  break;
                }
              }
            }
            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              tableData: tempTableData,
              selectedSubCategories: action.payload,
            };
          }
          if (action.payload.length !== 0) {
            // Check if all data has been popped.
            const exclusion = state.selectedSubCategories.filter((item) => !action.payload.includes(item));

            const tempChartData: object[] = [];
            const tempTableData: tableDataType[] = [];

            for (let i = 0; i < state.chartData.data.length; i += 1) {
              if (state.chartData.data[i].identifier !== exclusion[0]) {
                tempChartData.push(state.chartData.data[i]);
                tempTableData.push(state.tableData[i]);
              }
            }

            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              tableData: tempTableData,
              selectedSubCategories: action.payload,
            };
          }
          // Return empty sets if all subcategories have been popped.
          return {
            chartData: {
              ...state.chartData,
              data: [],
              seriesField: '',
            },
            tableData: [],
            selectedSubCategories: [],
          };
        }
        case dataActionType.SET_TECHNOLOGIES: {
          // Here we are only updating the selected technologies.
          // Date, sub category, category are all already chosen.
          if (action.payload > state.selectedTechnologies) {
            const tempChartData: object[] = [...state.chartData.data];
            const tempTableData: tableDataType[] = [...state.tableData];

            const data = snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]][
              branchCategory
            ] as justObjects;

            for (let j = 0; j < state.selectedSubCategories.length; j += 1) {
              for (let k = 0; k < data.length; k += 1) {
                if (data[k].identifier === state.selectedSubCategories[j]) {
                  tempChartData.push({
                    identifier:
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                    value: data[k].value,
                    category: data[k].identifier,
                  });
                  tempTableData.push({
                    identifier:
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                    key:
                      data[k].identifier +
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                    category: data[k].identifier,
                    marketshare: 0,
                    value: data[k].value,
                  });
                  break;
                }
              }
            }

            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              tableData: tempTableData,
              selectedTechnologies: action.payload,
            };
          }

          if (action.payload.length !== 0) {
            const tempChartData: object[] = [];
            const tempTableData: tableDataType[] = [];

           const exclusion = state.selectedTechnologies.filter(newTech => {
           if (!action.payload.includes(newTech)) {
                return snapshots[state.currentSnapshot].techBranch[newTech].name
           } 
            });

            for (let i = 0; i < state.chartData.data.length; i += 1)
              if (state.chartData.data[i].name !== exclusion[0]) {
                tempChartData.push(state.chartData.data[i]);
                tempTableData.push(state.tableData[i]);
              }

            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              tableData: tempTableData,
              selectedTechnologies: action.payload,
            };
          } else {
            return {
              chartData: {
                ...state.chartData,
                data: [],
                seriesField: '',
              },
              tableData: [],
              selectedTechnologies: [],
            };
          }
        }
        default: {
          throw new Error('dataActionReducer: action.type default case reached');
        }
      }
      break;
    }
    case 1: {
      // Series 0 Aggregate 0 All Tech 1
      switch (action.type) {
        case dataActionType.SET_CATEGORY: {
          // This route only updates data on sub category change.
          // Clearing Sub Categories.

          state.updateSubCategoryOptions(action.payload);
          return { category: action.payload, selectedSubCategories: [] };
        }
        case dataActionType.SET_DATE: {
          let newSnapshot = 0;
          const totalSnapshots = snapshots.length;

          for (let index = 0; index < totalSnapshots; index += 1)
            if (isSameDay(action.payload[0], snapshots[index].date)) {
              newSnapshot = index;
            }

          if (state.selectedSubCategories.length === 0) {
            if (state.category !== '') {
              state.updateSubCategoryOptions();
              return { currentSnapshot: newSnapshot };
            } else {
              return { currentSnapshot: newSnapshot };
            }
          } else {
            const technologies = state.selectableTechnologies;
            const tempChartData: object[] = [];
            const technologyIndex = buildTechIndex(newSnapshot);
            //  const temptableData: tableDataType[] = []
            //  let keyPool = 0

            state.selectedSubCategories.forEach((subCategory) => {
              technologies.forEach((technology) => {
                const data = snapshots[newSnapshot].techBranch[technologyIndex[technology]][
                  branchCategory
                ] as justObjects;
                const dataLength = data.length;
                for (let i = 0; i < dataLength; i += 1) {
                  if (data[i].identifier === subCategory) {
                    console.log(data[i].identifier);
                    tempChartData.push({
                      identifier: snapshots[newSnapshot].techBranch[technologyIndex[technology]].name,
                      value: data[i].value,
                      category: data[i].identifier,
                    });
                    break;
                  }
                }
              });
            });
            /*   temptableData.push({
                      identifier: data[k].identifier,
                      key: keyPool += 1,
                      category:
                        snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]]
                          .name,
                      marketshare: 0,
                      value: data[k].value,
                    })*/

            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              // tableData: temptableData,
              currentSnapshot: newSnapshot,
            };
            break;
          }
        }
        case dataActionType.SET_SUBCATEGORIES: {
          // This route assumes user has selected a category, so we just need to check if technologies is selected,
          // if not then we just update sub categories.
          if (state.selectedTechnologies.length === 0) {
            state.updateTechnologiesOptions(action.payload);
            return { selectedSubCategories: action.payload };
          } else {
            if (action.payload > state.selectedSubCategories) {
              const tempChartData: object[] = [...state.chartData.data];
              const tempTableData: tableDataType[] = [...state.tableData];

              for (let i = 0; i < state.selectedTechnologies.length; i += 1) {
                const data = snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]][
                  branchCategory
                ] as justObjects;
                let keyPool = 0;

                for (let k = 0; k < data.length; k += 1)
                  if (data[k].identifier === action.payload[action.payload.length - 1]) {
                    // Here we know that the entry has been pushed onto the end of the array, so we just look at the end.
                    tempChartData.push({
                      identifier: data[k].identifier,
                      value: data[k].value,
                      category: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                    });
                    tempTableData.push({
                      identifier: data[k].identifier,
                      key: (keyPool += 1),
                      category: snapshots[state.currentSnapshot].techBranch[state.selectedTechnologies[i]].name,
                      marketshare: 0,
                      value: data[k].value,
                    });
                    break;
                  }
              }
              return {
                chartData: {
                  ...state.chartData,
                  data: tempChartData,
                  seriesField: 'category',
                },
                tableData: tempTableData,
                selectedSubCategories: action.payload,
              };
            } else {
              if (action.payload.length !== 0) {
                // Check if all data has been popped.
                const exclusion = state.selectedSubCategories.filter((ele) => {
                  if (!action.payload.includes(ele)) return ele;
                });

                const tempChartData: object[] = [];
                const tempTableData: tableDataType[] = [];

                for (let i = 0; i < state.chartData.data.length; i += 1)
                  if (state.chartData.data[i].identifier !== exclusion[0]) {
                    tempChartData.push(state.chartData.data[i]);
                    tempTableData.push(state.tableData[i]);
                  }

                return {
                  chartData: {
                    ...state.chartData,
                    data: tempChartData,
                    seriesField: 'category',
                  },
                  tableData: tempTableData,
                  selectedSubCategories: action.payload,
                };
              } else {
                // Return empty sets if all subcategories have been popped.
                return {
                  chartData: {
                    ...state.chartData,
                    data: [],
                    seriesField: '',
                  },
                  tableData: [],
                  selectedSubCategories: [],
                };
              }
            }
          }
        }
        case dataActionType.SET_TECHNOLOGIES: {
          // Here we are only updating the selected technologies.
          // Date, sub category, category are all already chosen.
          if (action.payload > state.selectedTechnologies) {
            console.log(state.selectedTechnologies);
            const tempChartData: object[] = [...state.chartData.data];
            const tempTableData: tableDataType[] = [...state.tableData];

            const data = snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]][
              branchCategory
            ] as justObjects;

            for (let j = 0; j < state.selectedSubCategories.length; j += 1) {
              for (let k = 0; k < data.length; k += 1) {
                if (data[k].identifier === state.selectedSubCategories[j]) {
                  tempChartData.push({
                    identifier: data[k].identifier,
                    value: data[k].value,
                    category:
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                  });
                  tempTableData.push({
                    identifier: data[k].identifier,
                    key:
                      data[k].identifier +
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                    category:
                      snapshots[state.currentSnapshot].techBranch[action.payload[action.payload.length - 1]].name,
                    marketshare: 0,
                    value: data[k].value,
                  });
                  break;
                }
              }
            }

            return {
              chartData: {
                ...state.chartData,
                data: tempChartData,
                seriesField: 'category',
              },
              tableData: tempTableData,
              selectedTechnologies: action.payload,
            };
          } else {
            if (action.payload.length !== 0) {
              const tempChartData: object[] = [];
              const tempTableData: tableDataType[] = [];
              const keyPool = 0;

              const exclusion = state.selectedTechnologies.filter((ele) => {
                if (!action.payload.includes(ele)) return snapshots[state.currentSnapshot].techBranch[ele].name;
              });

              for (let i = 0; i < state.chartData.data.length; i += 1)
                if (state.chartData.data[i].name !== exclusion[0]) {
                  tempChartData.push(state.chartData.data[i]);
                  tempTableData.push(state.tableData[i]);
                }

              return {
                chartData: {
                  ...state.chartData,
                  data: tempChartData,
                  seriesField: 'category',
                },
                tableData: tempTableData,
                selectedTechnologies: action.payload,
              };
            } else {
              return {
                chartData: {
                  ...state.chartData,
                  data: [],
                  seriesField: '',
                },
                tableData: [],
                selectedTechnologies: [],
              };
            }
          }
        }
      }
      break;
    }
    case 2: {
      // Series 0 Aggregate 1 All Tech 1 DONE
      switch (action.type) {
        case dataActionType.SET_CATEGORY: {
          const newCategory = action.payload as keyof rootIdxType;

          // let marketShareTotal = 0
          // const temptableData: tableDataType[] = []

          // for (const obj of state.chartData.data) marketShareTotal = marketShareTotal + obj.value

          /* for (const [idx, entry] of state.chartData.data.entries()) {
            temptableData.push({
              key: idx,
              ...entry,
              marketshare: ((entry.value / marketShareTotal) * 100).toFixed(2),
            })
          }
          */

          return {
            chartData: {
              ...state.chartData,
              data: snapshots[state.currentSnapshot].techRoot[newCategory],
              seriesField: '',
            },
            category: newCategory,
          };
        }

        case dataActionType.SET_DATE: {
          const totalSnapshots = snapshots.length;

          for (let index = 0; index < totalSnapshots; index += 1)
            if (isSameDay(action.payload[0], snapshots[index].date)) {
              if (state.category === '')
                return {
                  currentSnapshot: index,
                };
              else
                return {
                  chartData: {
                    ...state.chartData,
                    data: snapshots[index].techRoot[category],
                  },
                  currentSnapshot: index,
                };
            }
        }
      }
      break;
    }
    case 3: {
      // Series 1 Aggregate 0 All Tech 0
      break;
    }
    default:
      return state;
  }

  return {};
};
