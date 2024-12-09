import {
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DAYS_OF_WEEK,
  MEETING_MODEL_TITLE,
  MILESTONE_OPTIONS,
  PROJECT_FORM,
  ROUTES,
} from "../../../constants";
import { getLookup, getUsersData, getUsersEmailDropDown } from "../../../services";
import styles from "../../../styles/_createProject.module.css";
import {
  createProject,
  getCategoriesList,
  getDefaultUsersList,
} from "../project.service";
import moment from "moment";
const { TextArea } = Input;
const gutter = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};
const MAX_MILESTONES = 10;

dayjs.locale("en");

const DATE_FORMAT = "YYYY-MM-DD"
const TIME_FORMAT = "HH:mm"

function CreateProject() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelTitle, setmodelTitle] = useState(MEETING_MODEL_TITLE[0]);
  const [usersDropdown, setUsersDropdown] = useState([]);
  const [defaultUsers, setDefaultUsers] = useState([]);
  const [usersEmail, setUsersEmail] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const { RECURRENCE_TYPE = [] } = getLookup();
  const [loading, setLoading] = useState(false);
  const [createform, setcreateform] = useState({
    project_number: "",
    project_name: "",
    categories: [],
    mep_manager: "",
    joinery_manager: "",
    project_start_date: "",
    project_end_date: "",
    no_of_days: 0,
    project_manager: "",
    project_coordinator: "",
    // description: "",
    default_team_members: [],
    new_team_members: "",
    new_team_members_result: [],
    milestoneselect: "Option 2",
    milestone_result: [],
    milestone_name: "",
    milestone_value: "",
    emails_result: [],
    emails: "",
    phases_result: [],
    phases: "",
    calenderobjects: [],
  });
  const initialCalender = {
    meeting_name: "",
    start_date: moment().format(DATE_FORMAT),
    end_date: moment().format(DATE_FORMAT),
    start_time: "12:00",
    end_time: "12:00",
    description: "",
    recurrence: RECURRENCE_TYPE[0]?.key, // Do no repeat
    meeting_every: "",
    meeting_weekly: [],
    meeting_monthly_date_check: true,
    meeting_monthly_date: "1",
    meeting_monthly_dow_check: false,
    meeting_monthly_occurence: "",
    meeting_monthly_dow: "",
  }
  const [calenderfrom, setcalenderfrom] = useState(initialCalender);

  const {
    project_number,
    project_name,
    categories,
    mep_manager,
    joinery_manager,
    project_start_date,
    project_end_date,
    no_of_days,
    project_manager,
    project_coordinator,
    // description,
    default_team_members,
    new_team_members,
    new_team_members_result,
    milestoneselect,
    milestone_result,
    milestone_name,
    milestone_value,
    emails_result,
    emails,
    phases_result,
    phases,
    calenderobjects,
  } = createform;

  const {
    meeting_name,
    start_date,
    end_date,
    start_time,
    end_time,
    description,
    recurrence,
    meeting_every,
    meeting_weekly,
    meeting_monthly_date_check,
    meeting_monthly_date,
    meeting_monthly_occurence,
    meeting_monthly_dow_check,
    meeting_monthly_dow,
  } = calenderfrom;

  const [mileStones, setMileStones] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [phaseList, setPhaseList] = useState([]);
  const [meetingList, setMeetingList] = useState([]);
  const [isMilestonePercentageShow, setIsMilestonePercentageShow] =
    useState(true);
  useEffect(() => {
    form.setFieldValue(PROJECT_FORM.MILESTONE.NAME, true);
    userList();
    defaultUserList();
    usersEmailListing();
    categoriesList();
  }, []);

  const userList = async () => {
    const users = await getUsersData();
    setUsersDropdown(users);

  };
  const usersEmailListing = async () => {
    const userEmails = await getUsersEmailDropDown();
    setUsersEmail(userEmails);
  }

  const defaultUserList = () => {
    getDefaultUsersList().then((data) => {
      if (data.success) {
        setDefaultUsers(data?.data);
      }
    });
  };
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

  const categoriesList = () => {
    getCategoriesList().then((data) => {
      if (data.success) {
        const categories = data.data
          .filter((category) => category.parent_id === null)
          .map((category) => {
            const subcategories = data.data
              .filter(
                (subcategory) => subcategory.parent_id === category.category_id
              )
              .map((subcategory) => ({
                label: subcategory.category_name,
                value: subcategory.category_id,
              }));
            return {
              label: category.category_name,
              title: category.category_name,
              options: subcategories,
            };
          });
        setCategoryDropdown(categories);
      }
    });
  };

  const onInputTextChangeHandler = (e) =>
    setcreateform({ ...createform, [e.target.name]: e.target.value });

  const onInputTextChangeHandlerCalender = (e) =>
    setcalenderfrom({ ...calenderfrom, [e.target.name]: e.target.value });

  const handleChange = (value, type) => {
    if (type === "categories") {
      setcreateform({ ...createform, categories: value });
    } else if (type === "mep_manager") {
      setcreateform({ ...createform, mep_manager: value });
    } else if (type === "joinery_manager") {
      setcreateform({ ...createform, joinery_manager: value });
    } else if (type === "project_manager") {
      setcreateform({ ...createform, project_manager: value });
    } else if (type === "project_coordinator") {
      setcreateform({ ...createform, project_coordinator: value });
    } else if (type === "new_team_members") {
      setcreateform({ ...createform, new_team_members: value });
    } else if (type === "milestoneselect") {
      setcreateform({ ...createform, milestoneselect: value });
    } else if (type === "recurrence") {
      setcalenderfrom({ ...calenderfrom, recurrence: value });
    } else if (type === "meeting_monthly_date") {
      setcalenderfrom({ ...calenderfrom, meeting_monthly_date: value });
    } else if (type === "meeting_monthly_occurence") {
      setcalenderfrom({ ...calenderfrom, meeting_monthly_occurence: value });
    } else if (type === "meeting_monthly_dow") {
      setcalenderfrom({ ...calenderfrom, meeting_monthly_dow: value });
    }
  };

  const onSearch = (value) => {
    // console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleOnCancelClick = (value) => {
    console.log(value);
  };

  const showModal = (param, name) => {
    setmodelTitle(param);
    if (param === MEETING_MODEL_TITLE[1]) {
      setcalenderfrom(
        ...calenderobjects.filter((item) => item.meeting_name === name)
      );
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (meeting_name === "") return;
    // add items to array
    if (
      modelTitle === MEETING_MODEL_TITLE[0] &&
      calenderobjects.filter(
        (item) => item.meeting_name === calenderfrom.meeting_name
      ).length === 0
    ) {
      setcreateform({
        ...createform,
        calenderobjects: [...calenderobjects, calenderfrom],
      });
    } else if (
      modelTitle === MEETING_MODEL_TITLE[1] &&
      calenderobjects.filter(
        (item) => item.meeting_name === calenderfrom.meeting_name
      ).length === 1
    ) {
      setcreateform({
        ...createform,
        calenderobjects: [
          ...calenderobjects.filter(
            (item) => item.meeting_name !== calenderfrom.meeting_name
          ),
          calenderfrom,
        ],
      });
    }
    // clear the form
    setcalenderfrom(initialCalender);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setcalenderfrom(initialCalender);
  };

  const onChangeDate = (date, dateString, type) => {
    if (type === "project_start_date") {
      setcreateform({ ...createform, project_start_date: dateString });
    } else if (type === "project_end_date") {
      setcreateform({ ...createform, project_end_date: dateString });
    } else if (type === "start_date") {
      setcalenderfrom({ ...calenderfrom, start_date: dateString });
    } else if (type === "end_date") {
      setcalenderfrom({ ...calenderfrom, end_date: dateString });
    }
  };

  const onChangeTime = (time, timeString, type) => {
    if (type === "start_time") {
      setcalenderfrom({ ...calenderfrom, start_time: timeString });
    } else if (type === "end_time") {
      setcalenderfrom({ ...calenderfrom, end_time: timeString });
    }
  };

  const onhandleAddEvent = (value, type) => {
    if (value.trim() == "") return;
    if (
      type === "new_team_members" &&
      !new_team_members_result.includes(value)
    ) {
      // (id,name,image_url)
      setcreateform({
        ...createform,
        new_team_members: "",
        new_team_members_result: [...new_team_members_result, value],
      });
    } else if (type === "emails" && !emails_result.includes(value)) {
      setcreateform({
        ...createform,
        emails: "",
        emails_result: [...emails_result, value],
      });
    } else if (type === "phases" && !phases_result.includes(value)) {
      setcreateform({
        ...createform,
        phases: "",
        phases_result: [...phases_result, value],
      });
    }
  };

  const onhandleAddMilestone = (milestone_name, milestone_value, type) => {
    if (milestone_name.trim() == "") return;
    if (
      type === "milestone" &&
      milestone_result.filter((item) => item.name === milestone_name).length ===
      0
    ) {
      // {name,value}
      setcreateform({
        ...createform,
        milestone_result: [
          ...milestone_result,
          { name: milestone_name, value: milestone_value || 0 },
        ],
      });
    }
  };

  const onhandleCancelEvent = (value, type) => {
    if (value.trim() == "") return;

    if (type === "new_team_members") {
      setcreateform({
        ...createform,
        new_team_members_result: [
          ...new_team_members_result.filter((item) => item !== value),
        ],
      });
    } else if (type === "emails") {
      setcreateform({
        ...createform,
        emails_result: [...emails_result.filter((item) => item !== value)],
      });
    } else if (type === "phases") {
      setcreateform({
        ...createform,
        phases_result: [...phases_result.filter((item) => item !== value)],
      });
    } else if (type === "milestone") {
      setcreateform({
        ...createform,
        milestone_result: [
          ...milestone_result.filter((item) => item.name !== value),
        ],
      });
    } else if (type === "create_meetings") {
      setcreateform({
        ...createform,
        calenderobjects: [
          ...calenderobjects.filter((item) => item.meeting_name !== value),
        ],
      });
    }
  };

  const onWeeklyCheckChange = (e, value) => {
    if (e.target.checked) {
      //add
      setcalenderfrom({
        ...calenderfrom,
        meeting_weekly: [...meeting_weekly, value],
      });
    } else {
      //remove
      setcalenderfrom({
        ...calenderfrom,
        meeting_weekly: [...meeting_weekly.filter((item) => item !== value)],
      });
    }
  };

  const onMonthlyCheckChange = (e, value) => {
    //add
    if (value === "day_field" && e.target.checked) {
      setcalenderfrom({
        ...calenderfrom,
        meeting_monthly_dow_check: true,
        meeting_monthly_date_check: false,
      });
    } else {
      setcalenderfrom({
        ...calenderfrom,
        meeting_monthly_dow_check: false,
        meeting_monthly_date_check: true,
      });
    }
  };

  const onFinish = async () => {
    try {
      await form.validateFields();
      if (form.getFieldValue("team_members").includes(form.getFieldValue("mep_manager"))) {
        return message.error("Mep manager cannot be in team member");
      }
      if (form.getFieldValue("team_members").includes(form.getFieldValue("joinery_manager"))) {
        return message.error("Joinery manager cannot be in team member");
      }
      if (form.getFieldValue("team_members").includes(form.getFieldValue("project_coordinator"))) {
        return message.error("Project coordinator cannot be in team member");
      }
      if (form.getFieldValue("team_members").includes(form.getFieldValue("project_manager"))) {
        return message.error("Project manager cannot be in team member");
      }

      const payload = {
        project_number: form.getFieldValue("project_number"),
        project_name: form.getFieldValue("project_name"),
        categories: form.getFieldValue("category"),
        mep_manager: form.getFieldValue("mep_manager"),
        joinery_manager: form.getFieldValue("joinery_manager"),
        project_manager: form.getFieldValue("project_manager"),
        project_coordinator: form.getFieldValue("project_coordinator"),
        project_start_date: form
          .getFieldValue("start_date")
          ?.format(DATE_FORMAT),
        project_end_date: form.getFieldValue("end_date")?.format(DATE_FORMAT),
        number_of_days: parseInt(form.getFieldValue("number_of_days")),
        description: form.getFieldValue("description"),
        project_members: {
          users: form.getFieldValue("team_members"),
        },
        project_meeting: formatProjectMeeting(),
        project_members_email: {
          emails: emailList,
        },
        is_percentage: form.getFieldValue("is_percentage"),
        project_milestone: {
          milestone: mileStones,
        },
        project_phases: {
          phase_name: phaseList,
        },
      };
      setLoading(true);
      createProject(payload)
        .then((data) => {
          if (data && data.success) {
            const result = data.data;
            console.log(result);
            navigate(`${ROUTES.PROJECTS.PATH}`);
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
    } catch (error) {
      console.log(error)
      if (error?.errorFields && error?.errorFields?.length) {
        return
      } else {
        message.error(error?.message ? error.message : "failed");
      }
    }
  };

  const formatProjectMeeting = () => {
    let data = []
    calenderobjects.map((x) => data.push({
      start_date: x.start_date,
      end_date: x.end_date,
      start_time: x.start_time,
      end_time: x.end_time,
      recurrence: x.recurrence,
      recurrence_rule: x.meeting_weekly?.join(','),
      description: x.description,
      meeting_name: x.meeting_name
    }))
    return { project_meeting: data };
  }

  function isMileStoneAlreadyExists(name, miles) {
    return miles.some((milestone) => milestone.name === name.toString());
  }
  const handleAddMilestones = async () => {
    try {
      if (isMilestonePercentageShow) {
        await form.validateFields([
          PROJECT_FORM.MILESTONE_NAME.NAME,
          PROJECT_FORM.MILESTONE_PERCENTAGE.NAME,
        ]);
      } else {
        await form.validateFields([PROJECT_FORM.MILESTONE_NAME.NAME]);
      }
      if (form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME)) {
        setMileStones((pervious) => [
          ...pervious,
          {
            name: form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME),
            percentage:
              form.getFieldValue(PROJECT_FORM.MILESTONE_PERCENTAGE.NAME) || 0,
          },
        ]);
      }
      form.setFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME, "");
      form.setFieldValue(PROJECT_FORM.MILESTONE_PERCENTAGE.NAME, 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMileStones = async (index) => {
    try {
      setMileStones((prevMilestones) =>
        prevMilestones.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const milestoneOptionChangeHandler = (value) => {
    setIsMilestonePercentageShow(value);
    setMileStones([]);
  };
  const handleRemoveEmail = async (index) => {
    try {
      setEmailList((prevEmails) => prevEmails.filter((_, i) => i !== index));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPhase = async () => {
    try {
      await form.validateFields([PROJECT_FORM.PHASE.NAME]);
      if (form.getFieldValue(PROJECT_FORM.PHASE.NAME)) {
        setPhaseList((previous) => [
          ...previous,
          form.getFieldValue(PROJECT_FORM.PHASE.NAME),
        ]);
        form.setFieldValue(PROJECT_FORM.PHASE.NAME, "");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemovePhase = async (index) => {
    try {
      setPhaseList((prevPhases) => prevPhases.filter((_, i) => i !== index));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMeeting = async () => {
    try {
      await form.validateFields([PROJECT_FORM.PHASE.NAME]);
      if (form.getFieldValue(PROJECT_FORM.PHASE.NAME)) {
        setMeetingList((previous) => [
          ...previous,
          form.getFieldValue(PROJECT_FORM.PHASE.NAME),
        ]);
        form.setFieldValue(PROJECT_FORM.PHASE.NAME, "");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveMeeting = async (index) => {
    try {
      setMeetingList((prevPhases) => prevPhases.filter((_, i) => i !== index));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined
              onClick={(e) => {
                navigate(`${ROUTES.PROJECTS.PATH}`);
              }}
            />
            Project Create
          </Space>
        }
        extra={
          <Space>
            <Popconfirm
              title="Are you sure?"
              description="changes will not be saved"
              onConfirm={() => navigate(`${ROUTES.PROJECTS.PATH}`)}
              onCancel={() => {
                return 0;
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type={"default"}
                disabled={loading}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
            </Popconfirm>
            <Button
              type={"primary"}
              htmlType="submit"
              onClick={onFinish}
              loading={loading}
            >
              Save
            </Button>
          </Space>
        }
      >
        <div
          style={{ maxHeight: "60vh", overflow: "scroll", overflowX: "hidden" }}
        >
          <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
            initialValues={{
              items: [{}],
            }}
          >
            {/* Project Name Start */}
            <Row gutter={gutter}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  name={PROJECT_FORM.PROJECT_NUMBER.NAME}
                  label={PROJECT_FORM.PROJECT_NUMBER.LABEL}
                  rules={[
                    {
                      required: PROJECT_FORM.PROJECT_NUMBER.REQUIRED,
                      message: PROJECT_FORM.PROJECT_NUMBER.ERROR_MESSAGE,
                    },
                  ]}
                >
                  <Input
                    placeholder={PROJECT_FORM.PROJECT_NUMBER.PLACEHOLDER}
                    maxLength={PROJECT_FORM.PROJECT_NUMBER.MAX}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                    mode="multiple"
                    allowClear
                    placeholder={PROJECT_FORM.CATEGORY.PLACEHOLDER}
                    options={categoryDropdown}
                    maxTagCount={"responsive"}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* Project Name End */}

            {/* Project MEP & Joinery Start */}
            <Row gutter={gutter}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLocaleLowerCase()
                      )
                    }
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLocaleLowerCase()
                      )
                    }
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
              </Col>
            </Row>
            {/* Project MEP & Joinery End */}

            {/* Project Date Start */}
            <Row gutter={gutter}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
              </Col>
            </Row>
            {/* Project Date End */}

            {/* Project Description Start */}
            <Row gutter={gutter}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
              </Col>
            </Row>
            {/* Project Description End */}

            {/* Assign Project Manager Start */}
            <Row gutter={gutter}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLocaleLowerCase()
                      )
                    }
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLocaleLowerCase()
                      )
                    }
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
              </Col>
            </Row>
            {/* Assign Project Manager End */}

            {/* Team Member Start */}
            <Card title={"Team Members"} size={"small"}>
              <Row gutter={gutter}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    name={PROJECT_FORM.DEFAULT_TEAM_MEMBERS.NAME}
                    label={PROJECT_FORM.DEFAULT_TEAM_MEMBERS.LABEL}
                  >
                    <List
                      size="small"
                      // header={<div>Default Team Members</div>}
                      style={{ maxHeight: "160px", overflow: "scroll" }}
                      // footer={<div>Footer</div>}
                      bordered
                      dataSource={defaultUsers}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar>
                                {item.first_name[0]?.toUpperCase() +
                                  item.last_name[0]?.toUpperCase()}
                              </Avatar>
                            }
                            title={item.first_name + " " + item.last_name}
                            description={item.email}
                          />
                        </List.Item>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    name={PROJECT_FORM.PROJECT_TEAM_MEMBERS.NAME}
                    label={PROJECT_FORM.PROJECT_TEAM_MEMBERS.LABEL}
                    rules={[
                      {
                        required: PROJECT_FORM.PROJECT_TEAM_MEMBERS.REQUIRED,
                        message:
                          PROJECT_FORM.PROJECT_TEAM_MEMBERS.ERROR_MESSAGE,
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label?.toLowerCase() ?? "").includes(
                          input?.toLocaleLowerCase()
                        )
                      }
                      mode="multiple"
                      placeholder={
                        PROJECT_FORM.PROJECT_TEAM_MEMBERS.PLACEHOLDER
                      }
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
                </Col>
              </Row>
            </Card>
            {/* Team Member End */}

            {/* Payment Milestones Start*/}
            <Card
              title={"Add Payment Milestones"}
              size={"small"}
              className="mt-7"
            >
              {/* Milestone option start*/}
              <Row gutter={gutter}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    name={PROJECT_FORM.MILESTONE.NAME}
                    label={PROJECT_FORM.MILESTONE.LABEL}
                    rules={[
                      {
                        required: PROJECT_FORM.MILESTONE.REQUIRED,
                        message: PROJECT_FORM.MILESTONE.ERROR_MESSAGE,
                      },
                    ]}
                  >
                    <Select
                      placeholder={PROJECT_FORM.MILESTONE.PLACEHOLDER}
                      options={MILESTONE_OPTIONS}
                      onChange={milestoneOptionChangeHandler}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* Milestone option end*/}

              {/* Milestone name and percentage start */}
              <Row gutter={gutter} align="middle">
                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                  <Form.Item
                    name={PROJECT_FORM.MILESTONE_NAME.NAME}
                    label={PROJECT_FORM.MILESTONE_NAME.LABEL}
                    defaultValue={""}
                    rules={[
                      {
                        required:
                          mileStones && mileStones.length ? false : true,
                        message: PROJECT_FORM.MILESTONE_NAME.ERROR_MESSAGE,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          //   isMileStone;
                          //   !mileStones.includes(value);
                          if (!isMileStoneAlreadyExists(value, mileStones)) {
                            console.log(mileStones, "---", value);
                            return Promise.resolve();
                          }
                          console.log("sdfjkmsdfjkmsdfkjmsdjkfmkjdfm    ");
                          return Promise.reject(
                            new Error("Milestone already exists")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input
                      placeholder={PROJECT_FORM.MILESTONE_NAME.PLACEHOLDER}
                      maxLength={PROJECT_FORM.MILESTONE_NAME.MAX}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                  {form.getFieldValue(PROJECT_FORM.MILESTONE.NAME) && (
                    <Form.Item
                      name={PROJECT_FORM.MILESTONE_PERCENTAGE.NAME}
                      label={PROJECT_FORM.MILESTONE_PERCENTAGE.LABEL}
                      rules={
                        form.getFieldValue(PROJECT_FORM.MILESTONE.NAME)
                          ? [
                              {
                                required:
                                  PROJECT_FORM.MILESTONE_PERCENTAGE.REQUIRED,
                                message:
                                  PROJECT_FORM.MILESTONE_PERCENTAGE
                                    .ERROR_MESSAGE,
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || parseFloat(value) >= 1) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "Percentage should be greater than 0"
                                    )
                                  );
                                },
                              }),
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || parseFloat(value) <= 100) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "Percentage should be less than 100"
                                    )
                                  );
                                },
                              }),
                              // Custom validator to check if the milestone already exists
                            ]
                          : []
                      }
                    >
                      <Input
                        type="number"
                        placeholder={
                          PROJECT_FORM.MILESTONE_PERCENTAGE.PLACEHOLDER
                        }
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                  <Button
                    type="primary"
                    disabled={mileStones && mileStones.length > MAX_MILESTONES}
                    onClick={handleAddMilestones}
                  >
                    <PlusOutlined /> Add
                  </Button>
                </Col>
              </Row>
              {/* Milestone name and percentage end */}

              {/* Render milestones list start */}
              {mileStones.map((milestone, index) => {
                return (
                  <>
                    <Row gutter={gutter}>
                      <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                        <Form.Item>
                          <Input value={milestone?.name} disabled />
                        </Form.Item>
                      </Col>
                      {isMilestonePercentageShow && (
                        <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                          <Form.Item>
                            <Input value={milestone?.percentage} disabled />
                          </Form.Item>
                        </Col>
                      )}
                      <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                        <Form.Item>
                          <Button
                            danger
                            shape="circle"
                            icon={<MinusOutlined />}
                            onClick={() => handleRemoveMileStones(index)}
                            size="small"
                          ></Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              })}
              {/* Render milestones list end */}

              {/* Email Start */}
              <Row gutter={gutter} align="bottom">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    name={PROJECT_FORM.EMAIL.NAME}
                    label={PROJECT_FORM.EMAIL.LABEL}
                    rules={[
                      {
                        required: PROJECT_FORM.EMAIL.REQUIRED,
                        message: PROJECT_FORM.EMAIL.ERROR_MESSAGE,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          // You can modify the validation logic if needed
                          if (
                            !value ||
                            value.every((email) =>
                              PROJECT_FORM.EMAIL.REGEX.test(email)
                            )
                          ) {
                            setEmailList(value);
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("invalid email format")
                          );
                        },
                      }),
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label?.toLowerCase() ?? "").includes(
                          input?.toLocaleLowerCase()
                        )
                      }
                      placeholder={PROJECT_FORM.EMAIL.PLACEHOLDER}
                      maxTagCount={PROJECT_FORM.EMAIL.MAX}
                      options={usersEmail}
                      optionRender={(option) => (
                        <Space>
                          <span>
                            <Space>
                              <Avatar size={20}>{option.data.avatar}</Avatar>
                              {option.data.desc}
                            </Space>
                          </span>
                          {option?.data?.value && (
                            <Tag
                              color="default"
                              bordered={false}
                              style={{ fontSize: "10px" }}
                            >
                              {option?.data?.value}
                            </Tag>
                          )}
                        </Space>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* Email End */}

              {/* Render email list start */}
   
              {/* Render email list end */}
            </Card>
            {/* Payment Milestones End*/}

            {/* Phase start */}
            <Card title={"Create Phase"} size={"small"} className="mt-7">
              <Row gutter={gutter} align="bottom">
                <Col xs={24} sm={24} md={24} lg={22} xl={22}>
                  <Form.Item
                    name={PROJECT_FORM.PHASE.NAME}
                    label={PROJECT_FORM.PHASE.LABEL}
                    rules={[
                      {
                        required: PROJECT_FORM.PHASE.REQUIRED,
                        message: PROJECT_FORM.PHASE.ERROR_MESSAGE,
                      },
                    ]}
                  >
                    <Input
                      placeholder={PROJECT_FORM.PHASE.PLACEHOLDER}
                      maxLength={PROJECT_FORM.PHASE.MAX}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddPhase}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              {/* Render phase list start */}
              <Row gutter={gutter}>
                {phaseList &&
                  phaseList.map((phase, index) => {
                    return (
                      <>
                        <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                          <Form.Item>
                            <Input value={phase} disabled />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={1} xl={1}>
                          <Form.Item>
                            <Button
                              danger
                              shape="circle"
                              icon={<MinusOutlined />}
                              onClick={() => handleRemovePhase(index)}
                              size="small"
                            ></Button>
                          </Form.Item>
                        </Col>
                      </>
                    );
                  })}
              </Row>
              {/* Render phase list end */}
            </Card>
            {/* Phase end */}

            {/* Create meeting start */}
            <Card
              title="Create Meetings"
              size={"small"}
              className="mt-7"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal(MEETING_MODEL_TITLE[0])}
                >
                  Add
                </Button>
              }
            >
              <Row gutter={gutter}>
                {/* {calenderobjects && calenderobjects.map((meeting, index) => {
                                    return (<>
                                        <Col xs={24} sm={24} md={24} lg={22} xl={22}>
                                            <Form.Item>
                                                <Input
                                                    value={meeting?.meeting_name} disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                                            <Form.Item>
                                                <Button danger shape="circle" icon={<MinusOutlined />} onClick={() => onhandleCancelEvent(meeting?.meeting_name, "create_meetings")} ></Button>
                                            </Form.Item>
                                        </Col>
                                    </>)
                                })} */}
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {calenderobjects && calenderobjects.length ? (
                    <List
                      size="small"
                      itemLayout="horizontal"
                      dataSource={calenderobjects}
                      renderItem={(item) => (
                        <List.Item
                          actions={[
                            <Button
                              danger
                              shape="circle"
                              icon={<MinusOutlined />}
                              onClick={() =>
                                onhandleCancelEvent(
                                  item?.meeting_name,
                                  "create_meetings"
                                )
                              }
                              size="small"
                            ></Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <>
                                {item?.meeting_name + " "}
                                <Tag>{item?.recurrence}</Tag>
                                <span
                                  style={{ fontSize: "11px", color: "gray" }}
                                >
                                  {" "}
                                  {item?.start_date +
                                    " " +
                                    item?.start_time +
                                    " - " +
                                    item?.end_date +
                                    " " +
                                    item?.end_time}
                                </span>
                              </>
                            }
                            // title={item?.meeting_name}
                            description={item?.description}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Card>
            {/* Create meeting end */}
          </Form>
        </div>
      </Card>

      {/* Meeting Model start */}
      <Modal
        title={modelTitle}
        open={isModalOpen}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
      >
        <div style={{ padding: "10px" }}>
          <div style={{ margin: "10px" }}>
            <div>Meeting Name</div>
            <Input
              disabled={modelTitle === MEETING_MODEL_TITLE[1]}
              name={"meeting_name"}
              value={meeting_name}
              onChange={(e) => onInputTextChangeHandlerCalender(e)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                width: "45%",
              }}
            >
              <div>Start date</div>
              <DatePicker
                value={dayjs(start_date, DATE_FORMAT)}
                onChange={(date, dateString) =>
                  onChangeDate(date, dateString, "start_date")
                }
                style={{ width: "100%", minWidth: "80%" }}
                allowClear={false}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
              }}
            >
              <div>End date</div>
              <DatePicker
                value={dayjs(end_date, DATE_FORMAT)}
                onChange={(date, dateString) =>
                  onChangeDate(date, dateString, "end_date")
                }
                style={{ width: "100%", minWidth: "80%" }}
                allowClear={false}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
              }}
            >
              <div>Start time</div>
              <div>
                <TimePicker
                  value={dayjs(start_time, TIME_FORMAT)}
                  format={TIME_FORMAT}
                  style={{ width: "100%", minWidth: "80%" }}
                  minuteStep={15}
                  onChange={(time, timeString) =>
                    onChangeTime(time, timeString, "start_time")
                  }
                  allowClear={false}
                  showNow={false}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
              }}
            >
              <div>End time</div>
              <div>
                <TimePicker
                  value={dayjs(end_time, TIME_FORMAT)}
                  style={{ width: "100%", minWidth: "80%" }}
                  format={TIME_FORMAT}
                  onChange={(time, timeString) =>
                    onChangeTime(time, timeString, "end_time")
                  }
                  minuteStep={15}
                  allowClear={false}
                  showNow={false}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              padding: "10px",
            }}
          >
            <div className={styles.subsectionfont}>Recurrence</div>
            <div>
              <Select
                style={{ width: "100%" }}
                placeholder=""
                value={recurrence}
                onChange={(value) => handleChange(value, "recurrence")}
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={filterOption}
                options={RECURRENCE_TYPE.map((item) => {
                  return { value: item.key, label: item.value };
                })}
              />
            </div>
          </div>

          {/* WEEKLY */}
          {recurrence === RECURRENCE_TYPE[2]?.key && (
            <div style={{ padding: "10px" }}>
              <div>Weekly on</div>
              {DAYS_OF_WEEK.map((item, index) => (
                <div style={{ margin: "10px 0" }} key={index}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ marginRight: "10px" }}>
                      <Checkbox
                        onChange={(e) => onWeeklyCheckChange(e, item.value)}
                      />
                    </div>
                    <div>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Monthly or yearly checkbox */}
          {(recurrence === RECURRENCE_TYPE[3]?.key ||
            recurrence === RECURRENCE_TYPE[4]?.key) && (
            <>
              <div style={{ padding: "10px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Checkbox
                      checked={meeting_monthly_date_check}
                      onChange={(e) => onMonthlyCheckChange(e, "date_field")}
                    />
                  </div>
                  <div style={{ marginRight: "10px" }}>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder=""
                      value={meeting_monthly_date}
                      optionFilterProp="children"
                      onChange={(value) =>
                        handleChange(value, "meeting_monthly_date")
                      }
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (date) => {
                          return { value: date, label: date };
                        }
                      )}
                    />
                  </div>
                  <div>day</div>
                </div>
              </div>

              <div style={{ padding: "10px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Checkbox
                      checked={meeting_monthly_dow_check}
                      onChange={(e) => onMonthlyCheckChange(e, "day_field")}
                    />
                  </div>
                  <div style={{ marginRight: "10px", width: "90px" }}>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder=""
                      value={meeting_monthly_occurence}
                      optionFilterProp="children"
                      onChange={(value) =>
                        handleChange(value, "meeting_monthly_occurence")
                      }
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "First",
                          label: "First",
                        },
                        {
                          value: "Second",
                          label: "Second",
                        },
                        {
                          value: "Third",
                          label: "Third",
                        },
                        {
                          value: "Four",
                          label: "Four",
                        },
                      ]}
                    />
                  </div>
                  <div style={{ width: "120px" }}>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder=""
                      value={meeting_monthly_dow}
                      optionFilterProp="children"
                      onChange={(value) =>
                        handleChange(value, "meeting_monthly_dow")
                      }
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={DAYS_OF_WEEK.map((item, index) => {
                        return { value: item, label: item };
                      })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ padding: "10px" }}>
            <div className={styles.subsectionfont}>Description</div>
            <TextArea
              name={"description"}
              value={description}
              onChange={(e) => onInputTextChangeHandlerCalender(e)}
              placeholder=""
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
            />
          </div>
        </div>
      </Modal>
      {/* Meeting Model end */}
    </>
  );
}

export default CreateProject;
