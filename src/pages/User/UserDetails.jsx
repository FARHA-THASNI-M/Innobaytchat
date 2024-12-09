import { Button, Card, Layout, Space, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Add from "./pages/Add";
import ViewEdit from "./pages/ViewEdit";
import { ROUTES } from "../../constants";
import { getUserDetail, getRoleList } from "./main.service";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

const UserDetails = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [userDetail, setUserDetail] = useState();
  const [roleOption, setRoleOption] = useState([]);
  const [isView, setIsView] = useState(true);
  const { id, key } = useParams();

  useEffect(() => {
    setActiveKey(key);
    getUserDetailsById();
    roleList();
  }, []);

  const getUserDetailsById = () => {
    getUserDetail(id).then((details) => {
      if (details.success) {
        console.log(details.data);
        setUserDetail({ ...details.data });
      }
    }).CardDetails;
  };
  const roleList = () => {
    getRoleList().then((role) => {
      if (role.success) {
        let opt = [];
        role.data.map((role) => {
          opt.push({
            value: role.role_id,
            label: role.role_name,
          });
        });
        setRoleOption(opt);
        console.log(opt, "----");
      }
    });
  };
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  return (
    <Layout.Content style={{ height: "75vh", width: "100%" }}>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined
              onClick={(e) => {
                navigate(`${ROUTES.USER.PATH}`);
              }}
            />
            {id ? (isView ? "View User" : "Edit User") : "Add User"}
          </Space>
        }
        style={{ height: "100%" }}
        extra={
          id && (
            <Button
              shape="circle"
              onClick={() => setIsView(false)}
              disabled={!isView}
            >
              <EditOutlined />
            </Button>
          )
        }
      >
        {!id && <Add roleOption={roleOption} />}
        {userDetail && (
          <ViewEdit
            userDetail={userDetail}
            roleOption={roleOption}
            isView={isView}
            setIsView={setIsView}
          />
        )}
      </Card>
    </Layout.Content>
  );
};

export default UserDetails;
