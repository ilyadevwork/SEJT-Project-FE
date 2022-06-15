import { Select } from "antd";
import React from "react";
import { stateStore, catagoryUpdate, tableUpdate } from "../utility/store";
import { useDashContext } from "./configurator";

const { Option } = Select;

const Selection: React.FC = () => {
  const selected = stateStore();
  const [dashState, setDashState] = useDashContext();

  return (
    <Select
      placeholder="Catagories"
      defaultValue={"Technologies"}
      style={{ width: 175 }}
      bordered={false}
      onChange={(ev: string) => { selected.setCatagory(ev);
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
  );
};
export default Selection;
