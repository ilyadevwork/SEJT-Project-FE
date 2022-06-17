import { Select, Space } from "antd";
import React from "react";
import { stateStore } from "../utility/state";
import {catagoryUpdate, tableUpdate} from "../utility/store"
import { useDashContext } from "./configurator";
import snapshots from "../data/jobsNew.json";

const { Option } = Select;

const Selection: React.FC = () => {
  const selected = stateStore();
  const [dashState, setDashState] = useDashContext();

  const children: React.ReactNode[] = [];
  snapshots[0].techBranch.forEach((ele, idx) => {
    children.push(
      <Option key={ele.name}>
        {ele.name}
      </Option>
    );
  });

  const handleChange = (value: string[]) => {
    selected.updateSelectedTech(value);
    console.log(value);
  };

  return (
    <Space direction="horizontal" size={12}>
      {!selected.isAggregate ? (
        <div>
          <Select
            placeholder="Catagories"
            style={{ width: 175 }}
            bordered={false}
            defaultValue={"Technologies"}
            onChange={(ev: string) => {
              selected.setCatagory(ev);
              setDashState(catagoryUpdate(dashState, true, ev)!);
              setDashState(tableUpdate(dashState, true)!);
            }}
          >
            <Option value="Technologies">Listings</Option>
            <Option value="Salary Estimates">Salary Estimates</Option>
            <Option value="Remote">Remote</Option>
            <Option value="Employment Type">Employment Type</Option>
            <Option value="Experiance Level">Experiance Level</Option>
            <Option value="Education Level">Education Level</Option>
            <Option value="Location">Location</Option>
            <Option value="Company Openings">Company Openings</Option>
          </Select>
          <Select
            mode="multiple"
            allowClear
            bordered={false}
            style={{ width: "75%" }}
            placeholder="Select Technologies"
            onChange={handleChange}
          >
            {children}
          </Select>
        </div>
      ) : (
        <Select
          placeholder="Catagories"
          defaultValue={"Technologies"}
          style={{ width: 175 }}
          bordered={false}
          onChange={(ev: string) => {
            selected.setCatagory(ev);
            setDashState(catagoryUpdate(dashState, true, ev)!);
            setDashState(tableUpdate(dashState, true)!);
          }}
        >
          <Option value="Technologies">Technologies</Option>
          <Option value="Salary Estimates">Salary Estimates</Option>
          <Option value="Remote">Remote</Option>
          <Option value="Employment Type">Employment Type</Option>
          <Option value="Experiance Level">Experiance Level</Option>
          <Option value="Education Level">Education Level</Option>
          <Option value="Location">Location</Option>
          <Option value="Company Openings">Company Openings</Option>
        </Select>
      )}
    </Space>
  );
};
export default Selection;
