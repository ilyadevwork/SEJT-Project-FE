import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useDashContext } from "./store";
import { useRef } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const LineChart = () => {
  const [dashState] = useDashContext();
  const chartRef = useRef<ChartJS>(null);
  const someChart = chartRef.current;

  return (
    <Chart
      ref={chartRef}
      type="line"
      options={dashState.options}
      data={dashState.chartdata}
      redraw={true}
    />
  );
};

export default LineChart;
