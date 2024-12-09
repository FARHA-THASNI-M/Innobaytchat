import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Layout,
  List,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { createRolePermission, getAllPermission, getRolePermissionByRoleId, updateRoleDetails } from "../main.service";
const ViewEdit = ({ RoleDetails, setIsView, isView, id }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsData, setPermissionData] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState([]);
  const [defaultPermissions, setDefaultPermission] = useState([]);
  const [adminDefaultPermissions, setAdminDefaultPermission] = useState([]);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setLoading(true);
    let data = {
      role_id: RoleDetails.role_id,
      role_name: form.getFieldValue("role_name"),
      description: form.getFieldValue("description"),
    };

    updateRoleDetails(data)
      .then((data) => {
        if (data.success) {
          if (permissionsIsSame(defaultPermissions, selectedPermissions)) {
            setIsView(true)
          } else {
            createRolePermissionHandler(RoleDetails.role_id)
          }
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((err) => {
        message.error(err?.message ? err.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const permissionsIsSame = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
    return true;
  }

  const confirm = (e) => {
    form.setFieldValue("role_name", RoleDetails.role_name);
    form.setFieldValue("description", RoleDetails.description);
    setIsView(true);
  };
  const onCancel = (e) => {
    return 0;
  };

  useEffect(() => {
    if (isView) {
      getAllPermissionsData();
      getPermissionsDataByRole()
    } else {
      setDefaultPermissionsHandler()
    }
  }, [isView]);

  const setDefaultPermissionsHandler = () => {
    setSelectedPermissions(defaultPermissions)
  }

  const getAllPermissionsData = () => {
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
          setGroupedPermissions(groupedPermissions)
          const defaultPermissionsData = data?.data.filter(({ is_default }) => is_default === true)
          setAdminDefaultPermission(defaultPermissionsData)
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

  const getPermissionsDataByRole = () => {
    setLoading(true)
    getRolePermissionByRoleId(id)
      .then((data) => {
        if (data.data && data.success) {
          const permissionsData = data.data?.rows.map(({ permission_id }) => permission_id)
          console.log(permissionsData)
          setDefaultPermission(permissionsData);
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


  const createRolePermissionHandler = (role_id) => {
    const payload = {
      role_id: role_id,
      permission_id: [...new Set(selectedPermissions)]
    }
    createRolePermission(payload)
      .then((data) => {
        if (data.success) {
          form.resetFields()
          setSelectedPermissions([])
          setIsView(true);
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

  const handleCheckboxChange = (permission) => {
    setSelectedPermissions(prevSelected => {
      if (prevSelected.includes(permission)) {
        return prevSelected.filter(p => p !== permission);
      } else {
        return [...prevSelected, permission];
      }
    });
  };

  const handleCategoryCheckboxChange = (category, isChecked) => {
    const permissionsInCategory = groupedPermissions[category];
    const permissionsIds = permissionsInCategory && permissionsInCategory.map(permission => permission.id);
    if (isChecked) {
      const defaultIds = adminDefaultPermissions.map(({ id }) => id)
      setSelectedPermissions(prevSelected => {
        const newSelected = [...prevSelected, ...defaultIds, ...permissionsIds];
        return [...new Set(newSelected)]; // Use Set to remove duplicates
      });
    } else {
      setSelectedPermissions(prevSelected => prevSelected.filter(p => !permissionsIds.includes(p)));
    }
  };
  return (
    <Layout.Content style={{ height: "68vh", overflow: "auto", overflowX: 'hidden' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isView}
        initialValues={RoleDetails}
      >
        <Row gutter={16}>
          <Col span={12}>

            <Form.Item
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
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
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
            </Form.Item>
          </Col>
        </Row>

        <Card title='Permissions'>
          <List
            style={{ maxHeight: '38vh', overflowY: 'auto', overflowX: 'hidden' }}
            itemLayout="vertical"
            loading={loading}
            disabled={isView}
            dataSource={Object.entries(groupedPermissions)}
            renderItem={([category, permissions]) => (
              <List.Item key={category}>
                {isView ? <b className="text-base">{category}</b> :
                  <Checkbox
                    onChange={(e) => handleCategoryCheckboxChange(category, e.target.checked)}
                  >
                    <b className="text-base">{category}</b>
                  </Checkbox>
                }
                <div className="mt-3 ml-5">
                  <Row gutter={[16, 16]}>
                    {permissions.map(permission => (
                      < Col key={permission.permissions_id} >

                        <Checkbox
                          onChange={() => handleCheckboxChange(permission.permissions_id)}
                          checked={isView ? defaultPermissions.includes(permission.permissions_id) : selectedPermissions.includes(permission.permissions_id)}
                          disabled={permission?.is_default || isView}
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
        {!isView && (
          <Form.Item>
            <Space style={{ float: "right" }}>
              <Popconfirm
                title="Are you sure?"
                description="changes will not be saved"
                onConfirm={confirm}
                onCancel={onCancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" disabled={loading}>Cancel</Button>
              </Popconfirm>

              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </Space>
          </Form.Item>
        )}

      </Form>
    </Layout.Content >
  );
};

export default ViewEdit;
