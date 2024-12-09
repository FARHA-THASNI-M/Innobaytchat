import {
  EyeOutlined,
  PlusOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Card, Layout, Space, Switch, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { deleteUserDetails, getUserDetails, updateUserDetails } from "./main.service";
import DeleteAction from "./pages/DeleteAction";
import useFilters from "../../components/common/table/useFilters";

const User = () => {
  const navigate = useNavigate();
  const { getColumnSearchProps } = useFilters();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserDetailsData();
  }, []);
  const getUserDetailsData = () => {
    setLoading(true)
    getUserDetails()
      .then((data) => {
        if (data.data && data.success) {
          setUserDetails(data.data.rows);
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false)
      })
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
      fixed: 'left',
      ellipsis: true,
      render: (text, record) => {
        return <><Space>
          {record &&
            record?.profilePictureDetails &&
            record?.profilePictureDetails.filePath ? (
            <Avatar src={record?.profilePictureDetails.filePath} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )}
          <Typography.Text>
            {text + " " || "-"} {record?.is_super_admin && <Tag color="#87d068">Super Admin</Tag>}
          </Typography.Text>
        </Space></>;
      },
      ...getColumnSearchProps("username"),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 100,
      ellipsis: true,
      ...getColumnSearchProps("first_name"),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 100,
      ellipsis: true,
      ...getColumnSearchProps("last_name"),
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      ellipsis: true,
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 120,
      ellipsis: true,
      ...getColumnSearchProps("phone_number"),
      render: (text, record) => {
        return <>{record.country_code + " " + text}</>;
      },
      sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Role Type",
      dataIndex: "role_id",
      key: "role_id",
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return <>{record?.ref_role?.role_name || ''}</>;
      },
    },
    {
      title: "Default User",
      dataIndex: "default_user",
      key: "default_user",
      width: 80,
      render: (text, record) => {
        return <Switch disabled={record?.is_super_admin} onChange={(e) => handleDefaultUser(e, record)} value={record?.default_user} />;
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        if (!record?.is_super_admin) {
          return (
            <>
              <Space>
                <Button
                  shape="circle"
                  onClick={(e) => {
                    navigate(`${ROUTES.USER.PATH}/details/2/${record.user_id}`);
                  }}
                >
                  <EyeOutlined />
                </Button>
                <DeleteAction
                  record={record}
                  deleteUser={deleteUserDetails}
                  getUserDetailsData={getUserDetailsData}
                />
              </Space>
            </>
          );
        } else {
          return <></>;
        }
      }
    },

  ];

  const handleDefaultUser = async (e, record) => {
    setLoading(true)
    updateUserDetails(record?.user_id, { default_user: e }).then((data) => {
      if (data.success) {
        getUserDetailsData()
      }
    })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false)
      })
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Layout.Content style={{ height: '75vh' }}>
      <Card
        title="User Management"
        style={{ height: '100%' }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={(e) => {
                navigate(`${ROUTES.USER.PATH}/details`);
              }}
            >
              Add User
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={userDetails}
          pagination={10}
          loading={loading}
          scroll={{
            y: '45vh',
          }}
          onChange={onChange}
        ></Table>
      </Card>
    </Layout.Content>
  );
};

export default User;
