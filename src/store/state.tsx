import create from 'zustand'
import moment from 'moment'
import snapshots from '../data/jobs.json'
import { toggleAction, dataAction, toggleActionType } from '../types/actionTypes'
import { toggleActionReducer, dataActionReducer } from './reducers'
import type { RangePickerProps } from 'antd/es/date-picker'
import { Select } from 'antd'
import {
  tableDataType,
  rootIdxType,
  branchIdxType,
  justObjects,
  Dictionary,
} from '../types/utilityTypes'

const { Option } = Select

interface chartConfig {
  data: any
  xField: string
  yField: string
  seriesField: string
  smooth: boolean
  slider: any
  theme: string
  category?: string
  label: {
    style: {
      fill: string
    }
  }
  point: any
  isGroup: any
}

interface optionWithTallyType {
  identifier: string
  occurences?: number
}

export interface configState {
  chartData: chartConfig
  tableData: tableDataType[]
  category: string
  selectedSubCategories: string[]
  selectedTechnologies: number[]
  selectedDate: [moment.Moment, moment.Moment]
  currentSnapshot: number
  currentSnapshotSeries: number[]
  isSeries: boolean
  isAggregate: boolean
  isAllTechChecked: boolean
  routeID: number
  selectableSubCategories: optionWithTallyType[]
  selectableTechnologies: string[]
  currentTechCache: Dictionary<Array<string>>
  setSelectedSubCategories: (entry: string[]) => void
  setDate: (entry: [moment.Moment, moment.Moment]) => void
  setCurrentSnapshot: (entry: number) => void
  setCurrentSeries: (entry: number[]) => void
  toggleDispatch: (action: toggleAction) => void
  dataDispatch: (action: dataAction) => void
  updateSubCategoryOptions: (arg?: string) => void
  updateTechnologiesOptions: (arg: string[]) => void
}

