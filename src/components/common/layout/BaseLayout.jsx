import { Layout, theme } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Header, SideMenu } from "../index";
const { Content } = Layout;

const BaseLayout = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout style={{ height: "100vh", minHeight:'100%'}}>
      <SideMenu {...props} collapsed={collapsed}></SideMenu>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100vh',overflow:'hidden'}}>
      <Layout>
        <Header
          {...props}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        ></Header>

        <Content
          style={{
            margin: "8px 8px",
            padding: 5,
            // minHeight: 280,

            // height: "calc( 90vh - 44px)",
            // minHeight: "calc(90vh - 44px)",
            
            // minHeight: "100%",
            background: colorBgContainer,
          }}
        >
          {props.content}
        </Content>
        
      </Layout>
      <Footer />
      </div>
      
    </Layout>
  );
};
export default BaseLayout;
