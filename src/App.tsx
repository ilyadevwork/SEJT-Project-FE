import Chart from "./components/chart";
import { Layout } from "antd";
import { Col, Row } from "antd";
import "antd/dist/antd.css";

import Selection from "./components/selector";
import MyDatePicker from "./components/datePicker";
import MyTable from "./components/table";

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ margin: 35 }}>
      <Content>
        <div style={{ margin: 16 }}>
          <Row>
            <Col span={24}>
              <Chart />
              <MyDatePicker />
              <Selection />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <MyTable></MyTable>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
