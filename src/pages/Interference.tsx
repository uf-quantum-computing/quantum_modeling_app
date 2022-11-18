import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import { VerticalMenu, CustomTitle } from "../components";

const { Sider } = Layout;

const Interference = () => {
  // const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
        // collapsible
        // collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
        >
          <CustomTitle />
          <VerticalMenu />
        </Sider>
        <Layout className="site-layout">
          <p>Test</p>
        </Layout>
      </Layout>
    </div>
  );
};

export default Interference;
