import {
  ArrowLeftOutlined,
  ExclamationCircleFilled,
  FieldTimeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ThunderboltFilled,
  UnorderedListOutlined,
  UserOutlined,
  WarningFilled
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Layout,
  List,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  message,
  theme
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateSnagModal from "../../components/Snag/CreateSnag";
import ViewSnag from "../../components/Snag/ViewSnag";
import CreateTaskModal from "../../components/Task/CreateTask";
import ViewTask from "../../components/Task/ViewTask";
import ViewViolation from "../../components/Violation/ViewViolation";
import ViolationModal from "../../components/Violation/Violation";
import UnAuthorizedError from "../../components/common/error/UnAuthorizedError";
import { ICONS, ROUTES } from "../../constants";
import { PERMISSIONS } from "../../constants/permissions";
import { getItem, getPermissions, getPriority, getProjectCategoriesData, getProjectPhaseData, getProjectUsersData, getTaskStatus, getType, getUserShortName } from "../../services";
import styled from "../../styles/_task.module.css";
import GroupCheckbox from "../Projects/GroupCheckbox";
import Kanban from "./kanban/kanban";
import "./main.css";
import { getTaskListMeta, snagList, taskList, violationList } from "./task.service";

const { RangePicker } = DatePicker;
const { Content } = Layout;
const { Panel } = Collapse;
function Task(props) {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { state } = useLocation();
  const permissions = getPermissions();
  const taskStatusList = getTaskStatus();
  const [project, setProject] = useState(state.project);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [snagModalVisible, setSnagModalVisible] = useState(false);
  const [violationModalVisible, setViolationModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [phases, setPhases] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [phasesList, setPhasesList] = useState({});
  const [assignUserList, setAssignUserList] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [assignUserFilters, setAssignUserFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState([])
  const [taskMeta, setTaskMeta] = useState({})
  const [taskListing, setTaskListing] = useState({})
  const [snagListing, setSnagListing] = useState([])
  const [snagCount, setSnagCount] = useState(0)
  const [violationCount, setViolationCount] = useState(0)
  const [violationListing, setViolationListing] = useState([])
  const [taskLoading, setTaskLoading] = useState(false)
  const [snagLoading, setSnagLoading] = useState(false)
  const [violationLoading, setViolationLoading] = useState(false)
  const [defaultTaskCategory, setDefaultTaskCategory] = useState(null)
  const [taskUpdateLoading, setTaskUpdateLoading] = useState(false)

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSnagModal, setShowSnagModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const [currentSnag, setCurrentSnag] = useState(false);
  const [currentViolation, setCurrentViolation] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [breadCrumbItem, setBreadCrumbItem] = useState([]);
  const [subTaskModalVisible, setSubTaskModalVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeKey, setActiveKey] = useState([]);
  const [dueDateFilter, setDueDateFilter] = useState([])
  const [search, setSearch] = useState(null)
  const priorityList = getPriority();
  const typeList = getType();

  useEffect(() => {
    setProject(state.project)
  }, [state.project])

  useEffect(() => {
    if (project.project_id) {
      getProjectCategoryList()
      getUsers()
      getTaskMeta()
      getPhases()
    }
  }, [project?.project_id])

  useEffect(() => {
    getTaskMeta()
    setActiveKey([])
  }, [priorityFilters, assignUserFilters, statusFilters, dueDateFilter, search])




  const getUsers = async () => {
    const users = await getProjectUsersData(project.project_id)
    setProjectUsers(users)
    const assignUsers = users.map(({ user_id, first_name, last_name }) => ({ key: user_id, value: first_name + " " + last_name }))
    setAssignUserList(assignUsers)
  }

  const onSubTaskCancel = () => {
    setSubTaskModalVisible(false)
  }
  const getTaskMeta = async () => {
    props.setAuthUser({ loading: true });
    if (project.project_id) {
      getTaskListMeta(project.project_id, { filters: getFilters(), search: search }).then((data) => {
        if (data.success) {
          setTaskMeta(data.data)
        }
      }).catch((error) => {
        message.error(error?.message ? error.message : "failed");
      }).finally(() => {
        setLoading(false)
        props.setAuthUser({ loading: false });
      })
    }
  }

  const getFilters = () => {
    const filters = {
      priorities: priorityFilters,
      statuses: statusFilters,
      assignees: assignUserFilters,
      due_start_date: dueDateFilter && dueDateFilter.length && dueDateFilter[0].format("YYYY-MM-DD") || null,
      due_end_date: dueDateFilter && dueDateFilter.length && dueDateFilter[1].format("YYYY-MM-DD") || null
    }
    return filters;
  }

  const getPhases = async () => {
    const data = await getProjectPhaseData(project.project_id)
    setPhases(data)
    const groupedData = data.reduce((acc, curr) => {
      acc[curr.project_phases_id] = curr.phase_name;
      return acc;
    }, {});

    setPhasesList(groupedData);
  }

  // const getProjectCategoryList = () => {
  //   setLoading(true)
  //   getProjectCategories(project.project_id).then((data) => {
  //     if (data.success) {
  //       setCategories(data.data)
  //       const categories = data.data.map((category) => ({ value: category?.ref_category?.category_name, key: category?.category_id }))
  //       setCategoriesList(categories)
  //     }
  //   }).catch((error) => {
  //     message.error(error?.message ? error.message : "failed");
  //   }).finally(() => {
  //     setLoading(false)
  //   })
  // }

  const getProjectCategoryList = async () => {
    const data = await getProjectCategoriesData(project.project_id)
    setCategories(data)
    const categories = data.map((category) => ({ value: category?.ref_category?.category_name, key: category?.category_id }))
    setCategoriesList(categories)
  }

  const onCancel = () => {
    setTaskModalVisible(false);
    setSnagModalVisible(false)
    setViolationModalVisible(false)
    setDefaultTaskCategory(null)
  };

  useEffect(() => {
    refetchData()
  }, [taskModalVisible, snagModalVisible, violationModalVisible])
  const getAssignToDetails = (id) => {
    const user = projectUsers.filter(user => user.user_id === id)[0]
    return user;
  }

  const createSubTaskSubmitHandler = () => {
    onSubTaskCancel();
    refetchData()
    // setPage(1)
  }

  const openTask = (item) => {
    setCurrentTask(item);
    // setBreadCrumb(item)
    setShowTaskModal(true)
  }

  const openSnag = (item) => {
    setCurrentSnag(item);
    // setBreadCrumb(item)
    setShowSnagModal(true)
  }

  const openViolation = (item) => {
    setCurrentViolation(item);
    // setBreadCrumb(item)
    setShowViolationModal(true)
  }

  const setBreadCrumb = (item) => {
    setBreadCrumbItem(
      [
        { title: 'Task', onClick: navigate(ROUTES.TASK.PATH, { state: { project } }) },
        { title: 'test', onClick: navigate(ROUTES.TASK_DETAILS.PATH, { state: { project, task_id: item?.task_id } }) },
        { title: item.task_number, onClick: navigate(ROUTES.TASK_DETAILS.PATH, { state: { project, task_id: item?.task_id } }) },
      ]
    )
  }

  const renderTaskList = (item) => {
    const assignedTo = getAssignToDetails(item?.assigned_to)
    const priority = priorityList.filter(({ key }) => key == item?.priority)[0];
    const subtaskCount = item?.subtasks?.length
    return (<>
      <Panel
        key={item?.task_id}
        extra={
          permissions.includes(PERMISSIONS.TASK_CREATE) &&
          <PlusOutlined onClick={() => {
            setSelectedTask(prev => {
              return item
            })
            setSubTaskModalVisible(true)
          }} />
        }
        header={
          <div className="flex align-baseline" style={{ height: '25px', cursor: 'pointer' }} onClick={() => { openTask(item); }}>
            <Tooltip title={`Priority - ${priority?.value}`}>
              <img src="/assets/images/icons/task_icon.svg" style={{ margin: '0px', width: 'auto', maxWidth: '20vw', height: '22px' }} />
            </Tooltip>
            <Tag bordered={false}>{item?.task_number}</Tag>
            <Typography.Text strong style={{ margin: '0px', marginRight: '5px', width: 'auto', maxWidth: '20vw' }} ellipsis>{item?.task_name}</Typography.Text>
            <Typography.Text style={{ margin: '0px', width: 'auto', maxWidth: '20vw' }} ellipsis>&nbsp;{(subtaskCount < 10 && subtaskCount == 0) ? '0' + subtaskCount : subtaskCount} subtasks</Typography.Text>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              {item?.phase_id > 0 && phasesList[item?.phase_id] &&
                <Tooltip title={"Phase: " + phasesList[item?.phase_id]}>
                  <Tag color={''} bordered={false} style={{ marginLeft: '12px', width: '100px', textAlign: 'center' }}>
                    {phasesList[item?.phase_id]}
                  </Tag>
                </Tooltip>
              }
              <Tag color={taskStatusList.filter(({ key }) => key == item?.status)[0]?.meta_code} bordered={false} style={{ borderRadius: '20px', marginLeft: '12px', width: '100px', textAlign: 'center' }}>
                {taskStatusList.filter(({ key }) => item?.status === key)[0]?.value}
              </Tag>
              {assignedTo ?
                <Tooltip title={assignedTo?.first_name + " " + assignedTo?.last_name}>
                  <Avatar size={'small'} style={{ marginRight: '20px' }} >{getUserShortName(assignedTo?.first_name, assignedTo?.last_name)}</Avatar>
                </Tooltip> :
                <Avatar size={'small'} style={{ marginRight: '20px' }} icon={<UserOutlined />}></Avatar>}
            </div>
          </div>
        }

        style={{ marginBottom: 10, border: 'none', padding: '0px', justifyContent: "space-between", background: token.colorFillAlter, borderRadius: token.borderRadiusLG, }}
      >
        <Kanban
          item={item}
          project={project}
          setShowTaskModal={setShowTaskModal}
          refetchData={refetchData}
          setTaskModalVisible={setTaskModalVisible}
          subTaskModalVisible={subTaskModalVisible}
          setSubTaskModalVisible={setSubTaskModalVisible}
          setSelectedTask={setSelectedTask}
        />

      </Panel>
    </>
    )
  }
  const renderTask = (category) => {
    return (
      <>
        <Panel
          key={category.category_id}
          header={
            <Space size={'small'} style={{ height: '0px' }}>
              <Button
                type="primary"
                shape="circle"
                icon={<UnorderedListOutlined color={"white"} />}
                size="small"
              ></Button>
              <b>{category.ref_category.category_name}</b> - {taskMeta?.categories?.[category.category_id.toString()]?.count || 0} Tasks
            </Space>
          }
          extra={
            permissions.includes(PERMISSIONS.TASK_CREATE) && <PlusOutlined onClick={() => { setDefaultTaskCategory(category.category_id); setTaskModalVisible(true); }} />
          }
          style={{ marginBottom: 10, border: 'none', background: token.colorFillAlter, borderRadius: token.borderRadiusLG, }}
        >
          {taskMeta?.categories?.[category.category_id.toString()] && taskMeta?.categories?.[category.category_id.toString()].count ?
            <Card size="small">
              <Spin spinning={taskUpdateLoading}>
                <List
                  loading={taskLoading}
                  itemLayout="horizontal"
                  size="small"
                  dataSource={taskListing[category.category_id]?.data}
                  renderItem={(item) => {

                    return (
                      <Collapse
                        bordered={false}
                        style={{
                          background: token.colorBgContainer,
                        }}
                        accordion
                        collapsible={'icon'}
                      >
                        {renderTaskList(item)}
                      </Collapse>
                    )
                  }}
                />
              </Spin>
            </Card>
            : <Empty></Empty>
          }
        </Panel>
      </>
    )
  };

  const handleTaskListing = (e) => {
    if (e && e.length) {
      const selectedValue = e[0]
      setActiveKey(selectedValue)
      switch (selectedValue) {
        case 'snags':
          getSnagList({ project_id: project.project_id })
          break;
        case 'violations':
          getViolationList({ project_id: project.project_id })
          break;
        default: {
          setCurrentCategory(selectedValue)
          generateTaskPayload(selectedValue)
        }
      }
    } else {
      setActiveKey([])
    }
  }



  const generateTaskPayload = (category_id) => {
    if (category_id) {
      const payload = {
        project_id: project.project_id,
        category_id: parseInt(category_id)
      }
      getTaskList(payload)
    }
  }

  const getTaskList = (payload) => {
    setTaskLoading(true)
    taskList({ ...payload, filters: getFilters(), search: search }).then((data) => {
      if (data.success) {
        setTaskListing((previous) => ({ ...previous, [payload.category_id]: { data: data.data.rows, count: data.data.count } }))
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setTaskLoading(false)
    })
  }

  const getSnagList = (payload) => {
    setSnagLoading(true)
    snagList({ ...payload, filters: getFilters(), search: search }).then((data) => {
      if (data.success) {
        setSnagListing(data.data.rows)
        setSnagCount(data.data.count)
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setSnagLoading(false)
    })
  }

  const getViolationList = (payload) => {
    setViolationLoading(true)
    violationList(payload).then((data) => {
      if (data.success) {
        setViolationListing(data.data.rows)
        setViolationCount(data.data.count)
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setViolationLoading(false)
    })
  }

  const refetchData = () => {
    getTaskMeta()
    generateTaskPayload(currentCategory)
    setShowTaskModal(false)
  }

  const refetchSnagData = () => {
    getTaskMeta()
    getSnagList({ project_id: project.project_id })
    setShowSnagModal(false)
  }

  const refetchViolationData = () => {
    getTaskMeta()
    getViolationList({ project_id: project.project_id })
    setShowViolationModal(false)
  }

  return (
    <Content>
      <Row gutter={16}>
        <Col span={18}>
          <Breadcrumb
            className={styled.breadhCrum}
            separator=">"
            items={[
              {
                title: <a href={ROUTES.PROJECTS.PATH}><ArrowLeftOutlined /> Project</a>,
              },
              {
                title: <>
                  {project?.project_number}
                </>,
              },
            ]}
          />
          <Space>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <Space>
                {project.project_name} <Tooltip title={<>
                  <FieldTimeOutlined /> {moment(project?.project_start_date).format('MM-DD-YYYY')} - {moment(project?.project_end_date).format('MM-DD-YYYY')}
                </>}>
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            </Typography.Title>
          </Space>
        </Col>
        <Col span={6}>
          <Space style={{ float: 'right' }}>
            <Input.Search placeholder="Search" onSearch={(e) => setSearch(e)} enterButton />
            <Dropdown
              menu={{
                items: [
                  getItem(permissions.includes(PERMISSIONS.TASK_CREATE), (
                    <div
                      onClick={(e) => {
                        setTaskModalVisible(true);
                      }}
                    >
                      Create Task
                    </div>
                  ), "1"),
                  getItem(permissions.includes(PERMISSIONS.SNAG_CREATE), (
                    <div
                      onClick={(e) => {
                        setSnagModalVisible(true);
                        setActiveKey([])
                      }}
                    >
                      Create Snag
                    </div>
                  ), "2"),
                  getItem(permissions.includes(PERMISSIONS.VIOLATION_CREATE), (
                    <div
                      onClick={(e) => {
                        setViolationModalVisible(true);
                        setActiveKey([])
                      }}
                    >
                      Create Violation
                    </div>
                  ), "3"),
                ],
              }}
              placement="bottom"
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Create
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
      {/* <Row>
        <Col>
           
        </Col>
      </Row> */}
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Space
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <GroupCheckbox optionList={priorityList} setFilters={setPriorityFilters} filters={priorityFilters} icon={<ThunderboltFilled />} title={'Priority'} />
            <GroupCheckbox optionList={taskStatusList} setFilters={setStatusFilters} filters={statusFilters} icon={<UnorderedListOutlined />} title={'Status'} />
            {/* <GroupCheckbox optionList={typeList} setFilters={setTypeFilters} filters={typeFilters} icon={<HolderOutlined />} title={'Type'} /> */}
            <GroupCheckbox optionList={assignUserList} setFilters={setAssignUserFilters} filters={assignUserFilters} icon={<UserOutlined />} title={'Assigned To'} />
            <RangePicker placeholder={["Due Start Date", "Due End Date"]} variant="filled" onChange={(e) => { setDueDateFilter(e) }} />
          </Space>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Space style={{ float: 'right' }}>
            <Tooltip title="Project Status">
              <Progress
                percent={project?.project_percentage}
                status="active"
                size={[250]}
                strokeColor={"#87d068"}
              />
            </Tooltip>

            <Avatar.Group
              maxCount={3}
              size="small"
              maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            >
              {projectUsers.map(({ first_name, last_name }) => <Tooltip title={first_name + " " + last_name}>
                <Avatar style={{ backgroundColor: "#f56a00" }}>{getUserShortName(first_name, last_name)}</Avatar>
              </Tooltip>)}
            </Avatar.Group>
          </Space>
        </Col>
      </Row>

      <Content loading={loading}>
        <Card>
          <div style={{ maxHeight: '60vh', overflow: 'hidden auto' }}>
            <Collapse
              bordered={false}
              activeKey={activeKey}
              key={activeKey}
              style={{
                background: token.colorBgContainer,
              }}
              accordion
              collapsible={'icon'}
              onChange={handleTaskListing}
            >
              {/* Categories */}
              {permissions.includes(PERMISSIONS.TASK_VIEW) && categories.map(renderTask)}

              {/* Snag */}
              {permissions.includes(PERMISSIONS.SNAG_VIEW) && taskMeta?.snags?.count ? <Panel
                key={'snags'}
                header={
                  <Space size={'small'} style={{ height: '0px' }}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<ExclamationCircleFilled color={"white"} />}
                      size="small"
                      style={{ background: 'orange', color: 'white' }}
                    ></Button>
                    <b>Snags</b> - {taskMeta?.snags?.count || 0} Snags
                  </Space>
                }

                style={{ marginBottom: 10, border: 'none', background: token.colorFillAlter, borderRadius: token.borderRadiusLG, }}
              >
                <Card size="small">
                  <div style={{ maxHeight: '200px', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                    <List
                      loading={snagLoading}
                      itemLayout="horizontal"
                      size="small"
                      dataSource={snagListing}
                      renderItem={(item) => {
                        const assignedTo = getAssignToDetails(item?.assigned_to)
                        const priority = priorityList.filter(({ key }) => key == item?.priority)[0];
                        const status = taskStatusList.filter(({ key }) => key == item?.status)[0]
                        return (
                          <List.Item
                            actions={[

                              <Tag color={status?.meta_code} bordered={false} style={{ borderRadius: '20px', width: '100px', textAlign: 'center' }}>
                                {status?.value}
                              </Tag>,
                              assignedTo ? <Tooltip title={assignedTo?.first_name + " " + assignedTo?.last_name}>
                                <Avatar size={'small'}>{getUserShortName(assignedTo?.first_name, assignedTo?.last_name)}</Avatar>
                              </Tooltip> : <Avatar size={'small'} icon={<UserOutlined />}>
                              </Avatar>,
                            ]}
                            key={item?.snag_id}
                          >
                            <Skeleton title={false} loading={snagLoading} active>
                              <div onClick={() => openSnag(item)}>
                                <Space align="baseline" style={{ height: '25px', cursor: 'pointer' }} >
                                  <Tooltip title={`Priority - ${priority?.value}`}>
                                    <ThunderboltFilled
                                      style={{ color: priority?.meta_code || '' }}
                                    />
                                  </Tooltip>
                                  <Tag bordered={false}>{item?.snag_number}</Tag>
                                  <Tooltip title={item?.snag_name}>
                                    <Typography.Text strong style={{ margin: '0px', width: 'auto', maxWidth: '13vw' }} ellipsis>{item?.snag_name}</Typography.Text>
                                  </Tooltip>
                                </Space>
                              </div>

                            </Skeleton>
                          </List.Item>
                        )
                      }}
                    />
                  </div>
                </Card>
              </Panel> : <></>}

              {/* violation */}
              {permissions.includes(PERMISSIONS.VIOLATION_VIEW) && taskMeta?.violations?.count ? <Panel
                key={'violations'}
                header={
                  <Space size={'small'} style={{ height: '0px' }}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<WarningFilled color={"white"} />}
                      size="small"
                      style={{ background: 'red', color: 'white' }}
                    ></Button>
                    <b>Violations</b> - {taskMeta?.violations?.count || 0} Violations
                  </Space>
                }
                style={{ marginBottom: 10, border: 'none', background: token.colorFillAlter, borderRadius: token.borderRadiusLG, }}
              >
                <Card size="small">
                  <div style={{ maxHeight: '200px', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                    <List
                      loading={violationLoading}
                      itemLayout="horizontal"
                      size="small"
                      dataSource={violationListing}
                      renderItem={(item) => {
                        return (
                          <List.Item
                            actions={[
                              <Tooltip title={item?.violator_name}>
                                <Avatar size={'small'} icon={<UserOutlined />}></Avatar>
                              </Tooltip>,
                            ]}
                            key={item?.violation_id}
                          >
                            <Skeleton title={false} loading={violationLoading} active>
                              <div onClick={() => openViolation(item)}>
                                <Space align="baseline" style={{ height: '25px', cursor: 'pointer' }} >
                                  <Tag bordered={false}>{item?.violation_number}</Tag>
                                  <Tooltip title={item?.description}>
                                    <Typography.Text strong style={{ margin: '0px', width: 'auto', maxWidth: '30vw' }} ellipsis>{item?.description}</Typography.Text>
                                  </Tooltip>
                                </Space>
                              </div>

                            </Skeleton>
                          </List.Item>
                        )
                      }}
                    />
                  </div>
                </Card>
              </Panel> : <></>}
            </Collapse>
            {!permissions.includes(PERMISSIONS.TASK_VIEW) && !permissions.includes(PERMISSIONS.SNAG_VIEW) && !permissions.includes(PERMISSIONS.VIOLATION_VIEW) ? <UnAuthorizedError /> : <></>}
          </div>
        </Card>
      </Content>

      {/* Create Task */}
      {taskModalVisible && <CreateTaskModal visible={taskModalVisible} onCancel={onCancel} project={project} projectUsers={projectUsers} categories={categories} priorityList={priorityList} phases={phases} defaultTaskCategory={defaultTaskCategory} fetchData={getTaskMeta} title={'Create Task'} icon={ICONS.TASK} />}

      {/* Create Snag */}
      {
        snagModalVisible && (
          <CreateSnagModal visible={snagModalVisible} onCancel={onCancel} project={project} projectUsers={projectUsers} categories={categories} priorityList={priorityList} fetchData={getTaskMeta} />
        )
      }

      {/* Create Violation */}
      {
        violationModalVisible && (
          <ViolationModal visible={violationModalVisible} onCancel={onCancel} project={project} projectUsers={projectUsers} fetchData={getTaskMeta} />
        )
      }

      {/* View/Update Task */}
      <Modal open={showTaskModal} width={1080} onCancel={refetchData} footer={null}>
        <ViewTask project={project} task={currentTask} projectUsers={projectUsers} categories={categories} priorityList={priorityList} phases={phases} taskStatusList={taskStatusList} fetchData={refetchData} isModal={true} setShowTaskModal={setShowTaskModal} />
      </Modal>

      {/* View/Update Snag */}
      <Modal open={showSnagModal} width={1080} onCancel={refetchSnagData} footer={null}>
        <ViewSnag project={project} snag={currentSnag} projectUsers={projectUsers} categories={categories} priorityList={priorityList} taskStatusList={taskStatusList} fetchData={refetchSnagData} isModal={true} setShowSnagModal={setShowSnagModal} />
      </Modal>

      {/* View/Update Violation */}
      <Modal open={showViolationModal} width={1080} onCancel={refetchViolationData} footer={null}>
        <ViewViolation project={project} violation={currentViolation} fetchData={refetchViolationData} setShowViolationModal={setShowViolationModal} isModal={true} />
      </Modal>

      {subTaskModalVisible && <CreateTaskModal visible={subTaskModalVisible} onCancel={onSubTaskCancel} project={project} projectUsers={projectUsers} categories={categories} priorityList={priorityList} phases={phases} defaultTaskCategory={selectedTask?.project_category_id} fetchData={createSubTaskSubmitHandler} title={`Create Subtask - ${selectedTask?.task_number}`} parent_task={selectedTask?.task_id} icon={ICONS.SUBTASK} />}

    </Content >
  );
}

export default Task;
