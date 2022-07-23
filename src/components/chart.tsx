import { Line} from "@ant-design/charts";
import React from "react";
import { stateStore } from '../utility/state';

const Chart: React.FC = () => {
  const chartData = stateStore().chartData;
  return <Line {...chartData} />
};
export default Chart;
