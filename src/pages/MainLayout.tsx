import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import { VerticalMenu } from "../components";

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout>
      <Sider>
        <VerticalMenu />
      </Sider>
      <Content>
        <Outlet /> {/* The outlet */}
      </Content>
    </Layout>
  );
};

export default MainLayout;
