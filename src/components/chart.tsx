import React, {useState} from "react";
import { Line } from "@ant-design/charts";
import { useDashContext } from "./configurator";

const Chart: React.FC = () => {
  const [dashState] = useDashContext();
  const [hasData, setHasData] = useState(true);

  return <Line {...dashState.chart} />;
};
export default Chart;
