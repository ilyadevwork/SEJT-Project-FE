import React from "react";
import { Line } from "@ant-design/charts";
import { useDashContext } from "./configurator";

const Chart: React.FC = () => {
  const [dashState] = useDashContext();

  return <Line {...dashState.chart} />;
};
export default Chart;
