import { Select, Space, Switch } from 'antd';
import React, { useState } from 'react';
import { stateStore, buildTechIndex } from '../store/state';
import { Dictionary } from '../types/utilityTypes';
import { dataActionType, toggleActionType } from '../types/actionTypes';

const { Option } = Select;

const Selection: React.FC = () => {
  const {
    isSeries,
    isAggregate,
    isAllTechChecked,
    toggleActionDispatch,
    currentSnapshot,
    selectableSubCategories,
    selectableTechnologies,
    selectedTechnologies,
    dataActionDispatch,
  } = stateStore((state) => ({
    isSeries: state.isSeries,
    isAggregate: state.isAggregate,
    isAllTechChecked: state.isAllTechChecked,
    toggleActionDispatch: state.toggleDispatch,
    dataActionDispatch: state.dataDispatch,
    currentSnapshot: state.currentSnapshot,
    selectableSubCategories: state.selectableSubCategories,
    selectableTechnologies: state.selectableTechnologies,
    selectedTechnologies: state.selectedTechnologies,
  }));

  const [agg, SetAgg] = useState<boolean>(true);
  const [tech, SetTech] = useState<boolean>(true);
  const [categoryHistory, setCategoryHistory] = useState<string | null>(null);
  const [subCategoryHistory, setSubCategoryHistory] = useState<string[]>([]);
  const [techHistory, setTechHistory] = useState<string[]>([]);

  const techIdx: Dictionary<number> = buildTechIndex(currentSnapshot);
  const subCategoryFiltered = selectableSubCategories.filter(
    (option) => !subCategoryHistory.includes(option.identifier),
  );
  const technologiesFiltered = selectableTechnologies.filter((option) => !techHistory.includes(option));

  const isSubCategoryMax = subCategoryHistory.length ? true : false;
  const isTechMax = selectedTechnologies.length > 4 ? true : false;

  return (
    <Space>
      {isSeries ? (
        <>
          <Select // Series On
            placeholder="Select a Catagory"
            style={{ minWidth: 150 }}
            bordered={false}
            onChange={(value: string) => {
              dataActionDispatch({
                type: dataActionType.SET_CATEGORY,
                payload: value,
              });
              setSubCategoryHistory([]);
              setCategoryHistory(value);
            }}
          >
            <Option value="skills">Technologies</Option>
            <Option value="salaryEst">Salary Estimates</Option>
            <Option value="remote">Remote</Option>
            <Option value="jobType">Employment Type</Option>
            <Option value="expLevel">Experiance Level</Option>
            <Option value="eduLevel">Education Level</Option>
            <Option value="location">Location</Option>
            <Option value="company">Company Openings</Option>
          </Select>
          <Select
            mode={'multiple'}
            value={subCategoryHistory}
            bordered={false}
            style={{ minWidth: 250 }}
            placeholder="Select Sub Catagory"
            onChange={(value) => {
              dataActionDispatch({
                type: dataActionType.SET_SUBCATEGORIES,
                payload: value,
              });
              setSubCategoryHistory(value);
            }}
          >
            {subCategoryFiltered.map((item) => (
              <Option key={item.identifier} value={item.identifier} disabled={isSubCategoryMax}>
                {item.identifier}
              </Option>
            ))}
          </Select>
        </>
      ) : (
        <>
          <Switch // Series off / Agg True
            checkedChildren="Aggregate"
            checked={agg}
            unCheckedChildren="Aggregate"
            onChange={(value: boolean) => {
              SetAgg(value);
              toggleActionDispatch({
                type: toggleActionType.TOGGLE_AGGREGATION,
                payload: value,
              });
              setSubCategoryHistory([]);
              setCategoryHistory(null);
            }}
          ></Switch>
          {!isAggregate ? (
            <>
              <Select
                placeholder="Search by"
                value={categoryHistory}
                style={{ minWidth: 150 }}
                bordered={false}
                onChange={(value: string) => {
                  dataActionDispatch({
                    type: dataActionType.SET_CATEGORY,
                    payload: value,
                  });
                  setCategoryHistory(value);
                  setSubCategoryHistory([]);
                }}
              >
                <Option value="salaryEst">Salary Estimates</Option>
                <Option value="remote">Remote</Option>
                <Option value="jobType">Employment Type</Option>
                <Option value="expLevel">Experiance Level</Option>
                <Option value="eduLevel">Education Level</Option>
                <Option value="location">Location</Option>
                <Option value="company">Company Openings</Option>
              </Select>
              <Select
                mode={'multiple'}
                value={subCategoryHistory}
                bordered={false}
                style={{ minWidth: 250 }}
                placeholder="Select Sub Catagory"
                onChange={(value) => {
                  dataActionDispatch({
                    type: dataActionType.SET_SUBCATEGORIES,
                    payload: value,
                  });
                  setSubCategoryHistory(value);
                }}
              >
                {subCategoryFiltered.map((item) => (
                  <Option key={item.identifier} value={item.identifier} disabled={isSubCategoryMax}>
                    {item.identifier + ' (' + item.occurences + ')'}
                  </Option>
                ))}
              </Select>
              <Switch
                defaultChecked={true}
                checkedChildren="All Technologies"
                checked={tech}
                unCheckedChildren="Select Technologies"
                onChange={(value: boolean) => {
                  SetTech(value);
                  toggleActionDispatch({
                    type: toggleActionType.TOGGLE_ALLTECHNOLOGIES,
                    payload: value,
                  });
                }}
              ></Switch>
              {!isAllTechChecked ? (
                <>
                  <Select
                    mode={'multiple'}
                    bordered={false}
                    style={{ minWidth: 150 }}
                    placeholder="Select Technologies"
                    onChange={(selection: string[]) => {
                      if (selection.length !== 0) {
                        const result: number[] = selection.map((item: string) => techIdx[item]);

                        dataActionDispatch({
                          type: dataActionType.SET_TECHNOLOGIES,
                          payload: result,
                        });

                        setTechHistory(selection);
                      }
                    }}
                  >
                    {technologiesFiltered.map((item) => (
                      <Option key={item} value={item} disabled={isTechMax}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <Select //  Default
                placeholder="Select a Catagory"
                style={{ minWidth: 150 }}
                bordered={false}
                onChange={(value: string) => {
                  dataActionDispatch({
                    type: dataActionType.SET_CATEGORY,
                    payload: value,
                  });
                }}
              >
                <Option value="skills">Technologies</Option>
                <Option value="salaryEst">Salary Estimates</Option>
                <Option value="remote">Remote</Option>
                <Option value="jobType">Employment Type</Option>
                <Option value="expLevel">Experiance Level</Option>
                <Option value="eduLevel">Education Level</Option>
                <Option value="location">Location</Option>
                <Option value="company">Company Openings</Option>
              </Select>
            </>
          )}
        </>
      )}
    </Space>
  );
};
export default Selection;
