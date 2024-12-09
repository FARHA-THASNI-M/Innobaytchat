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
} from "antd";
import { ICONS, TASK_FORM } from "../../constants";
import DescriptionEditor from "../common/description/DescriptionEditor";
import "./snag.css";
import { getDifferenceBetweenDates } from "../../utils";
const { Title } = Typography;

const SnagModal = ({ visible, onCreate, onUpdate, onCancel, record = {} }) => {
  const [form] = Form.useForm();

  const [description, setDescription] = useState(null);
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    if (record) {
      // If record is provided, it's an update operation
      onUpdate(record.id, values);
    } else {
      // If no record, it's a create operation
      onCreate(values);
    }
    // if (fileList && fileList.length) {
    //   if (fileList.length > 1) {
    //     bulkFileUpload(fileList)
    //   } else {
    //     fileUpload(fileList[0]?.originFileObj)
    //   }
    // }

  };

  const selectValue = [{ value: "dummy", label: "dummy" }];

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const getTitle = () => {
    if (Object.keys(record) && Object.keys(record).length) {
      return (
        <>
          <Space align="baseline">
            <img src={ICONS.SnagModal} height={30}></img>
            <h3>Edit Snag</h3>
            <Tag color={"#0084FF"} key={"key"}>
              C2877/22
            </Tag>
          </Space>
        </>
      );
    } else {
      return (
        <Space align="center">
          <img src={ICONS.SNAG} height={30}></img>
          <h3>Create Snag</h3>
        </Space>
      );
    }
  };
  return (
    <Modal
      open={visible}
      title={getTitle()}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onFinish}>
          {record ? "Update" : "Create"}
        </Button>,
      ]}
      width={800}
    >
      <div
        style={{ maxHeight: "600px", overflow: "scroll", overflowX: "hidden" }}
      >
        <Form
          form={form}
          layout="vertical"
          // onFinish={onFinish}
          initialValues={record}
        >
          <Form.Item
            name={TASK_FORM.PRIORITY.NAME}
            label={TASK_FORM.PRIORITY.LABEL}
            rules={[
              {
                required: TASK_FORM.PRIORITY.REQUIRED,
                message: TASK_FORM.PRIORITY.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              className={"selector"}
              options={selectValue}
              placeholder={TASK_FORM.PRIORITY.PLACEHOLDER}
            />
          </Form.Item>

          <Form.Item
            name={TASK_FORM.CATEGORY.NAME}
            label={TASK_FORM.CATEGORY.LABEL}
            rules={[
              {
                required: TASK_FORM.CATEGORY.NAME,
                message: TASK_FORM.CATEGORY.NAME,
              },
            ]}
          >
            <Select
              className={"selector"}
              options={selectValue}
              placeholder={TASK_FORM.CATEGORY.PLACEHOLDER}
            />
          </Form.Item>

          <Form.Item name={TASK_FORM.DATE.NAME} label={TASK_FORM.DATE.LABEL}>
            <Row gutter={16} style={{ height: "50px" }}>
              <Col span={8}>
                <Form.Item
                  name="start_date"
                  rules={[
                    { required: true, message: "Please Select Start Date." },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder={"Start Date"}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="end_date"
                  rules={[
                    { required: true, message: "Please Select End Date." },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder={"End Date"}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="field3">
                  <Input
                    readonly
                    value={getDifferenceBetweenDates(form.getFieldValue("start_date"), form.getFieldValue("end_date"))}
                    placeholder={"Number of Days"}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name={TASK_FORM.DESCRIPTION.NAME}
            label={TASK_FORM.DESCRIPTION.LABEL}
            rules={[
              {
                required: TASK_FORM.DESCRIPTION.NAME,
                message: TASK_FORM.DESCRIPTION.NAME,
              },
            ]}
          >
            <DescriptionEditor
              data={description}
              setEditorData={setDescription}
              setFileList={setFileList}
              fileList={fileList}
            />
          </Form.Item>
          <Form.Item
            name={TASK_FORM.ASSIGNEE.NAME}
            label={TASK_FORM.ASSIGNEE.LABEL}
            rules={[
              {
                required: TASK_FORM.ASSIGNEE.NAME,
                message: TASK_FORM.ASSIGNEE.NAME,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item>
                        <div style={{ float: 'right' }}>
                            <Button type="primary" htmlType="submit">
                                {record ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                                Cancel
                            </Button>
                        </div>
                    </Form.Item> */}
        </Form>
      </div>
    </Modal>
  );
};

export default SnagModal;
