import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Layout,
  Popconfirm,
  Row,
  Select,
  Space,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { COUNTRYCODE } from "../../../constants/countryCode";
import { updateUserDetails } from "../main.service";
const ViewEdit = ({ userDetail, roleOption, isView, setIsView }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [code, setCode] = useState(userDetail?.country_code);
  const [isChecked, setisChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onChange = (e) => {
    form.setFieldValue("default_user", e.target.checked);
    setisChecked(e.target.checked);
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
    form.setFieldValue("password", randomPassword);
  };

  useEffect(() => {
   form.setFieldValue("default_user", userDetail?.default_user);
    setisChecked(userDetail?.default_user);
    setPassword(userDetail?.password);
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    let data = form.getFieldValue();
    data = {
      first_name: form.getFieldValue("first_name"),
      last_name: form.getFieldValue("last_name"),
      email: form.getFieldValue("email"),
      default_user: form.getFieldValue("default_user"),
      role_id: form.getFieldValue("role_id"),
      country_code: code,
      phone_number: parseInt(form.getFieldValue("phone_number")),
      password: form.getFieldValue("password"),
    };
    updateUserDetails(userDetail.user_id, data)
      .then((data) => {
        if (data.success) {
          setIsView(true);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancel = () => {
    form.resetFields();
  };
  const onCountyCodeHandleChange = (e) => {
    setCode(e);
  };
  const selectBefore = (
    <Select
      style={{ width: "200px" }}
      defaultValue={code}
      options={COUNTRYCODE}
      name="contry_code"
      onChange={onCountyCodeHandleChange}
    ></Select>
  );
  const confirm = (e) => {
    form.setFieldValue("name", form.getFieldValue("name"));
    setIsView(true);
  };
  const onCancel = (e) => {
    return 0;
  };
  return (
    <Layout.Content style={{ width: "100%", height: "60vh", overflow: "auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isView}
        initialValues={userDetail}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Role"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: "Role is required!",
                },
              ]}
            >
              <Select
                placeholder="Select Role "
                style={{ width: "100%" }}
                options={roleOption}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="User Name"
              name="username"
              rules={[
                {
                  required: true,
                  message: "User is required!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter first name" disabled/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "First name is required!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Last name is required!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter first name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: false,
                  message: "Email id is required!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter email id" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input addonBefore={selectBefore} placeholder="000000000000" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Default User" name="default_user">
              <Checkbox onChange={onChange} checked={isChecked}></Checkbox>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Password" name="password">
              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <Input.Password
                    value={password}
                    placeholder="password"
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                  />
                </Col>
                <Col>
                  <Button onClick={generateRandomPassword}>
                    Generate Password
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

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
                <Button type="default">Cancel</Button>
              </Popconfirm>

              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Layout.Content>
  );
};

export default ViewEdit;
