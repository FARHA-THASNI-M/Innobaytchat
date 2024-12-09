import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message
} from "antd";
import { useEffect, useState } from "react";
import { ICONS, VIOLATION_FORM } from "../../constants";
import "./violation.css";
import { createViolation } from "../../pages/Task/task.service";
import { getViolationCategory, getViolationSuggestedBy, lookupFormatter, userDataFormatter } from "../../services";
import { getDefaultUsersList } from "../../pages/Projects/project.service";
const { Title } = Typography;

const ViolationModal = ({ visible, onCancel, project, projectUsers, fetchData }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [defaultUsers, setDefaultUsers] = useState([])
  const [violationCategoryData, setViolationCategoryData] = useState(null)
  const violationCategories = lookupFormatter(getViolationCategory(), 'value', 'key')

  useEffect(() => {
    defaultUserList()
  }, [])

  const defaultUserList = () => {
    getDefaultUsersList().then((data) => {
      if (data.success) {
        setDefaultUsers(userDataFormatter(data?.data))
      }
    });
  }

  // const getViolationSuggestedBy = async () => {
  //   setLoading(true)
  //   getTaskListMeta(project.project_id, {}).then((data) => {
  //     if (data.success) {
  //       setTaskMeta(data.data)
  //     }
  //   }).catch((error) => {
  //     message.error(error?.message ? error.message : "failed");
  //   }).finally(() => {
  //     setLoading(false)
  //   })
  // }

  const onFinish = async () => {
    await form.validateFields();
    setLoading(true)
    const payload = {
      project_id: project?.project_id,
      violation_date: form.getFieldValue(VIOLATION_FORM.VIOLATION_DATE.NAME)?.format("YYYY-MM-DD"),
      location: form.getFieldValue(VIOLATION_FORM.LOCATION.NAME),
      report_number: form.getFieldValue(VIOLATION_FORM.REPORT_NO.NAME),
      violator_name: form.getFieldValue(VIOLATION_FORM.NAME_OF_VIOLATOR.NAME),
      violation_category_data: form.getFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME),
      id_number: form.getFieldValue(VIOLATION_FORM.ID_NUMBER.NAME),
      company_name: form.getFieldValue(VIOLATION_FORM.COMPANY_NAME.NAME),
      warning_number: form.getFieldValue(VIOLATION_FORM.WARNING_NO.NAME),
      description: form.getFieldValue(VIOLATION_FORM.DESCRIPTION.NAME),
      action_suggested_by: form.getFieldValue(VIOLATION_FORM.ACTION_SUGGESTED_BY.NAME),
      violation_category: form.getFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY.NAME),
      approved_by: form.getFieldValue(VIOLATION_FORM.APPROVED_BY.NAME),
    }
    await createViolation(payload).then((data) => {
      if (data && data.success) {
        fetchData()
        handleCancel()
      } else {
        message.error(data?.message ? data.message : "failed");
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setLoading(false)
    })
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleViolationCategoryChange = (e) => {
    form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null)
    switch (e) {
      case 'CATEGORY_1':
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null)
        setViolationCategoryData({ title: 'Amount', placeholder: 'Enter the amount', error: 'Please enter amount', required: true })
        break;
      case 'CATEGORY_2':
        setViolationCategoryData({ title: 'Amount', placeholder: 'Enter the amount', error: 'Please enter amount', required: true })
        break;
      case 'CATEGORY_3':
      case 'CATEGORY_4':
        setViolationCategoryData({ title: 'Days', placeholder: 'Enter no of days', error: 'Please enter days', required: true })
        break;
      case 'CATEGORY_5':
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null)
        setViolationCategoryData(null)
        break;
      case 'CATEGORY_6':
        setViolationCategoryData({ title: 'Others', placeholder: 'Enter other reason', error: 'Please enter reason', required: true })
        break;
      default:
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null)
        setViolationCategoryData(null)
        return;
    }
  };



  return (
    <Modal
      open={visible}
      title={<Space align="center" style={{ height: '15px' }}>
        <Avatar src={ICONS.VIOLATION} size={25}></Avatar>
        <Title level={4} style={{ margin: '0px' }}><b>Create Violation</b></Title>
      </Space>}
      closable={false}
      footer={[
        <Popconfirm
          title="Are you sure?"
          description="changes will not be saved"
          onConfirm={handleCancel}
          onCancel={() => { return 0 }}
          okText="Yes"
          cancelText="No"
        >
          <Button type={'default'} disabled={loading}>Cancel</Button>
        </Popconfirm>,
        <Button key="submit" type="primary" onClick={onFinish} loading={loading}>
          {"Create"}
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
          disabled={loading}
        >
          <Row gutter={16} >
            <Col span={8}>
              <Form.Item
                name={VIOLATION_FORM.REPORT_NO.NAME}
                label={VIOLATION_FORM.REPORT_NO.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.REPORT_NO.REQUIRED,
                    message: VIOLATION_FORM.REPORT_NO.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.REPORT_NO.PLACEHOLDER} maxLength={50}></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={VIOLATION_FORM.LOCATION.NAME}
                label={VIOLATION_FORM.LOCATION.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.LOCATION.REQUIRED,
                    message: VIOLATION_FORM.LOCATION.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.LOCATION.PLACEHOLDER} maxLength={80}></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={VIOLATION_FORM.VIOLATION_DATE.NAME}
                label={VIOLATION_FORM.VIOLATION_DATE.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.VIOLATION_DATE.REQUIRED,
                    message: VIOLATION_FORM.VIOLATION_DATE.ERROR_MESSAGE,
                  },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder={VIOLATION_FORM.VIOLATION_DATE.PLACEHOLDER}
                />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16} >
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.NAME_OF_VIOLATOR.NAME}
                label={VIOLATION_FORM.NAME_OF_VIOLATOR.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.NAME_OF_VIOLATOR.REQUIRED,
                    message: VIOLATION_FORM.NAME_OF_VIOLATOR.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.NAME_OF_VIOLATOR.PLACEHOLDER} maxLength={120}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.ID_NUMBER.NAME}
                label={VIOLATION_FORM.ID_NUMBER.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.ID_NUMBER.REQUIRED,
                    message: VIOLATION_FORM.ID_NUMBER.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.ID_NUMBER.PLACEHOLDER} maxLength={50}></Input>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.COMPANY_NAME.NAME}
                label={VIOLATION_FORM.COMPANY_NAME.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.COMPANY_NAME.REQUIRED,
                    message: VIOLATION_FORM.COMPANY_NAME.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.COMPANY_NAME.PLACEHOLDER} maxLength={120}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.WARNING_NO.NAME}
                label={VIOLATION_FORM.WARNING_NO.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.WARNING_NO.REQUIRED,
                    message: VIOLATION_FORM.WARNING_NO.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.WARNING_NO.PLACEHOLDER} maxLength={50}></Input>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} >
            <Col span={24}>
              <Form.Item
                name={VIOLATION_FORM.DESCRIPTION.NAME}
                label={VIOLATION_FORM.DESCRIPTION.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.DESCRIPTION.REQUIRED,
                    message: VIOLATION_FORM.DESCRIPTION.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input.TextArea placeholder={VIOLATION_FORM.DESCRIPTION.PLACEHOLDER} style={{
                  height: 125,
                  resize: 'none',
                }} ></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} >
            <Col span={24}>
              <Form.Item
                name={VIOLATION_FORM.VIOLATION_CATEGORY.NAME}
                label={VIOLATION_FORM.VIOLATION_CATEGORY.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.VIOLATION_CATEGORY.REQUIRED,
                    message: VIOLATION_FORM.VIOLATION_CATEGORY.ERROR_MESSAGE,
                  },
                ]}
              >
                <Select
                  placeholder={VIOLATION_FORM.VIOLATION_CATEGORY.PLACEHOLDER}
                  options={violationCategories}
                  onChange={handleViolationCategoryChange}
                />
              </Form.Item>
            </Col>
          </Row>

          {violationCategoryData ?
            <Row gutter={16} >
              <Col span={24}>
                <Form.Item
                  name={VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME}
                  label={violationCategoryData?.title}
                  rules={[
                    {
                      required: violationCategoryData?.required,
                      message: violationCategoryData?.error,
                    },
                  ]}
                >
                  <Input
                    placeholder={violationCategoryData?.placeholder}
                  />
                </Form.Item>
              </Col>
            </Row> : <></>}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.ACTION_SUGGESTED_BY.NAME}
                label={VIOLATION_FORM.ACTION_SUGGESTED_BY.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.ACTION_SUGGESTED_BY.REQUIRED,
                    message: VIOLATION_FORM.ACTION_SUGGESTED_BY.ERROR_MESSAGE,
                  },
                ]}
              >
                <Select
                  placeholder={VIOLATION_FORM.ACTION_SUGGESTED_BY.PLACEHOLDER}
                  options={getViolationSuggestedBy()}
                />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item
                name={VIOLATION_FORM.PREPARED_BY.NAME}
                label={VIOLATION_FORM.PREPARED_BY.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.PREPARED_BY.REQUIRED,
                    message: VIOLATION_FORM.PREPARED_BY.ERROR_MESSAGE,
                  },
                ]}
              >
                <Input placeholder={VIOLATION_FORM.PREPARED_BY.PLACEHOLDER}></Input>
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item
                name={VIOLATION_FORM.APPROVED_BY.NAME}
                label={VIOLATION_FORM.APPROVED_BY.LABEL}
                rules={[
                  {
                    required: VIOLATION_FORM.APPROVED_BY.REQUIRED,
                    message: VIOLATION_FORM.APPROVED_BY.ERROR_MESSAGE,
                  },
                ]}
              >
                <Select
                  placeholder={VIOLATION_FORM.APPROVED_BY.PLACEHOLDER}
                  options={defaultUsers}
                  optionRender={(option) => (
                    <Space style={{ height: '0px' }}>
                      <span>
                        <Space>
                          <Avatar size={20}>{option.data.avatar}</Avatar>
                          {option.data.label}
                        </Space>
                      </span>
                      {option?.data?.desc && <Tag color="default" bordered={false} style={{ fontSize: '10px' }}>{option?.data?.desc.toUpperCase()}</Tag>}
                    </Space>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ViolationModal;
