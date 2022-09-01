import { Line, Column } from '@ant-design/charts'
import React from 'react'
import { stateStore } from '../store/state'

const Chart: React.FC = () => {
  const chartData = stateStore((state) => state.chartData)
  const category = stateStore((state) => state.category)
  const aggregate = stateStore((state) => state.isAggregate)

  return (category !== 'salaryEst' && aggregate == true) ? <Line {...chartData} /> : <Column {...chartData} />
}
export default Chart
