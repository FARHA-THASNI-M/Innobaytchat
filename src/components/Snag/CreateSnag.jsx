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
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ICONS, SNAG_FORM } from "../../constants";
import { createSnag, createTask } from "../../pages/Task/task.service";
import { userDataFormatter } from "../../services";
import DescriptionEditor from "../common/description/DescriptionEditor";
import { getUploadUrl } from "../common/service";
const { Title } = Typography;
const gutter = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const TYPE = "snag";
const CreateSnagModal = ({
  visible,
  onCancel,
  project,
  projectUsers,
  categories,
  priorityList,
  fetchData,
}) => {
  const [form] = Form.useForm();

  const [description, setDescription] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [userDropDown, setUserDropDown] = useState([]);
  const [categoryDropDown, setCategoriesDropDown] = useState([]);
  const [priorityDropDown, setPriorityDropDown] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserDropDown(userDataFormatter(projectUsers));
    setCategoriesDropDown(
      categories.map(({ ref_category }) => ({
        label: ref_category?.category_name,
        value: ref_category?.category_id,
      }))
    );
    setPriorityDropDown(
      priorityList.map(({ key, value }) => ({ label: value, value: key }))
    );
    form.setFieldValue(SNAG_FORM.PRIORITY.NAME, priorityList[1].key);
  }, []);

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue(SNAG_FORM.START_DATE.NAME);
    if (!startDate) return null;
    return startDate && current && current <= startDate.startOf("day");
  };
  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue(SNAG_FORM.DUE_DATE.NAME);
    if (!endDate) return null;
    return endDate && current && current >= endDate.startOf("day");
  };
  const onHandleStartDate = (e) => {
    const startDate = form.getFieldValue(SNAG_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(SNAG_FORM.DUE_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(SNAG_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }

    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(SNAG_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };
  const onHandleEndDate = (e) => {
    const startDate = form.getFieldValue(SNAG_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(SNAG_FORM.DUE_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(SNAG_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }
    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(SNAG_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };

  const onHandleNoOfDays = (e) => {
    const numberOfDays = form.getFieldValue(SNAG_FORM.NO_OF_DAYS.NAME);
    let startDate = form.getFieldValue(SNAG_FORM.START_DATE.NAME);

    if (!startDate) {
      startDate = dayjs();
      form.setFieldValue(SNAG_FORM.START_DATE.NAME, startDate);
    } else {
      startDate = dayjs(startDate);
    }
    const endDate = startDate.add(numberOfDays, "day");
    form.setFieldValue(SNAG_FORM.DUE_DATE.NAME, endDate);
  };

  const onFinish = async () => {
    await form.validateFields();
    setLoading(true);
    const files = [];
    if (fileList && fileList.length) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj;
        const url = await getUrlToUpload(file);
        console.log(url);
        if (url) {
          files.push({
            url,
            type: TYPE,
            file_name: file.name,
            file_type: file.type,
          });
        }
      }
    }
    const payload = {
      project_category_id: form.getFieldValue(SNAG_FORM.CATEGORY.NAME),
      project_id: project?.project_id,
      snag_name: form.getFieldValue(SNAG_FORM.SUMMARY.NAME),
      description: description,
      start_date: form
        .getFieldValue(SNAG_FORM.START_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      due_date: form
        .getFieldValue(SNAG_FORM.DUE_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      number_of_days: parseInt(form.getFieldValue(SNAG_FORM.NO_OF_DAYS.NAME)),
      priority: form.getFieldValue(SNAG_FORM.PRIORITY.NAME),
      assigned_to: form.getFieldValue(SNAG_FORM.ASSIGNEE.NAME),
      attachments: files,
    };
    await createSnag(payload)
      .then((data) => {
        if (data && data.success) {
          handleCancel();
          fetchData();
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUrlToUpload = async (file) => {
    const path = generateURLForFile(file);
    return await getUploadUrl({ path })
      .then((data) => {
        if (data.success) {
          const { url } = data.data;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", file?.type);
          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: file,
          };
          return fetch(url, requestOptions)
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                return path;
              } else {
                return null;
              }
            })
            .catch((error) => {
              message.error(error?.message ? error.message : "failed");
            });
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

  const generateURLForFile = (fileDetails) => {
    return `${project.project_name}/${TYPE}/${moment().format(
      "DD-MM-YYYY"
    )}/${Date.now()}_${fileDetails?.name}`;
  };

  const handleCancel = () => {
    setDescription(null);
    setFileList(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={visible}
      title={
        <Space align="center" style={{ height: "15px" }}>
          <Avatar src={ICONS.SNAG} size={25}></Avatar>
          <Title level={4} style={{ margin: "0px" }}>
            <b>Create Snag</b>
          </Title>
        </Space>
      }
      closable={false}
      footer={[
        <Popconfirm
          title="Are you sure?"
          description="changes will not be saved"
          onConfirm={handleCancel}
          onCancel={() => {
            return 0;
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type={"default"} disabled={loading}>
            Cancel
          </Button>
        </Popconfirm>,
        <Button
          htmlType="submit"
          type="primary"
          onClick={onFinish}
          loading={loading}
        >
          {"Create"}
        </Button>,
      ]}
      width={800}
    >
      <div
        style={{ maxHeight: "600px", overflow: "scroll", overflowX: "hidden" }}
      >
        <Form form={form} layout="vertical" disabled={loading}>
          <Form.Item
            name={SNAG_FORM.CATEGORY.NAME}
            label={SNAG_FORM.CATEGORY.LABEL}
            rules={[
              {
                required: SNAG_FORM.CATEGORY.REQUIRED,
                message: SNAG_FORM.CATEGORY.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={SNAG_FORM.CATEGORY.PLACEHOLDER}
              filterOption={(input, option) =>
                (option?.label?.toLowerCase() ?? "").includes(
                  input?.toLocaleLowerCase()
                )
              }
              options={categoryDropDown}
            />
          </Form.Item>
          <Form.Item
            name={SNAG_FORM.SUMMARY.NAME}
            label={SNAG_FORM.SUMMARY.LABEL}
            rules={[
              {
                required: SNAG_FORM.SUMMARY.REQUIRED,
                message: SNAG_FORM.SUMMARY.ERROR_MESSAGE,
              },
            ]}
          >
            <Input maxLength={250} />
          </Form.Item>
          <Form.Item
            name={SNAG_FORM.PRIORITY.NAME}
            label={SNAG_FORM.PRIORITY.LABEL}
            rules={[
              {
                required: SNAG_FORM.PRIORITY.REQUIRED,
                message: SNAG_FORM.PRIORITY.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              placeholder={SNAG_FORM.PRIORITY.PLACEHOLDER}
              options={priorityDropDown}
            />
          </Form.Item>
          <Form.Item
            name={SNAG_FORM.DESCRIPTION.NAME}
            label={SNAG_FORM.DESCRIPTION.LABEL}
            rules={[
              {
                required: false,
                message: SNAG_FORM.DESCRIPTION.ERROR_MESSAGE,
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
          <Row gutter={gutter}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                name={SNAG_FORM.START_DATE.NAME}
                label={SNAG_FORM.START_DATE.LABEL}
                rules={[
                  {
                    required: SNAG_FORM.START_DATE.REQUIRED,
                    message: SNAG_FORM.START_DATE.ERROR_MESSAGE,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledStartDate}
                  onChange={onHandleStartDate}
                  placeholder={SNAG_FORM.START_DATE.PLACEHOLDER}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                name={SNAG_FORM.DUE_DATE.NAME}
                label={SNAG_FORM.DUE_DATE.LABEL}
                rules={[
                  {
                    required: SNAG_FORM.DUE_DATE.REQUIRED,
                    message: SNAG_FORM.DUE_DATE.ERROR_MESSAGE,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledEndDate}
                  onChange={onHandleEndDate}
                  placeholder={SNAG_FORM.DUE_DATE.PLACEHOLDER}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                name={SNAG_FORM.NO_OF_DAYS.NAME}
                label={SNAG_FORM.NO_OF_DAYS.LABEL}
                rules={[
                  {
                    required: SNAG_FORM.NO_OF_DAYS.REQUIRED,
                    message: SNAG_FORM.NO_OF_DAYS.ERROR_MESSAGE,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || parseFloat(value) >= 1) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("No of days should be greater than 0")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  onChange={onHandleNoOfDays}
                  type="number"
                  placeholder={SNAG_FORM.NO_OF_DAYS.PLACEHOLDER}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name={SNAG_FORM.ASSIGNEE.NAME}
            label={SNAG_FORM.ASSIGNEE.LABEL}
            rules={[
              {
                required: SNAG_FORM.ASSIGNEE.REQUIRED,
                message: SNAG_FORM.ASSIGNEE.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={SNAG_FORM.ASSIGNEE.PLACEHOLDER}
              filterOption={(input, option) =>
                (option?.label?.toLowerCase() ?? "").includes(
                  input?.toLocaleLowerCase()
                )
              }
              options={userDropDown}
              optionRender={(option) => (
                <Space>
                  <span>
                    <Space>
                      <Avatar size={20}>{option.data.avatar}</Avatar>
                      {option.data.label}
                    </Space>
                  </span>
                  {option?.data?.desc && (
                    <Tag
                      color="default"
                      bordered={false}
                      style={{ fontSize: "10px" }}
                    >
                      {option?.data?.desc.toUpperCase()}
                    </Tag>
                  )}
                </Space>
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateSnagModal;
