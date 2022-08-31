import { Line } from '@ant-design/charts'
import React from 'react'
import { stateStore } from '../store/state'

const Chart: React.FC = () => {
  const chartData = stateStore((state) => state.chartData)
  return <Line {...chartData} />
}
export default Chart
