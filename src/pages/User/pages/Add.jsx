import {
  Layout,
  Form,
  Input,
  Select,
  Space,
  Button,
  Checkbox,
  Row,
  Col,
  message,
} from "antd";
import React, { useState } from "react";
import { COUNTRYCODE } from "../../../constants/countryCode";
import { createUser } from "../main.service";
const Add = ({ roleOption }) => {
  const [form] = Form.useForm();
  const [code, setCode] = useState("+971");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onChange = (e) => {
    form.setFieldValue("default_user", e.target.checked);
  };

  const handleSubmit = () => {
    let data = form.getFieldValue();
    data = {
      ...data,
      country_code: code,
      phone_number: parseInt(form.getFieldValue("phone_number")),
      username: form.getFieldValue("username")?.toLowerCase()
    };
    console.log("data", data, form.getFieldValue());
    createUser(data)
      .then((data) => {
        if (data.success) {
          message.info(data.message);
          form.resetFields();
          setPassword("");
          setPasswordVisible(false);
        }
        if (!data.success) message.error(data.message);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
    form.setFieldValue("password", randomPassword);
  };
  const onCountyCodeHandleChange = (e) => {
    setCode(e);
  };
  const selectBefore = (
    <Select
      style={{ width: "200px" }}
      defaultValue="+971"
      options={COUNTRYCODE}
      name="contry_code"
      onChange={onCountyCodeHandleChange}
    ></Select>
  );

  const cancel = () => {
    form.resetFields();
  };

  return (
    <Layout.Content style={{ width: "100%", height: "100%" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ height: "70vh", overflow: "auto" }}
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
              <Input type="text" placeholder="Enter user name" />
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
              <Checkbox onChange={onChange}></Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required!",
                },
              ]}
            >
              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <Input.Password
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
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

        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button type="default" onClick={cancel}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

export default Add;
