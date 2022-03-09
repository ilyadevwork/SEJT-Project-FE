import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker, { DateRange } from "@mui/lab/DateRangePicker";
import Box from "@mui/material/Box";
import {
  getDateRange,
  useDashContext,
  updateData,
  disableDates,
} from "./store";

export default function DatePicker() {
  const [dashState, setDashstate] = useDashContext();
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
  const dataRange = getDateRange();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        value={value}
        defaultCalendarMonth={dataRange[0] || undefined}
        minDate={dataRange[0] || undefined}
        maxDate={dataRange[1] || undefined}
        shouldDisableDate={disableDates}
        reduceAnimations
        onChange={(newvalue) => {
          if (newvalue.toString() !== value.toString()) {
            setValue(newvalue);
            console.log(dashState);
          } else {
            if (value[0] !== null) {
              setDashstate(updateData(dashState, value));
            }
          }
        }}
        calendars={2}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}
