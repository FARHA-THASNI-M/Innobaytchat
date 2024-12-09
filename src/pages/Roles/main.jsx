import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Layout, Space, Table, Typography, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { deleteRoleDetails, getRoleList } from "./main.service";
import DeleteAction from "./pages/DeleteAction";
import useFilters from "../../components/common/table/useFilters";

const Role = () => {
  const navigate = useNavigate();
  const { getColumnSearchProps } = useFilters();
  const [roleDetails, setRoleDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    roleList();
  }, []);
  const roleList = () => {
    setLoading(true)
    getRoleList()
      .then((data) => {
        if (data.data && data.success) {
          setRoleDetails(data.data);
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((err) => {
        message.error(err?.message ? err.message : "failed");
      }).finally(() => {
        setLoading(false)
      })
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
      width: 120,
      fixed: 'left',
      ellipsis: true,
      ...getColumnSearchProps("role_name"),
      sorter: (a, b) => a.role_name.localeCompare(b.role_name),
      render: (text, record) => {
        return <>

          <Typography.Text>
            {record?.is_super_admin && <Badge color="green" />} {text + " " || "-"}
          </Typography.Text>
        </>;
      }
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 180,
      ...getColumnSearchProps("description"),
      sorter: (a, b) => a.description.localeCompare(b.description),
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => (
        <Typography.Text>
          {moment(text).format("DD/MM/YYYY HH:mm:ss")}
        </Typography.Text>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            shape="circle"
            onClick={(e) => {
              navigate(`${ROUTES.ROLE.PATH}/details/2/${record.role_id}`);
            }}
          >
            <EyeOutlined />
          </Button>
          {!record?.is_super_admin && <DeleteAction
            record={record}
            deleteRole={deleteRoleDetails}
            roleList={roleList}
          />}
        </Space>
      ),
    },
  ];
  return (
    <Layout.Content style={{height:'100%'}}>
      <Card
        title="Role Management"
        style={{height:'75vh'}}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={(e) => {
                navigate(`${ROUTES.ROLE.PATH}/details`);
              }}
            >
              Add Role
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={roleDetails}
          pagination={10}
          loading={loading}
          scroll={{
            y: '45vh',
          }}
        ></Table>
      </Card>
    </Layout.Content>
  );
};

export default Role;
