import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants";
import { getRoleDetail } from "./main.service";
import Add from "./pages/Add";
import ViewEdit from "./pages/ViewEdit";

const RoleDetails = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [roleDetails, setRoleDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(true);
  const { id, key } = useParams();

  useEffect(() => {
    setActiveKey(key);
    if (id) getRoleDetailsById();
  }, []);

  const getRoleDetailsById = () => {
    setLoading(true)
    getRoleDetail(id).then((details) => {
      if (details.success) {
        setRoleDetails({ ...details.data });
        setLoading(false)
      }
    }).CardDetails;
  };
  return (
    <Layout.Content>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined onClick={(e) => {
              navigate(`${ROUTES.ROLE.PATH}`);
            }} />
            {id ? (isView ? 'View Role Details' : 'Edit Role Details') : 'Add Role'}
          </Space>

        }
        extra={
          id && <Button
            shape="circle"
            onClick={() => setIsView(false)}
            disabled={!isView}
          >
            <EditOutlined />
          </Button>
        }
        loading={loading}
      >
        {id ? roleDetails && <ViewEdit RoleDetails={roleDetails}
          setIsView={setIsView} isView={isView} id={id} /> : <Add />}
      </Card>
    </Layout.Content>
  );
};

export default RoleDetails;