export const stateStore = create<configState>((set, get) => ({
  routeID: 2,
  category: '',
  isSeries: false,
  selectedSubCategories: [],
  setSelectedSubCategories: (entry) => {
    const tempSubCatagories = get().selectedSubCategories

    if (entry.length > tempSubCatagories.length) {
      set((state) => ({ selectedSubCategories: entry }))
      const tempSubCatagories = get().selectedSubCategories
      const currentSeries = get().currentSnapshotSeries
      const category = get().category as keyof rootIdxType

      let marketShareTotal = 0
      let keyPool = 0
      let temptableData: tableDataType[] = []
      let tempChartData: object[] = []
      // We can just search the aggregate data when it comes to listings.
      for (let i = 0; i < currentSeries.length; i++) {
        // iterate through all the selected days in between start and finish by thier index in our data.
        for (let j = 0; j < tempSubCatagories.length; j++) {
          // iterate through every selected category
          const data: any = snapshots[currentSeries[i]].techRoot[category]
          // search that day's data for the category and retrieve its value
          data.find((val: any) => {
            // push data to temp array. x axis will be date.
            if (val.identifier === tempSubCatagories[j]) {
              tempChartData.push({
                identifier: snapshots[currentSeries[i]].date.slice(0, 10),
                value: val.value,
                category: val.identifier,
              })
              temptableData.push({
                identifier: snapshots[currentSeries[i]].date.slice(0, 10),
                key: keyPool++,
                category: val.identifier,
                marketshare: 0,
                value: val.value,
              })
            }
          })
        }
      }
      set((state) => ({
        chartData: {
          ...state.chartData,
          data: tempChartData,
          seriesField: 'category',
        },
        tableData: temptableData,
      }))
    } else {
      const currSubCatagories = get().selectedSubCategories

      const exclusion = currSubCatagories.filter((ele) => {
        if (!entry.includes(ele)) return ele
      })

      set((state) => ({ selectedSubCategories: entry }))

      // Copy current data set.
      const dataPtr = get().chartData.data
      let filteredData: any = [{}]

      // Conditionally exclude the removed element.
      for (let i = 0; i < dataPtr.length; i++) {
        if (dataPtr[i].category !== exclusion[0]) filteredData.push(dataPtr[i])
      }

      // Clear category after dataset is empty so that chart artifacts are removed.
      if (dataPtr.length !== 0)
        set((state) => ({
          chartData: {
            ...state.chartData,
            data: filteredData,
            seriesField: 'category',
          },
        }))
      else {
        set((state) => ({
          chartData: {
            ...state.chartData,
            data: [{}],
            seriesField: '',
          },
        }))
      }
    }
  },
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
  setDate: (entry) => {
    set((state) => ({ selectedDate: entry }))

    const isSeries = get().isSeries
    const category = get().category as keyof rootIdxType
    const isAggregate = get().isAggregate
    const isAllTechChecked = get().isAllTechChecked
    const selectedSubCategories = get().selectedSubCategories

    if (!isSeries) {
      if (isAggregate) {
        if (category.toString() !== '') {
          // Not series true, aggregate true & category is selected.
          // Formatting the date so it may be compared.
          const formattedEntry = entry[0].format('YYYY-MM-DD')

          for (let i = 0; i < snapshots.length; i++) {
            if (
              // searching for a match in the selected date, and those that exist in the data set.
              formattedEntry === moment(snapshots[i].date).format('YYYY-MM-DD')
            )
              get().setCurrentSnapshot(i)
          }

          const selectedSnap = get().currentSnapshot

          set((state) => ({
            chartData: {
              ...state.chartData,
              data: snapshots[selectedSnap].techRoot[category],
            },
          }))

          let marketShareTotal = 0
          let temptableData: tableDataType[] = []

          for (let obj of get().chartData.data) marketShareTotal = marketShareTotal + obj.value

          for (let [idx, entry] of get().chartData.data.entries()) {
            temptableData.push({
              key: idx,
              ...entry,
              marketShare: ((entry.value / marketShareTotal) * 100).toFixed(2),
            })
          }
          set((state) => ({ tableData: temptableData }))
        } else {
          // If catagories is empty just update the selected snapshot.
          const formattedEntry = entry[0].format('YYYY-MM-DD')

          for (let i = 0; i < snapshots.length; i++) {
            if (formattedEntry === moment(snapshots[i].date).format('YYYY-MM-DD'))
              get().setCurrentSnapshot(i)
          }
        }
      } else {
        // Empty catagory selection check.
        if (category.toString() !== '') {
          // Not series true, aggregate false & category is selected.
          if (selectedSubCategories.length !== 0) set((state) => ({ selectedDate: entry }))

          const formattedEntry = entry[0].format('YYYY-MM-DD')

          for (let i = 0; i < snapshots.length; i++) {
            if (
              // searching for a match in the selected date, and those that exist in the data set.
              formattedEntry === moment(snapshots[i].date).format('YYYY-MM-DD')
            )
              get().setCurrentSnapshot(i)
          }

          const selectedSnap = get().currentSnapshot

          if (isAllTechChecked === true) {
          }
        } else {
          // If catagories is empty just update the selected snapshot.
          const formattedEntry = entry[0].format('YYYY-MM-DD')

          for (let i = 0; i < snapshots.length; i++) {
            if (formattedEntry === moment(snapshots[i].date).format('YYYY-MM-DD'))
              get().setCurrentSnapshot(i)
          }
        }
      }
    } else {
      if (get().selectedSubCategories.length > 1) {
        set((state) => ({ selectedDate: entry }))
        const tempSeries: number[] = []

        for (let i = 0; i < snapshots.length; i++) {
          if (
            moment(snapshots[i].date).format('YYYY-MM-DD') >= entry[0].format('YYYY-MM-DD') &&
            moment(snapshots[i].date).format('YYYY-MM-DD') <= entry[1].format('YYYY-MM-DD')
          ) {
            tempSeries.push(i)
          }
        }
        get().setCurrentSeries(tempSeries)

        const tempCatagories = get().selectedSubCategories

        let tempChartData: object[] = []
        // We can just search the aggregate data when it comes to listings.
        for (let j = 0; j < tempCatagories.length; j++) {
          // iterate through all the selected days in between start and finish by thier index in our data.
          for (let i = 0; i < tempSeries.length; i++) {
            // iterate through every selected category
            const data: any = snapshots[tempSeries[i]].techRoot[category]
            // search that day's data for the category and retrieve its value
            data.find((val: any) => {
              // push data to temp array. x axis will be date.
              if (val.identifier === tempCatagories[j]) {
                tempChartData.push({
                  identifier: snapshots[tempSeries[i]].date.slice(0, 10),
                  value: val.value,
                  category: val.identifier,
                })
              }
            })
          }
        }
        set((state) => ({
          chartData: {
            ...state.chartData,
            data: tempChartData,
            seriesField: 'category',
          },
        }))
      } else {
        set((state) => ({ selectedDate: entry }))
        const tempSeries: number[] = []

        for (let i = 0; i < snapshots.length; i++) {
          if (
            moment(snapshots[i].date).format('YYYY-MM-DD') >= entry[0].format('YYYY-MM-DD') &&
            moment(snapshots[i].date).format('YYYY-MM-DD') <= entry[1].format('YYYY-MM-DD')
          ) {
            tempSeries.push(i)
          }
        }
        get().setCurrentSeries(tempSeries)
      }
    }
  },
  currentSnapshot: 0,
  setCurrentSnapshot: (entry) => set((state) => ({ currentSnapshot: entry })),
  currentSnapshotSeries: [0, 1],
  setCurrentSeries: (entry) => set((state) => ({ currentSnapshotSeries: entry })),
  isAggregate: true,
  isAllTechChecked: true,
  toggleDispatch(action: toggleAction) {
    set((state) => toggleActionReducer(state, action))
  },
  dataDispatch(action: dataAction) {
    set((state) => dataActionReducer(state, get().routeID, action) ?? state)
  },
  selectableSubCategories: [],
  selectableTechnologies: [],
  updateSubCategoryOptions(newCategory?: string) {
    const agg = get().isAggregate
    let category: string

    if (newCategory) category = newCategory
    else category = get().category

    const currentSnapshot = get().currentSnapshot

    if (agg === false) {
      const selection = category as branchIdxType
      let subCategoryOptions: optionWithTallyType[] = []
      const seenIdx: Dictionary<number> = {}
      const techCache: Dictionary<Array<string>> = {}
      const categorycache: string[] = []

      for (let i = 0; i < snapshots[currentSnapshot].techBranch.length; i++) {
        const data: any = snapshots[currentSnapshot].techBranch[i][selection]
        for (const d of data) {
          if (seenIdx[d.identifier] === undefined) {
            techCache[d.identifier] = []
            seenIdx[d.identifier] = 1
            categorycache.push(d.identifier)
            techCache[d.identifier].push(snapshots[currentSnapshot].techBranch[i].name)
          } else {
            seenIdx[d.identifier]++
            techCache[d.identifier].push(snapshots[currentSnapshot].techBranch[i].name)
          }
        }
      }

      if (selection === 'salaryEst') {
        categorycache.sort((a, b) =>
          parseInt(a.substring(1, 4)) > parseInt(b.substring(1, 4)) ? 1 : -1,
        )
      }

      for (const entry of categorycache) {
        subCategoryOptions.push({ identifier: entry, occurences: seenIdx[entry] })
      }

      set((state) => ({
        selectableSubCategories: subCategoryOptions,
        currentTechCache: techCache,
      }))
    } else {
      const selection = category as keyof rootIdxType
      const data: any = snapshots[currentSnapshot].techRoot[selection]
      const subCategoryOptions: optionWithTallyType[] = []
      for (const i of data) {
        subCategoryOptions.push({ identifier: i })
      }
      set((state) => ({ selectableSubCategories: subCategoryOptions }))
    }
  },
  updateTechnologiesOptions(selectedSubCategories: string[]) {
    const techCache = get().currentTechCache
    const seenIdx: Dictionary<string> = {}
    const newTechOptions: string[] = []

    selectedSubCategories.forEach((element) => {
      for (let i = 0; i < techCache[element].length; i++) {
        const currIteration = techCache[element][i]
        if (seenIdx[currIteration] === undefined) seenIdx[currIteration] = currIteration
      }
    })

    for (const item in seenIdx) {
      newTechOptions.push(item)
    }
    set(() => ({ selectableTechnologies: newTechOptions }))
  },
  currentTechCache: {},
  selectableTechnologiesAsString: [],
}))

export const initalDate: RangePickerProps['defaultPickerValue'] = [
  moment(snapshots[0].date),
  moment(snapshots[1].date),
]

export const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  if (current === null) {
    console.log('foo')
  }
  if (
    snapshots.find(
      (obj) => moment(obj.date).format('YYYY-MM-DD') === current.format('YYYY-MM-DD'),
    ) !== undefined
  )
    return false
  else return true
}

export function buildTechIndex(curSnap: any): Dictionary<number> {
  let index: Dictionary<number> = {}
  for (let i = 0; i < snapshots[curSnap].techBranch.length; i++)
    index[snapshots[curSnap].techBranch[i].name] = i

  return index
}
