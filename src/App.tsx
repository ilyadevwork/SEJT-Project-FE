import Dashboard from "./components/dashboard";
import { DashProvider } from "./components/store";
import LineChart from "./components/chart";
import "./App.css";


function App() {
  return (
    <DashProvider>
      <span>
        <Dashboard></Dashboard>
        <LineChart></LineChart>
      </span>
    </DashProvider>
  );
}

export default App;
