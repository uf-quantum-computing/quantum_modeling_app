// ================ MainLayout =================
// sets up the main layout for the app

// ====== imports ======
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
// import { VerticalMenu } from "../components";
// const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default MainLayout;
