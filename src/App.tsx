import {VictoryArea, VictoryTheme, VictoryChart, VictoryAxis, VictoryPolarAxis } from 'victory';
import { Container } from "@chakra-ui/react";


function App() {

  const sampleData = [200, 100, 300, 400, 900];

  return <div className="App">
    <Container>
    <VictoryChart
    theme={VictoryTheme.material}
    
  >
    <VictoryArea data={sampleData}/>
    <VictoryAxis/>
  </VictoryChart>
  </Container>
  </div>;
}

export default App;
