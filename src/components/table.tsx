import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Badge, Button, Dropdown, Input, Menu, Progress, Select, Space, Table } from 'antd'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import type { ColumnsType, ColumnType } from 'antd/lib/table'
import type { FilterConfirmProps } from 'antd/lib/table/interface'
import type { InputRef } from 'antd/lib/index'
import { stateStore } from '../store/state'
const { Option } = Select

interface DataType {
  key: React.Key
  identifier: string
  category?: string
  marketshare: number
  value: number
}

type DataIndex = keyof DataType

interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

const menu = (
  <Menu
    items={[
      { key: '1', label: 'Action 1' },
      { key: '2', label: 'Action 2' },
    ]}
  />
)

const MyTable: React.FC = () => {
  const tableData = stateStore((state) => state.tableData)
  const isSeries = stateStore((state) => state.isSeries)

  const expandedRowRender = () => {
    const columns: ColumnsType<ExpandedDataType> = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Identity', dataIndex: 'identity', key: 'identity' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status='success' />
            Finished
          </span>
        ),
      },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size='middle'>
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ]

    const data = []
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i + 100,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      })
    }
    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]!.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columnsSeries: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Date',
      dataIndex: 'identifier',
      key: 'identifier',
      sorter: (a, b) => a.value - b.value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Market Share %',
      dataIndex: 'marketshare',
      key: 'marketshare',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.value - b.value,
      render: (dataIndex) => (
        <div style={{ width: '85%' }}>
          <Progress
            size='small'
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={dataIndex}
          ></Progress>
        </div>
      ),
    },
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'identifier',
      key: 'identifier',
      ...getColumnSearchProps('identifier'),
    },
    {
      title: 'Listings',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Market Share %',
      dataIndex: 'marketshare',
      key: 'marketshare',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.value - b.value,
      render: (dataIndex) => (
        <div style={{ width: '85%' }}>
          <Progress
            size='small'
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={dataIndex}
          ></Progress>
        </div>
      ),
    },
  ]

  return (
    <div>
      {isSeries ? (
        <div>
          <div style={{ marginTop: 25 }}></div>
          <Table
            bordered={false}
            columns={columnsSeries}
            expandable={{ expandedRowRender }}
            dataSource={true ? tableData : []}
            size={'small'}
          />
        </div>
      ) : (
        <div style={{ marginTop: 25 }}>
          <Table
            bordered={false}
            columns={columns}
            dataSource={true ? tableData : []}
            size={'small'}
          />
        </div>
      )}
    </div>
  )
}

export default MyTable
