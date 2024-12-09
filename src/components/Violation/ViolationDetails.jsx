import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  DatePicker,
  Col,
  Tag,
  Select,
  Card,
  Flex,
  Divider,
  Tooltip,
  Avatar,
  Dropdown,
} from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  AntDesignOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";

import { ICONS, TASK_FORM } from "../../constants";
import DescriptionEditor from "../common/description/DescriptionEditor";
import "./violation.css";
import DescriptionViewer from "../common/description/DescriptionViewer";
const { Title } = Typography;

const ViolationDetailsModal = ({
  visible = true,
  onCreate,
  onUpdate,
  onCancel,
  record,
}) => {
  const [form] = Form.useForm();

  const [description, setDescription] = useState(null);

  const onFinish = (values) => {
    if (record) {
      // If record is provided, it's an update operation
      onUpdate(record.id, values);
    } else {
      // If no record, it's a create operation
      onCreate(values);
    }
  };

  const selectValue = [{ value: "dummy", label: "dummy" }];

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const getTitle = () => {
    return (
      <>
        <Space align="center">
          <img src={ICONS.VIOLATION} height={30}></img>
          <Tag
            color={"#E5ECF6"}
            style={{ borderRadius: "20px", color: "#00000066" }}
            key={"hello"}
          >
            violation
          </Tag>
          <Tag color={"#0084FF"} key={"sam"}>
            C2877/22
          </Tag>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
          >
            <Button style={{ border: "none", boxShadow: "none" }}>
              <SmallDashOutlined />
            </Button>
          </Dropdown>
        </Space>
        <h3>HVAC System Installation on First Floor</h3>
      </>
    );
  };
  const items = [
    {
      key: "1",
      label: <div>Move to trash</div>,
    },
  ];

  return (
    <Modal
      open={visible}
      title={getTitle()}
      onCancel={handleCancel}
      width={1200}
      height={500}
      footer={null}
      scroll={true}
    >
      <Row gutter={16}>
        <Col span={8} push={16} className={"colScroll"}>
          <h3>Details</h3>
          <Card title="Category" className={"card"}>
            <Tag
              color={"#E5ECF6"}
              style={{ borderRadius: "20px", color: "#00000066" }}
              key={"hello"}
            >
              General Preliminaries
            </Tag>
          </Card>
          <Card title="Phase Name" className={"card"}>
            <Tag
              color={"#fff"}
              style={{
                borderRadius: "20px",
                color: "#000",
                border: "none",
              }}
              key={"hello"}
            >
              Phase Name
            </Tag>
          </Card>
          <Card title="Timeline" className={"card"}>
            <div className={"timeline"}>
              <p>Start Date</p>
              <p>2/26/2023</p>
            </div>
            <Divider style={{ margin: 0 }} />
            <div className={"timeline"}>
              <p>End Date</p>
              <p>2/26/2023</p>
            </div>
            <Divider style={{ margin: 0 }} />
            <div className={"timeline"}>
              <p>Number of Days</p>
              <p>15</p>
            </div>
          </Card>
          <Card title="Assignee" className={"card"}>
            <Avatar.Group
              maxCount={2}
              size="large"
              maxStyle={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              }}
            >
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
              <Avatar
                style={{
                  backgroundColor: "#f56a00",
                }}
              >
                K
              </Avatar>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                  }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
              <Avatar
                style={{
                  backgroundColor: "#1677ff",
                }}
                icon={<AntDesignOutlined />}
              />
            </Avatar.Group>
          </Card>
        </Col>
        <Col span={16} pull={8} className={"colScroll"}>
          <h3>Description</h3>
          <Divider style={{ margin: 0 }} />
          <DescriptionViewer htmlText={"<p>hello</p>"} />
          <Divider style={{ margin: 0 }} />
          <Space direction="vertical">
            <Space.Compact small>
              <img src={ICONS.MESSAGE} />
              <h3> Comments(1)</h3>
            </Space.Compact>
            <Space.Compact small>
              <Input
                style={{ width: "738px" }}
                placeholder="Enter your Message"
                prefix={<UserOutlined className="site-form-item-icon" />}
                suffix={
                  <Tooltip title="Attachemtns">
                    <InfoCircleOutlined
                      style={{
                        color: "rgba(0,0,0,.45)",
                      }}
                    />
                  </Tooltip>
                }
              />
            </Space.Compact>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default ViolationDetailsModal;
