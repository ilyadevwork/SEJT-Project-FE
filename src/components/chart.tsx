//import { styled } from '@mui/material/styles';
//import Box from '@mui/material/Box';
//import Paper from '@mui/material/Paper';
//import Grid from '@mui/material/Grid';
import { namesExtractor, valuesExtractor, graphutil } from '../util/loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = namesExtractor();

export const data = {
  labels,
  datasets: [
    {
      label: 'Skills',
      data: valuesExtractor(),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export function Chart() {
  return <Bar options={options} data={data} />;
}
