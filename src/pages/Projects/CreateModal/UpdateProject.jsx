import {
  Avatar,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PROJECT_FORM } from "../../../constants";
import { getUsersData } from "../../../services";
import { getAllSubCategories, updateProject } from "../project.service";

const UpdateProject = ({
  editProject,
  setEditProject,
  project_id,
  fetch,
  project,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [usersDropdown, setUsersDropdown] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);

  useEffect(() => {
    userList();
    categoryList();
    const projectMembers = project?.projectMembers?.map(
      ({ user_id }) => user_id
    );
    const categories = project?.projectCategories?.map(
      ({ category_id }) => category_id
    );
    form.setFieldsValue({
      [PROJECT_FORM.PROJECT_NAME.NAME]: project?.project_name,
      [PROJECT_FORM.START_DATE.NAME]: dayjs(
        project?.project_start_date,
        "YYYY-MM-DD"
      ),
      [PROJECT_FORM.END_DATE.NAME]: dayjs(
        project?.project_end_date,
        "YYYY-MM-DD"
      ),
      [PROJECT_FORM.NO_OF_DAYS.NAME]: project?.number_of_days,
      [PROJECT_FORM.DESCRIPTION.NAME]: project?.description,
      [PROJECT_FORM.PROJECT_MANAGER.NAME]: project?.project_manager,
      [PROJECT_FORM.PROJECT_COORDINATOR.NAME]: project?.project_coordinator,
      [PROJECT_FORM.JOINERY_MANAGER.NAME]: project?.joinery_manager,
      [PROJECT_FORM.MEP_MANAGER.NAME]: project?.mep_manager,
      [PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME]: projectMembers,
      [PROJECT_FORM.CATEGORY.NAME]: categories,
    });
  }, []);

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue(PROJECT_FORM.START_DATE.NAME);
    if (!startDate) return null;
    return startDate && current && current <= startDate.startOf("day");
  };
  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue(PROJECT_FORM.END_DATE.NAME);
    if (!endDate) return null;
    return endDate && current && current >= endDate.startOf("day");
  };
  const onHandleStartDate = (e) => {
    const startDate = form.getFieldValue(PROJECT_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(PROJECT_FORM.END_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }

    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };
  const onHandleEndDate = (e) => {
    const startDate = form.getFieldValue(PROJECT_FORM.START_DATE.NAME);
    const endDate = form.getFieldValue(PROJECT_FORM.END_DATE.NAME);

    if (!startDate || !endDate) {
      form.setFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME, 0);
      return null;
    }
    const differenceInMs = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMs / millisecondsPerDay);
    form.setFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME, numberOfDays);
  };

  const onHandleNoOfDays = (e) => {
    const numberOfDays = form.getFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME);
    let startDate = form.getFieldValue(PROJECT_FORM.START_DATE.NAME);

    if (!startDate) {
      startDate = dayjs();
      form.setFieldValue(PROJECT_FORM.START_DATE.NAME, startDate);
    } else {
      startDate = dayjs(startDate);
    }
    const endDate = startDate.add(numberOfDays, "day");
    form.setFieldValue(PROJECT_FORM.END_DATE.NAME, endDate);
  };
  const userList = async () => {
    const users = await getUsersData();
    setUsersDropdown(users);
  };

  const categoryList = async () => {
    getAllSubCategories()
      .then((data) => {
        if (data && data.success) {
          const categories = data.data.map(
            ({ category_name, category_id }) => ({
              label: category_name,
              value: category_id,
            })
          );
          setCategoryDropdown(categories);
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

  const handleOk = async () => {
    await form.validateFields();
    if (form.getFieldValue(PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME).includes(form.getFieldValue(PROJECT_FORM.MEP_MANAGER.NAME))) {
      return message.error("Mep manager cannot be in team member");
    }
    if (form.getFieldValue(PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME).includes(form.getFieldValue(PROJECT_FORM.JOINERY_MANAGER.NAME))) {
      return message.error("Joinery manager cannot be in team member");
    }
    if (form.getFieldValue(PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME).includes(form.getFieldValue(PROJECT_FORM.PROJECT_COORDINATOR.NAME))) {
      return message.error("Project coordinator cannot be in team member");
    }
    if (form.getFieldValue(PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME).includes(form.getFieldValue(PROJECT_FORM.PROJECT_MANAGER.NAME))) {
      return message.error("Project manager cannot be in team member");
    }
    setLoading(true);
    const payload = {
      project_name: form.getFieldValue(PROJECT_FORM.PROJECT_NAME.NAME),
      categories: form.getFieldValue(PROJECT_FORM.CATEGORY.NAME),
      project_coordinator: form.getFieldValue(
        PROJECT_FORM.PROJECT_COORDINATOR.NAME
      ),
      project_manager: form.getFieldValue(PROJECT_FORM.PROJECT_MANAGER.NAME),
      mep_manager: form.getFieldValue(PROJECT_FORM.MEP_MANAGER.NAME),
      joinery_manager: form.getFieldValue(PROJECT_FORM.JOINERY_MANAGER.NAME),
      project_start_date: form
        .getFieldValue(PROJECT_FORM.START_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      project_end_date: form
        .getFieldValue(PROJECT_FORM.END_DATE.NAME)
        ?.format("YYYY-MM-DD"),
      number_of_days: parseInt(
        form.getFieldValue(PROJECT_FORM.NO_OF_DAYS.NAME)
      ),
      description: form.getFieldValue(PROJECT_FORM.DESCRIPTION.NAME),
      project_members: {
        users: form.getFieldValue(PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME),
      },
    };
    updateProject(project_id, payload)
      .then((data) => {
        if (data && data.success) {
          fetch();
          handleClose();
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
  const handleClose = () => {
    form.resetFields();
    setEditProject(false);
  };
  return (
    <Modal
      title="Edit Project"
      open={editProject}
      onCancel={handleClose}
      onOk={handleOk}
      okText="Update"
      cancelText="Cancel"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      closeIcon={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          items: [{}],
        }}
        disabled={loading}
        style={{ maxHeight: "600px", overflow: "scroll", overflowX: "hidden" }}
      >
        <Form.Item
          name={PROJECT_FORM.PROJECT_NAME.NAME}
          label={PROJECT_FORM.PROJECT_NAME.LABEL}
          rules={[
            {
              required: PROJECT_FORM.PROJECT_NAME.REQUIRED,
              message: PROJECT_FORM.PROJECT_NAME.ERROR_MESSAGE,
            },
          ]}
        >
          <Input
            placeholder={PROJECT_FORM.PROJECT_NAME.PLACEHOLDER}
            maxLength={PROJECT_FORM.PROJECT_NAME.MAX}
          />
        </Form.Item>
        <Form.Item
          name={PROJECT_FORM.MEP_MANAGER.NAME}
          label={PROJECT_FORM.MEP_MANAGER.LABEL}
          rules={[
            {
              required: PROJECT_FORM.MEP_MANAGER.REQUIRED,
              message: PROJECT_FORM.MEP_MANAGER.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
            placeholder={PROJECT_FORM.MEP_MANAGER.PLACEHOLDER}
            options={usersDropdown}
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

        <Form.Item
          name={PROJECT_FORM.JOINERY_MANAGER.NAME}
          label={PROJECT_FORM.JOINERY_MANAGER.LABEL}
          rules={[
            {
              required: PROJECT_FORM.JOINERY_MANAGER.REQUIRED,
              message: PROJECT_FORM.JOINERY_MANAGER.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
            placeholder={PROJECT_FORM.JOINERY_MANAGER.PLACEHOLDER}
            options={usersDropdown}
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

        <Form.Item
          name={PROJECT_FORM.START_DATE.NAME}
          label={PROJECT_FORM.START_DATE.LABEL}
          rules={[
            {
              required: PROJECT_FORM.START_DATE.REQUIRED,
              message: PROJECT_FORM.START_DATE.ERROR_MESSAGE,
            },
          ]}
        >
          <DatePicker
            disabledDate={disabledStartDate}
            onChange={onHandleStartDate}
            placeholder={PROJECT_FORM.START_DATE.PLACEHOLDER}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name={PROJECT_FORM.END_DATE.NAME}
          label={PROJECT_FORM.END_DATE.LABEL}
          rules={[
            {
              required: PROJECT_FORM.END_DATE.REQUIRED,
              message: PROJECT_FORM.END_DATE.ERROR_MESSAGE,
            },
          ]}
        >
          <DatePicker
            disabledDate={disabledEndDate}
            onChange={onHandleEndDate}
            placeholder={PROJECT_FORM.END_DATE.PLACEHOLDER}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name={PROJECT_FORM.NO_OF_DAYS.NAME}
          label={PROJECT_FORM.NO_OF_DAYS.LABEL}
          rules={[
            {
              required: PROJECT_FORM.NO_OF_DAYS.REQUIRED,
              message: PROJECT_FORM.NO_OF_DAYS.ERROR_MESSAGE,
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
            placeholder={PROJECT_FORM.NO_OF_DAYS.PLACEHOLDER}
          />
        </Form.Item>

        <Form.Item
          name={PROJECT_FORM.DESCRIPTION.NAME}
          label={PROJECT_FORM.DESCRIPTION.LABEL}
          rules={[
            {
              required: PROJECT_FORM.DESCRIPTION.REQUIRED,
              message: PROJECT_FORM.DESCRIPTION.ERROR_MESSAGE,
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
            placeholder={PROJECT_FORM.DESCRIPTION.PLACEHOLDER}
            maxLength={PROJECT_FORM.DESCRIPTION.MAX}
          />
        </Form.Item>

        <Form.Item
          name={PROJECT_FORM.PROJECT_MANAGER.NAME}
          label={PROJECT_FORM.PROJECT_MANAGER.LABEL}
          rules={[
            {
              required: PROJECT_FORM.PROJECT_MANAGER.REQUIRED,
              message: PROJECT_FORM.PROJECT_MANAGER.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
            placeholder={PROJECT_FORM.PROJECT_MANAGER.PLACEHOLDER}
            options={usersDropdown}
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

        <Form.Item
          name={PROJECT_FORM.PROJECT_COORDINATOR.NAME}
          label={PROJECT_FORM.PROJECT_COORDINATOR.LABEL}
          rules={[
            {
              required: PROJECT_FORM.PROJECT_COORDINATOR.REQUIRED,
              message: PROJECT_FORM.PROJECT_COORDINATOR.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
            placeholder={PROJECT_FORM.PROJECT_COORDINATOR.PLACEHOLDER}
            options={usersDropdown}
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

        <Form.Item
          name={PROJECT_FORM.CATEGORY.NAME}
          label={PROJECT_FORM.CATEGORY.LABEL}
          rules={[
            {
              required: PROJECT_FORM.CATEGORY.REQUIRED,
              message: PROJECT_FORM.CATEGORY.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            // allowClear
            mode="multiple"
            placeholder={PROJECT_FORM.CATEGORY.PLACEHOLDER}
            options={categoryDropdown}
          />
        </Form.Item>

        <Form.Item
          name={PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME}
          label={PROJECT_FORM.PROJECT_TEAM_MEMBERS.LABEL}
          rules={[
            {
              required: PROJECT_FORM.PROJECT_TEAM_MEMBERS.REQUIRED,
              message: PROJECT_FORM.PROJECT_TEAM_MEMBERS.ERROR_MESSAGE,
            },
          ]}
        >
          <Select
            // allowClear
            mode="multiple"
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
            placeholder={PROJECT_FORM.PROJECT_TEAM_MEMBERS.PLACEHOLDER}
            options={usersDropdown}
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
    </Modal>
  );
};
export default UpdateProject;
