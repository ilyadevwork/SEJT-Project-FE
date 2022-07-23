import { Select, Space } from "antd";
import React, { useState } from "react";

import snapshots from "../data/jobs.json";
import { stateStore, rootIdxType } from "../utility/state";

const { Option } = Select;

const Selection: React.FC = () => {
  const {
    isAggregate,
    setCatagory,
    setSelectedSubCatagories,
    currentSnapshot,
  } = stateStore();

  const catagoryType: React.ReactNode[] = [];
  const history: string[] = [];
  const [subCatagories, setsubCatagories] = useState(catagoryType);
  const [subHistory, setHistory] = useState(history);

  function populateSubCatagory(str: string) {
    const selection = str as keyof rootIdxType;
    const data: any = snapshots[currentSnapshot].techRoot[selection];
    const children: React.ReactNode[] = [];
    for (const i of data) {
      children.push(<Option key={i.identifier}>{i.identifier}</Option>);
      setsubCatagories(children);
    }
  }

  return (
    <Space direction="horizontal" size={12}>
      {!isAggregate ? (
        <div>
          <Select
            placeholder="Select a Catagory"
            style={{ width: 175 }}
            bordered={false}
            onChange={(ev: string) => {
              setCatagory(ev);
              setHistory([]);
              populateSubCatagory(ev);
            }}
          >
            <Option value="skills">Listings</Option>
            <Option value="salaryEst">Salary Estimates</Option>
            <Option value="remote">Remote</Option>
            <Option value="jobType">Employment Type</Option>
            <Option value="expLevel">Experiance Level</Option>
            <Option value="eduLevel">Education Level</Option>
            <Option value="location">Location</Option>
            <Option value="company">Company Openings</Option>
          </Select>
          <div>
            <Select
              mode="multiple"
              value={subHistory}
              allowClear
              bordered={false}
              style={{ width: "75%" }}
              placeholder="Select Sub Catagory"
              onChange={(selection) => {
                setSelectedSubCatagories(selection);
                setHistory(selection);
              }}
            >
              {subCatagories}
            </Select>
          </div>
        </div>
      ) : (
        <Select
          placeholder="Select a Catagory"
          style={{ width: 175 }}
          bordered={false}
          onChange={(ev: string) => setCatagory(ev)}
        >
          <Option value="skills">Listings</Option>
          <Option value="salaryEst">Salary Estimates</Option>
          <Option value="remote">Remote</Option>
          <Option value="jobType">Employment Type</Option>
          <Option value="expLevel">Experiance Level</Option>
          <Option value="eduLevel">Education Level</Option>
          <Option value="location">Location</Option>
          <Option value="company">Company Openings</Option>
        </Select>
      )}
    </Space>
  );
};
export default Selection;
