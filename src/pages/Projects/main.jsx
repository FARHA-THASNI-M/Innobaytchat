import {
  EllipsisOutlined,
  FieldTimeOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { PERMISSIONS } from "../../constants/permissions";
import {
  getItem,
  getPermissions,
  getProjectStatus,
  getProjectStatusAsObject,
  getUserShortName,
  setRecentProject,
} from "../../services";
import GroupCheckbox from "./GroupCheckbox";
import ProjectListingComponent from "./ProjectListingComponent";
import { deleteProject, projectList, updateProject } from "./project.service";
import moment from "moment";
const { RangePicker } = DatePicker;

function Projects(props) {
  const navigate = useNavigate();
  const [page, setPage] = useState({ current: 1, pagesize: 5, total: 0 });
  const [visible, setVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [search, setSearch] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isProjectStatusEdit, setIsProjectStatusEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [debouncedInputValue, setDebouncedInputValue] = useState("")
  const [filters, setFilters] = useState({
    project_status: [],
    start_date: "",
    end_date: "",
  });
  const permissions = getPermissions();
  const projectStatusList = getProjectStatus();
  const projectStatus = getProjectStatusAsObject(projectStatusList);

  useEffect(() => {
    getProjectList();
  }, [filters, page.pagesize, page.current, selectedDates, debouncedInputValue]);

  const getProjectList = () => {
    setLoading(true);
    projectList(getTableParams())
      .then((data) => {
        if (data.success) {
          setProjects(data.data.rows);
          setPage({ ...page, total: data?.data?.count || 0 });
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(search);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [search, 500]);

  const getTableParams = () => ({
    pageSize: page.pagesize,
    page: page.current,
    filters: {
      project_status: filters,
      start_date:
        (selectedDates &&
          selectedDates.length &&
          selectedDates[0] &&
          selectedDates[0].format("YYYY-MM-DD")) ||
        null,
      end_date:
        (selectedDates &&
          selectedDates.length &&
          selectedDates[1] &&
          selectedDates[1].format("YYYY-MM-DD")) ||
        null,
      search: search,
    },
  });

  const handleOpenPicker = () => {
    setVisible(true);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    setVisible(false);
  };

  const onChange = (current, pagesize) => {
    setPage({ ...page, current: current, pagesize: pagesize });
  };
  const onPageSizeChange = (current, pagesize) => {
    setPage({ ...page, current: 0, pagesize: pagesize });
  };

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleDelete = (project_id) => {
    setLoading(true);
    deleteProject(project_id)
      .then((data) => {
        if (data.success) {
          getProjectList();
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigateToTask = async (project) => {
    props.setAuthUser({ loading: true });
    props.setRecentProject({ projects: await setRecentProject(project?.project_id) });
    props.setProject(project);
    props.setAuthUser({ loading: false });
    navigate(ROUTES.TASK.PATH, { state: { project } });
    // navigate(ROUTES.AUTH.PATH, { state: { project } })
  };

  const handleStatusChange = async (project, e) => {
    setLoading(true);
    const payload = {
      project_status: e,
    };
    updateProject(project.project_id, payload)
      .then((data) => {
        if (data && data.success) {
          updateStatusClick;
          getProjectList();
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        updateStatusClick(project.project_id, false);
        setLoading(false);
      });
  };

  const updateStatusClick = (project_id, status) => {
    if (permissions.includes(PERMISSIONS.PROJECT_UPDATE)) {
      setIsProjectStatusEdit((previous) => ({
        ...previous,
        [project_id]: status,
      }));
    }
  };

  return (
    <>
      <Row justify="space-between">
        <Col>
          <Space>
            {visible ? (
              <RangePicker
                visible={visible}
                onOpenChange={handleOpenPicker}
                onChange={handleDateChange}
                value={selectedDates}
                open={true}
                size="small"
                variant="borderless"
                needConfirm={true}
              />
            ) : (
              <Button
                onClick={() => setVisible(true)}
                type={selectedDates && selectedDates.length ? "link" : "text"}
                icon={<FieldTimeOutlined />}
              >
                {selectedDates && selectedDates.length ? (
                  <b>Project Deadline</b>
                ) : (
                  "Project Deadline"
                )}
              </Button>
            )}
            <GroupCheckbox
              optionList={getProjectStatus()}
              setFilters={setFilters}
              filters={filters}
              icon={<UnorderedListOutlined />}
              title={"Project Status"}
            />
          </Space>
        </Col>
        <Col>
          <Space align="baseline">
            <Input
              placeholder="Search Projects..."
              prefix={<SearchOutlined />}
              onChange={handleSearchChange}
            />
            {permissions.includes(PERMISSIONS.PROJECT_CREATE) && (
              <Button
                type="primary"
                onClick={(e) => {
                  navigate(`${ROUTES.PROJECTS.PATH}/create`);
                }}
              >
                <PlusOutlined />
                Create Project
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <Card className="mt-5" style={{ background: "#FAFBFC" }}>
        <>
          <Typography.Text style={{ fontSize: "16px" }} strong>
            List of Projects
          </Typography.Text>
          {loading ? <Spin fullscreen={true} /> : <></>}
          <div
            style={{
              overflow: "hidden scroll",
              minHeight: "50vh",
              maxHeight: "60vh",
              scrollbarWidth: "none",
            }}
          >
            <div
              style={{
                overflow: "hidden scroll",
                height: "50vh",
                maxHeight: "50vh",
                scrollbarWidth: "none",
                marginTop: "20px",
              }}
            >
              {projects &&
                projects.map((project, index) => {
                  return (
                    <>
                      <Card key={index} className="mt-3" size="small">
                        <Row gutter={8} key={project.project_id}>
                          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <Form.Item
                              onClick={() => navigateToTask(project)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <Space
                                style={{
                                  height: "0px",
                                }}
                                direction="vertical"
                              >
                                <Tag
                                  style={{
                                    width: "80px",
                                    textAlign: "center",
                                  }}
                                  color="#0084FF"
                                >
                                  {project?.project_number}
                                </Tag>
                                {project?.project_name}
                              </Space>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                            <Flex
                              justify={"space-evenly"}
                              wrap={"nowrap"}
                              align="center"
                              style={{
                                overflowX: "auto", // Enable horizontal scrolling if content overflows
                                maxWidth: "100%", // Ensure the container takes full width
                                flexWrap: "nowrap", // Ensure no wrapping of flex items
                                "&::-webkit-scrollbar": {
                                  height: "6px", // Customize scrollbar height
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#888", // Customize scrollbar thumb color
                                  borderRadius: "3px", // Round corners of the thumb
                                },
                              }}
                            >
                              <Form.Item>
                                {isProjectStatusEdit[project.project_id] ? (
                                  <Select
                                    defaultOpen={true}
                                    autoFocus={true}
                                    showSearch
                                    variant="filled"
                                    options={projectStatusList.map(
                                      ({ key, value }) => ({
                                        label: value,
                                        value: key,
                                      })
                                    )}
                                    style={{
                                      width: "100%",
                                    }}
                                    defaultValue={project?.project_status}
                                    value={project?.project_status}
                                    onChange={(e) =>
                                      handleStatusChange(project, e)
                                    }
                                    onBlur={() =>
                                      updateStatusClick(
                                        project.project_id,
                                        false
                                      )
                                    }
                                  />
                                ) : (
                                  <>
                                    <Space align="center" direction="vertical" >
                                      <Tag
                                        style={{
                                          width: "100px",
                                          textAlign: "center",
                                          borderRadius: "20px",
                                          cursor: permissions.includes(
                                            PERMISSIONS.PROJECT_UPDATE
                                          )
                                            ? "pointer"
                                            : "",
                                        }}
                                        onClick={() =>
                                          updateStatusClick(
                                            project.project_id,
                                            true
                                          )
                                        }
                                        color={
                                          projectStatus[project?.project_status]
                                            ?.meta_code
                                        }
                                      >
                                        {
                                          projectStatus[project?.project_status]
                                            ?.value
                                        }
                                      </Tag>
                                      <div>Phase: { project.phase_count }</div>
                                    </Space>
                                  </>
                                )}
                              </Form.Item>
                              <Form.Item>
                                <div>Delayed</div>
                                <div
                                  style={{
                                    color: "#EC2027",
                                  }}
                                >
                                  {project?.incomplete_task_count || 0} Tasks
                                </div>
                              </Form.Item>
                              <Form.Item>
                                <Space align="center">
                                  <FieldTimeOutlined />
                                  <span
                                    style={{
                                      color: "#6B7280",
                                    }}
                                  >
                                    Timeline
                                  </span>
                                </Space>
                                <div
                                  style={{
                                    color: "#6B7280",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {moment
                                    .utc(project?.project_start_date)
                                    .format("DD MMM, YY") +
                                    " - " +
                                    moment
                                      .utc(project?.project_end_date)
                                      .format("DD MMM, YY")}
                                </div>
                              </Form.Item>
                              <Form.Item>
                                <Avatar.Group
                                  maxCount={2}
                                  maxPopoverTrigger="click"
                                  maxStyle={{
                                    color: "#f56a00",
                                    backgroundColor: "#fde3cf",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      <Space direction="vertical">
                                        <b>
                                          {project?.ref_project_manager
                                            ?.first_name +
                                            " " +
                                            project?.ref_project_manager
                                              ?.last_name}
                                        </b>
                                        {
                                          project?.ref_project_manager?.ref_role
                                            ?.role_name
                                        }
                                      </Space>
                                    }
                                    placement="top"
                                  >
                                    <Avatar
                                      style={{
                                        backgroundColor: "#87d068",
                                      }}
                                    >
                                      {getUserShortName(
                                        project?.ref_project_manager
                                          ?.first_name,
                                        project?.ref_project_manager?.last_name
                                      )}
                                    </Avatar>
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      <Space direction="vertical">
                                        <b>
                                          {project?.ref_project_coordinator
                                            ?.first_name +
                                            " " +
                                            project?.ref_project_coordinator
                                              ?.last_name}
                                        </b>
                                        {
                                          project?.ref_project_coordinator
                                            ?.ref_role?.role_name
                                        }
                                      </Space>
                                    }
                                    placement="top"
                                  >
                                    <Avatar
                                      style={{
                                        backgroundColor: "#87d068",
                                      }}
                                    >
                                      {getUserShortName(
                                        project?.ref_project_coordinator
                                          ?.first_name,
                                        project?.ref_project_coordinator
                                          ?.last_name
                                      )}
                                    </Avatar>
                                  </Tooltip>
                                </Avatar.Group>
                              </Form.Item>
                              <Form.Item>
                                <div
                                  style={{
                                    width: "200px",
                                    maxWidth: "80%",
                                  }}
                                >
                                  <Progress
                                    percent={project?.project_percentage}
                                    status="active"
                                  />
                                </div>
                              </Form.Item>
                              <Form.Item>
                                <Dropdown
                                  menu={{
                                    items: [
                                      getItem(
                                        permissions.includes(
                                          PERMISSIONS.PROJECT_VIEW
                                        ),
                                        <div
                                          onClick={(e) => {
                                            navigate(
                                              `${ROUTES.PROJECTS.PATH}/view`,
                                              {
                                                state: {
                                                  id: project?.project_id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          Project Settings
                                        </div>,
                                        "1"
                                      ),
                                      getItem(
                                        permissions.includes(
                                          PERMISSIONS.TASK_VIEW
                                        ),
                                        <div
                                          onClick={() =>
                                            navigateToTask(project)
                                          }
                                        >
                                          Task Settings
                                        </div>,
                                        "2"
                                      ),
                                      getItem(
                                        permissions.includes(
                                          PERMISSIONS.PROJECT_DELETE
                                        ),
                                        <Button
                                          danger
                                          type="link"
                                          size="small"
                                          onClick={() =>
                                            handleDelete(project?.project_id)
                                          }
                                        >
                                          Move to trash
                                        </Button>,
                                        "3"
                                      ),
                                    ],
                                  }}
                                  placement="bottom"
                                  trigger={"click"}
                                >
                                  <Button
                                    type="text"
                                    style={{
                                      float: "right",
                                    }}
                                  >
                                    <EllipsisOutlined
                                      style={{ fontSize: "32px" }}
                                    />
                                  </Button>
                                </Dropdown>
                              </Form.Item>
                            </Flex>
                          </Col>{" "}
                        </Row>
                      </Card>
                    </>
                  );
                })}
            </div>
            <div className="mt-5" style={{ textAlign: "right" }}>
              <Pagination
                showSizeChanger
                onChange={onChange}
                defaultCurrent={1}
                defaultPageSize={5}
                current={page.current}
                total={page.total}
                pageSize={page.pagesize}
                pageSizeOptions={[5, 10, 20, 30]}
                onShowSizeChange={onPageSizeChange}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
}

export default Projects;
