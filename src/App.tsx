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
import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./App.css";
import { Container } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import {
  namesExtractor,
  valuesExtractor,
  jobs,
  snapshots,
  valuesCompare,
} from "./extractor";
import ShowChartSharpIcon from "@mui/icons-material/ShowChartSharp";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import _, { indexOf } from "underscore";
import { Divider } from "@mui/material";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface tableData {
  value: number;
  name: string;
}

function Application() {
  const [someState, setDataState] = useState(defaultState);
  const chartRef = useRef<ChartJS>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [value1, setValue1] = React.useState("Single Snapshot (1 Day)");

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue1((event.target as HTMLInputElement).value);
  };

  const [date, setDate] = React.useState(snapshots[0].EntryDate);

  const handleChange2 = (event: SelectChangeEvent) => {
    setDate(event.target.value);
  };

  const handleChange3 = (event: SelectChangeEvent) => {
    setValue3(event.target.value);
  };
  const [value3, setValue3] = React.useState("All Skill Datasets (Root)");

  const DateMenu = () => {
    let foo: any[] = [];

    for (const v in snapshots) {
      foo.push(snapshots[v].EntryDate);
    }

    return (
      <div id="someForm">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Date</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={date}
            onChange={handleChange2}
            label="Date"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {foo.map((value) => (
              <MenuItem
                key={value + 1}
                value={value}
                onClick={() => {
                  const tempState = { ...someState };
                  if (tempState.dates.isAll === false) {
                    tempState.dates.date = value;

                    if (value3 === "All Skill Datasets (Root)") {
                      let tempJobs = tempState.jobsdata.jobs;
                      let index = _.findIndex(snapshots, {
                        EntryDate: tempState.dates.date,
                      });
                      tempJobs = JSON.parse(snapshots[index].EntryData);
                      tempState.jobsdata.jobs = tempJobs;
                      tempJobs.data.techRoot.skills.sort(valuesCompare);
                      tempState.chartdata.datasets = [
                        {
                          label: "Dataset",
                          data: valuesExtractor(tempJobs.data.techRoot.skills),
                          backgroundColor: "#0288d1",
                        },
                      ];
                      tempState.chartdata.options.plugins.title.text =
                        tempState.dates.date.split("T")[0];
                      tempState.chartdata.labels = namesExtractor(
                        tempJobs.data.techRoot.skills
                      );
                      tempState.tabledata.rows = remapData(
                        tempState.chartdata.labels,
                        tempState.chartdata.datasets[0].data
                      );
                    }

                    setDataState({ ...tempState });
                  } else {
                    tempState.dates.isAll = true;
                    setDataState({ ...tempState });
                  }
                }}
              >
                {value.split("T")[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  };

  function DataMenu() {
    const [metric, setMetric] = React.useState("Skills");
    const handleChange4 = (event: SelectChangeEvent) => {
      setMetric(event.target.value);
    };

    const sources = [
      "Skills",
      "Remote Jobs",
      "Salary Estimates",
      "Job Types",
      "Experiance Levels",
      "Education Levels",
      "Location",
      "Company",
    ];

    const metrics = [
      "skills",
      "remote",
      "salaryEst",
      "jobType",
      "expLevel",
      "eduLevel",
      "location",
      "company",
    ];


    return (
      <div id="someForm">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="rando">Metrics</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={metric}
            onChange={handleChange4}
            label="Metrics"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {metrics.map((value) => (
              <MenuItem
                key={value + 10}
                value={value}
                onClick={() => {
                  const tempState = { ...someState };

                  if (value3 === "All Skill Datasets (Root)") {
                    let tempJobs = tempState.jobsdata.jobs;
                    let index = _.findIndex(snapshots, {
                      EntryDate: tempState.dates.date,
                    });
                    tempJobs = JSON.parse(snapshots[index].EntryData);
                    tempState.jobsdata.jobs = tempJobs;
                    tempJobs.data.techRoot.skills.sort(valuesCompare);
                    
                    tempState.chartdata.datasets = [
                      {
                        label: "Dataset",
                        data: valuesExtractor(jobs.data.techRoot.skills),
                        backgroundColor: "#0288d1",
                      },
                    ];
                    tempState.chartdata.labels=namesExtractor(jobs.data.techRoot.skills);

                    tempState.tabledata.rows = remapData(
                      tempState.chartdata.labels,
                      tempState.chartdata.datasets[0].data
                    );
                  }
                  setDataState({ ...tempState });
                }}
              >
                {value.split("T")[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Container>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
              style={{ paddingTop: "18px" }}
            >
              <Tab label="SEJT" {...a11yProps(0)} />
              <Tab label="Configuration" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={1}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Date Range</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="controlled-radio-buttons-group"
                value={value1}
                onChange={handleChange1}
              >
                <FormControlLabel
                  value="All Snapshots (All Days)"
                  control={
                    <Radio
                      disabled={true}
                      onClick={() => {
                        const tempState = { ...someState };
                        if (tempState.dates.isAll === false) {
                          tempState.dates.isAll = true;
                          setDataState({ ...tempState });
                        }
                      }}
                    />
                  }
                  label="All Snapshots (All Days)"
                />
                <FormControlLabel
                  value="Single Snapshot (1 Day)"
                  control={
                    <Radio
                      onClick={() => {
                        const tempState = { ...someState };
                        if (tempState.dates.isAll === true) {
                          tempState.dates.isAll = false;
                          tempState.dates.date = value;
                          setDataState({ ...tempState });
                        }
                      }}
                    />
                  }
                  label="Single Snapshot (1 Day)"
                />
                <div style={{ paddingBottom: "20px" }}>
                  <DateMenu></DateMenu>
                </div>
              </RadioGroup>
            </FormControl>
            <Divider></Divider>
            <div style={{ paddingTop: "20px" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Data Range</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="controlled-radio-buttons-group"
                  value={value3}
                  onChange={handleChange3}
                >
                  <FormControlLabel
                    value="All Skill Datasets (Root)"
                    control={
                      <Radio
                        onClick={() => {
                          const tempState = { ...someState };

                          let tempJobs = tempState.jobsdata.jobs;
                          let index = _.findIndex(snapshots, {
                            EntryDate: tempState.dates.date,
                          });
                          tempJobs = JSON.parse(snapshots[index].EntryData);
                          tempState.jobsdata.jobs = tempJobs;

                          setDataState({ ...tempState });
                        }}
                      />
                    }
                    label="All Skill Datasets (Root)"
                  />
                  <DataMenu></DataMenu>
                  <FormControlLabel
                    value="Single Skill Dataset (Branch)"
                    control={
                      <Radio
                        onClick={() => {
                          const tempState = { ...someState };
                          let tempJobs = tempState.jobsdata.jobs;
                          let index = _.findIndex(snapshots, {
                            EntryDate: tempState.dates.date,
                          });
                          tempJobs = JSON.parse(snapshots[index].EntryData);
                          tempState.jobsdata.jobs = tempJobs;
                          setDataState({ ...tempState });
                        }}
                      />
                    }
                    label="Single Skill Dataset (Branch)"
                  />
                </RadioGroup>
                <Container
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    padding: 0,
                  }}
                >
                  <DataMenu></DataMenu>
                  <MultipleSelectChip></MultipleSelectChip>
                </Container>
              </FormControl>
            </div>
            <div style={{ justifyContent: "left", display: "flex" }}></div>
            <div className="goo">
              <Button
                id="basic-button"
                variant="contained"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                Add Data
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>popData</MenuItem>
                <MenuItem onClick={handleClose}>pushData</MenuItem>
                <MenuItem onClick={handleClose}>populateTable</MenuItem>
              </Menu>
            </div>
            <Divider></Divider>
          </TabPanel>
        </Container>
      </Grid>
      <Grid item xs={8}>
        <Container>
          <Chart
            ref={chartRef}
            type="line"
            options={someState.chartdata.options}
            data={someState.chartdata}
          />
        </Container>
        <div style={{ paddingTop: "20px" }}>
          <EnhancedTable></EnhancedTable>
        </div>
      </Grid>
    </Grid>
  );
}

export default function App() {
  return (
    <Box className="foo">
      <Application></Application>
    </Box>
  );
}

const remapData = (name: string[], value: number[]) => {
  const tempArr: tableData[] = [];
  for (var index in value) {
    tempArr.push({
      name: name[index],
      value: value[index],
    });
  }
  return tempArr;
};

const defaultState = {
  chartdata: {
    datasets: [
      {
        label: "Dataset",
        data: valuesExtractor(jobs.data.techRoot.skills),
        backgroundColor: "#0288d1",
      },
    ],
    labels: namesExtractor(jobs.data.techRoot.skills),
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: snapshots[0].EntryDate.split("T")[0],
        },
      },
    },
  },
  tabledata: {
    rows: remapData(
      namesExtractor(jobs.data.techRoot.skills),
      valuesExtractor(jobs.data.techRoot.skills)
    ),
  },
  dates: {
    isAll: false,
    date: snapshots[0].EntryDate,
  },
  jobsdata: {
    jobs: jobs,
  },
};

const someState = defaultState;

// Tabs and Table ------------------------------------------------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof tableData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Skills",
  },
  {
    id: "value",
    numeric: true,
    disablePadding: false,
    label: "Listings",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof tableData
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof tableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding="none"
          align="center"
          size="small"
          style={{ height: "50px" }}
        >
          <ShowChartSharpIcon
            fontSize="medium"
            style={{ paddingTop: "7px", color: "#0288d1" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof tableData>("value");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof tableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - someState.tabledata.rows.length)
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 200 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={someState.tabledata.rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(
                someState.tabledata.rows,
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell align="center" style={{ width: "25px" }}>
                        {1 + index + page * rowsPerPage}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={someState.tabledata.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

// ----------------------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = namesExtractor(someState.jobsdata.jobs.data.techRoot.skills);

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function MultipleSelectChip() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Skills</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
