import { Select, Space, Switch } from "antd";
import React, { useState } from "react";
import { stateStore, buildTechIndex } from "../store/state";
import { Dictionary } from "../types/utilityTypes";
import { dataActionType, toggleActionType } from "../types/actionTypes";

const { Option } = Select;

const Selection: React.FC = () => {
  const isSeries = stateStore((state) => state.isSeries);
  const isAggregate = stateStore((state) => state.isAggregate);
  const isAllTechChecked = stateStore((state) => state.isAllTechChecked);
  const [agg, SetAgg] = useState<boolean>(true);
  const [tech, SetTech] = useState<boolean>(true);

  const dataActionDispatch = stateStore((state) => state.updateChartDispatch);
  const toggleActionDispatch = stateStore((state) => state.toggleDispatch);

  const currentSnapshot = stateStore((state) => state.currentSnapshot);

  const availableSubCategories = stateStore(
    (state) => state.availableSubCategories
  );
  const availableTechnologies = stateStore(
    (state) => state.availableTechnologies
  );

  const [categoryHistory, setCategoryHistory] = useState<any>(null);
  const [subHistory, setHistory] = useState<string[]>([]);
  const [techHistory, setTechHistory] = useState<string[]>([]);

  const techIdx: Dictionary<number> = buildTechIndex(currentSnapshot);

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
              setHistory([]);
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
            mode={"multiple"}
            value={subHistory}
            bordered={false}
            style={{ minWidth: 150 }}
            placeholder="Select Sub Catagory"
            onChange={(value) => {
              dataActionDispatch({
                type: dataActionType.SET_SUBCATEGORIES,
                payload: value,
              });
              setHistory(value);
            }}
          >
            {availableSubCategories}
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
              setHistory([]);
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
                  setHistory([]);
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
                mode={"multiple"}
                value={subHistory}
                bordered={false}
                style={{ minWidth: 150 }}
                placeholder="Sub Catagory"
                onChange={(value) => {
                  dataActionDispatch({
                    type: dataActionType.SET_SUBCATEGORIES,
                    payload: value,
                  });
                  setHistory(value);
                }}
              >
                {availableSubCategories}
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
                    mode={"multiple"}
                    bordered={false}
                    style={{ minWidth: 150 }}
                    placeholder="Select Technologies"
                    onChange={(selection) => {
                      let tempResult = [];

                      if (selection !== []) {
                        for (let i = 0; i < selection.length; i++) {
                          tempResult.push(techIdx[selection[i]]);
                        }
                      }

                      dataActionDispatch({
                        type: dataActionType.SET_TECHNOLOGIES,
                        payload: tempResult,
                      });
                    }}
                  >
                    {availableTechnologies}
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
