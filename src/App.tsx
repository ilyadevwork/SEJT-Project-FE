import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Chart } from "./components/chart";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { BasicMenu } from "./components/menu"
import { IconButton } from "@mui/material";
import Container from "@mui/material/Container"
import "./App.css";

export default function App() {
  return (
    <Box className="foo">
      <Grid container spacing={2}>
      <Grid item xs={4}>
        <Container>
          <BasicMenu></BasicMenu>
          <IconButton aria-label="DarkMode"> <DarkModeIcon />
</IconButton></Container>
        </Grid>
        <Grid item xs={8}>
          <Chart></Chart>
        </Grid>
      </Grid>
    </Box>
  );
}
