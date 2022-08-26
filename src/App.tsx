import { Layout, Space, Button } from "antd";
import { Col, Row } from "antd";
import "./App.css";
import Chart from "./components/chart";
import Selection from "./components/selector";
import DatePicker from "./components/datePicker";
import Table from "./components/table";

const { Header, Footer, Sider, Content } = Layout;

const App = () => {
  return (
    <Layout style={{}}>
      <Header></Header>
      <Content>
        <div style={{ margin: 16 }}>
          <Row>
            <Col span={24}>
              <Chart />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginRight: 50 }}>
              <DatePicker />
              <Selection />
            </Col>
            <Col span={24}>
              <Table />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
