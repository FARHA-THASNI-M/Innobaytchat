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
import { ICONS, TASK_FORM } from "../../constants";
import { createTask } from "../../pages/Task/task.service";
import { userDataFormatter } from "../../services";
import DescriptionEditor from "../common/description/DescriptionEditor";
import { getUploadUrl } from "../common/service";
import dayjs from "dayjs";
const { Title } = Typography;
const gutter = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const CreateTaskModal = ({
  visible,
  onCancel,
  project,
  projectUsers,
  categories,
  priorityList,
  phases,
  defaultTaskCategory,
  fetchData,
  parent_task = null,
  title,
  icon
}) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [userDropDown, setUserDropDown] = useState([]);
  const [categoryDropDown, setCategoriesDropDown] = useState([]);
  const [priorityDropDown, setPriorityDropDown] = useState([]);
  const [phaseDropDown, setPhaseDropDown] = useState([]);
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
    setPhaseDropDown(
      phases.map(({ project_phases_id, phase_name }) => ({
        label: phase_name,
        value: project_phases_id,
      }))
    );
    form.setFieldValue(TASK_FORM.PRIORITY.NAME, priorityList[1].key);
    if (defaultTaskCategory) {
      form.setFieldValue(TASK_FORM.CATEGORY.NAME, defaultTaskCategory);
    }
  }, []);

  const onFinish = async () => {
    await form.validateFields();
    setLoading(true);
    const files = [];
    if (fileList && fileList.length) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj;
        const url = await getUrlToUpload(file);
        files.push({
          url,
          type: "task",
          file_type: file.type,
          file_name: file.name
        });
      }
    }
    const payload = {
      project_category_id: form.getFieldValue(TASK_FORM.CATEGORY.NAME),
      parent_task_id: parent_task,
      project_id: project?.project_id,
      task_name: form.getFieldValue(TASK_FORM.SUMMARY.NAME),
      description: description || null,
      phase_id: form.getFieldValue(TASK_FORM.PHASE.NAME) || null,
      task_start_date: form
        .getFieldValue(TASK_FORM.START_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      task_end_date: form
        .getFieldValue(TASK_FORM.END_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      number_of_days: parseInt(form.getFieldValue(TASK_FORM.NO_OF_DAYS.NAME)),
      priority: form.getFieldValue(TASK_FORM.PRIORITY.NAME),
      assigned_to: form.getFieldValue(TASK_FORM.ASSIGNEE.NAME),
      attachments: files,
    };
    createTask(payload)
      .then((data) => {
        if (data && data.success) {
          fetchData();
          handleCancel();
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
    return getUploadUrl({ path })
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
              if (response.status === 200) {
                return path;
              }
            })
            .catch((error) => console.log("error", error));
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue(TASK_FORM.START_DATE.NAME);
    if (!startDate) return null;
    return startDate && current && current <= startDate.startOf("day");
  };
  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue(TASK_FORM.END_DATE.NAME);
    if (!endDate) return null;
    return endDate && current && current >= endDate.startOf("day");
  };
  const onHandleStartDate = (e) => {
    const startDate = form.getFieldValue(TASK_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(TASK_FORM.END_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(TASK_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }

    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(TASK_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };
  const onHandleEndDate = (e) => {
    const startDate = form.getFieldValue(TASK_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(TASK_FORM.END_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(TASK_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }
    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(TASK_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };

  const onHandleNoOfDays = (e) => {
    const numberOfDays = form.getFieldValue(TASK_FORM.NO_OF_DAYS.NAME);
    let startDate = form.getFieldValue(TASK_FORM.START_DATE.NAME);

    if (!startDate) {
      startDate = dayjs();
      form.setFieldValue(TASK_FORM.START_DATE.NAME, startDate);
    } else {
      startDate = dayjs(startDate);
    }
    const endDate = startDate.add(numberOfDays, "day");
    form.setFieldValue(TASK_FORM.END_DATE.NAME, endDate);
  };

  const generateURLForFile = (fileDetails) => {
    return `${project.project_name}/task/${moment().format(
      "DD-MM-YYYY"
    )}/${Date.now()}_${fileDetails?.name}`;
  };

  const handleCancel = () => {
    onCancel();
    setDescription(null);
    setFileList(null);
    form.resetFields();
  };

  //   const getTitle = () => {
  //     if (record) {
  //       return (
  //         <>
  //           <Space align="baseline">
  //             <img src={ICONS.TASK} height={30}></img>
  //             <h3>Edit Task</h3>
  //           </Space>
  //         </>
  //       );
  //     } else {
  //       return (
  //         <Space align="center">
  //           <img src={ICONS.TASK} height={30}></img>
  //           <h3>Create Task</h3>
  //         </Space>
  //       );
  //     }
  //   };
  return (
    <Modal
      open={visible}
      title={
        <Space align="center" style={{ height: "15px" }}>
          <Avatar src={icon} size={25}></Avatar>
          <Title level={4} style={{ margin: "0px" }}>
            <b>{title}</b>
          </Title>
        </Space>
      }
      closable={false}
      // onCancel={handleCancel}
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
        <Form form={form} layout="vertical">
          {phaseDropDown && phaseDropDown.length ? <Form.Item
            name={TASK_FORM.PHASE.NAME}
            label={TASK_FORM.PHASE.LABEL}
            rules={[
              {
                required: false,
                message: TASK_FORM.PHASE.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
              placeholder={TASK_FORM.PHASE.PLACEHOLDER}
              options={phaseDropDown}
            />
          </Form.Item> : <></>}

          <Form.Item
            name={TASK_FORM.CATEGORY.NAME}
            label={TASK_FORM.CATEGORY.LABEL}
            rules={[
              {
                required: TASK_FORM.CATEGORY.REQUIRED,
                message: TASK_FORM.CATEGORY.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
              placeholder={TASK_FORM.CATEGORY.PLACEHOLDER}
              options={categoryDropDown}
              disabled={parent_task ? true : false}
            />
          </Form.Item>
          <Form.Item
            name={TASK_FORM.SUMMARY.NAME}
            label={TASK_FORM.SUMMARY.LABEL}
            rules={[
              {
                required: TASK_FORM.SUMMARY.REQUIRED,
                message: TASK_FORM.SUMMARY.ERROR_MESSAGE,
              },
            ]}
          >
            <Input maxLength={250} />
          </Form.Item>
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
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
              placeholder={TASK_FORM.PRIORITY.PLACEHOLDER}
              options={priorityDropDown}
            />
          </Form.Item>
          <Form.Item
            name={TASK_FORM.DESCRIPTION.NAME}
            label={TASK_FORM.DESCRIPTION.LABEL}
            rules={[
              {
                required: false,
                message: TASK_FORM.DESCRIPTION.ERROR_MESSAGE,
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
                name={TASK_FORM.START_DATE.NAME}
                label={TASK_FORM.START_DATE.LABEL}
                rules={[
                  {
                    required: TASK_FORM.START_DATE.REQUIRED,
                    message: TASK_FORM.START_DATE.ERROR_MESSAGE,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledStartDate}
                  onChange={onHandleStartDate}
                  placeholder={TASK_FORM.START_DATE.PLACEHOLDER}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                name={TASK_FORM.END_DATE.NAME}
                label={TASK_FORM.END_DATE.LABEL}
                rules={[
                  {
                    required: TASK_FORM.END_DATE.REQUIRED,
                    message: TASK_FORM.END_DATE.ERROR_MESSAGE,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledEndDate}
                  onChange={onHandleEndDate}
                  placeholder={TASK_FORM.END_DATE.PLACEHOLDER}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                name={TASK_FORM.NO_OF_DAYS.NAME}
                label={TASK_FORM.NO_OF_DAYS.LABEL}
                rules={[
                  {
                    required: TASK_FORM.NO_OF_DAYS.REQUIRED,
                    message: TASK_FORM.NO_OF_DAYS.ERROR_MESSAGE,
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
                  placeholder={TASK_FORM.NO_OF_DAYS.PLACEHOLDER}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name={TASK_FORM.ASSIGNEE.NAME}
            label={TASK_FORM.ASSIGNEE.LABEL}
            rules={[
              {
                required: TASK_FORM.ASSIGNEE.REQUIRED,
                message: TASK_FORM.ASSIGNEE.ERROR_MESSAGE,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
              placeholder={TASK_FORM.ASSIGNEE.PLACEHOLDER}
              options={userDropDown}
              optionRender={(option) => (
                <Space key={option.data.key}>
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

export default CreateTaskModal;
