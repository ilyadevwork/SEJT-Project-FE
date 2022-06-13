import { DashProvider } from "./components/configurator";
import Chart from "./components/chart";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { Col, Row } from "antd";
import ThisTable from "./components/table";
import MyDatePicker from "./components/datePicker";

const { Content } = Layout;

function App() {
  return (
    <Layout>
      <DashProvider>
        <Content>
        <div style={{ margin: 16 }}>
            <Row>
              <Col span={24}>
                <Chart />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ThisTable></ThisTable>
              </Col>
            </Row>
          </div>
        </Content>
      </DashProvider>
    </Layout>
  );
}

export default App;
