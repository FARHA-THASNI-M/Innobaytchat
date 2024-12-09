import { Button, Card, Checkbox, Col, Form, Input, Layout, List, Row, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../constants";
import { createRole, createRolePermission, getAllPermission } from "../main.service";
const Add = () => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsData, setPermissionData] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState([]);
  const [defaultPermissions, setDefaultPermission] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    let data = form.getFieldValue();
    if (selectedPermissions && selectedPermissions.length) {
      setLoading(true)
      createRole(data)
        .then((result) => {
          if (result.success) {
            const roleData = result?.data
            createRolePermissionHandler(roleData)
          } else {
            message.error(result?.message ? result.message : "failed");
          }
        })
        .catch((err) => {
          message.error(err?.message ? err.message : "failed");
        });
    } else {
      message.error('Select at least one permission');
    }
  };

  const createRolePermissionHandler = (roleData) => {
    const role_id = roleData?.role_id;
    const permissionsIds = selectedPermissions.map(permission => permission.permissions_id);
    const defaultPermissionIds = defaultPermissions.map(permission => permission.permissions_id);
    const permissionData = [...defaultPermissionIds, ...permissionsIds]
    const payload = {
      role_id: role_id,
      permission_id: [...new Set(permissionData)]
    }
    createRolePermission(payload)
      .then((data) => {
        if (data.success) {
          form.resetFields()
          setSelectedPermissions([])
          navigate(ROUTES.ROLE.PATH);
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((err) => {
        message.error(err?.message ? err.message : "failed");
      }).finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = () => {
    setLoading(true)
    getAllPermission()
      .then((data) => {
        if (data.data && data.success) {
          setPermissionData(data.data);
          const groupedPermissions = data.data.reduce((acc, permission) => {
            const category = permission.permissions_category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
          }, {});
          setGroupedPermissions(groupedPermissions);
          const defaultPermissionsData = data?.data.filter(({ is_default }) => is_default === true)
          setDefaultPermission(defaultPermissionsData)
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

  const cancel = () => {
    form.resetFields();
  };

  const handleCheckboxChange = (permission) => {
    setSelectedPermissions(prevSelected => {
      if (prevSelected.includes(permission)) {
        return prevSelected.filter(p => p !== permission);
      } else {
        return [...prevSelected, permission];
      }
    });
  };

  // Function to handle category checkbox change
  const handleCategoryCheckboxChange = (category, isChecked) => {
    const permissionsInCategory = groupedPermissions[category];
    if (isChecked) {
      setSelectedPermissions(prevSelected => {
        const newSelected = [...prevSelected, ...defaultPermissions, ...permissionsInCategory];
        return [...new Set(newSelected)]; // Use Set to remove duplicates
      });
    } else {
      setSelectedPermissions(prevSelected => prevSelected.filter(p => !permissionsInCategory.includes(p)));
    }
  };

  return (
    <Layout.Content style={{ height: "55vh", overflow: "auto", overflowX: 'hidden' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ padding: '10px' }}>
        <Row gutter={16}>
          <Col span={12}> <Form.Item
            label="Role Name"
            name="role_name"
            rules={[
              {
                required: true,
                message: "Role is required!",
              },
            ]}
          >
            <Input type="text" placeholder="Enter role name." />
          </Form.Item></Col>
          <Col span={12}><Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required!",
              },
            ]}
          >
            <Input type="text" placeholder="Enter role Description." />
          </Form.Item></Col>
        </Row>


        <Card title='Permissions'>
          <List
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
            itemLayout="vertical"
            loading={loading}
            dataSource={Object.entries(groupedPermissions)}
            renderItem={([category, permissions]) => (
              <List.Item key={category}>
                <Checkbox
                  onChange={(e) => handleCategoryCheckboxChange(category, e.target.checked)}
                >
                  <b className="text-base">{category}</b>

                </Checkbox>
                <div className="mt-3 ml-5">
                  <Row gutter={[16, 16]}>
                    {permissions.map(permission => (
                      <Col key={permission.permissions_id}>
                        <Checkbox
                          onChange={() => handleCheckboxChange(permission)}
                          checked={selectedPermissions.includes(permission) || permission?.is_default}
                          disabled={permission?.is_default}
                        >
                          <Tooltip title={permission.description}>
                            <span>{permission.permissions_name}</span>
                          </Tooltip>

                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </div>
              </List.Item>
            )}
          />
        </Card>
        <Form.Item>
          <Space className="mt-5" style={{ float: "right" }}>
            <Button type="default" disabled={loading} onClick={cancel}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={loading}>
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

export default Add;
