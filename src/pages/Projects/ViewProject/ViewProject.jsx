import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, List, Modal, Popconfirm, Row, Space, Spin, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { PERMISSIONS } from '../../../constants/permissions';
import { getPermissions } from '../../../services';
import { getFormatDate } from '../../../utils';
import AddEmail from '../CreateModal/AddEmail';
import AddMileStone from '../CreateModal/AddMileStone';
import AddMileStoneWithPercentage from '../CreateModal/AddMileStoneWithPercentage';
import AddPhase from '../CreateModal/AddPhase';
import UpdateEmail from '../CreateModal/UpdateEmail';
import UpdateMileStone from '../CreateModal/UpdateMileStone';
import UpdateMileStoneWithPercentage from '../CreateModal/UpdateMileStoneWithPercentage';
import UpdatePhase from '../CreateModal/UpdatePhase';
import UpdateProject from '../CreateModal/UpdateProject';
import { deleteProjectEmail, deleteProjectMeeting, deleteProjectMilestone, deleteProjectPhase, getDefaultUsersList, getProjectDetails } from '../project.service';
import AddMeeting from '../CreateModal/AddMeeting';
const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
}
const { confirm } = Modal;
function ViewProject() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = useState()
    const [defaultUsers, setDefaultUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [editProject, setEditProject] = useState(false)
    const [addEmail, setAddEmail] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [emailData, setEmailData] = useState({})
    const [addPhase, setAddPhase] = useState(false)
    const [editPhase, setEditPhase] = useState(false)
    const [phaseData, setPhaseData] = useState({})
    const [addMileStone, setAddMileStone] = useState(false)
    const [editMileStone, setEditMileStone] = useState(false)
    const [mileStoneData, setMileStoneData] = useState({})
    const [addMeeting, setAddMeeting] = useState(false)
    const [editMeeting, setEditMeeting] = useState(false)
    const [meetingData, setMeetingData] = useState({})
    const [addMileStoneWithPercentage, setAddMileStoneWithPercentage] = useState(false)
    const [editMileStoneWithPercentage, setEditMileStoneWithPercentage] = useState(false)
    const [mileStoneWithPercentageData, setMileStoneWithPercentageData] = useState({})
    const permissions = getPermissions();
    const [canUpdate, setCanUpdate] = useState(permissions.includes(PERMISSIONS.PROJECT_UPDATE))
    const [meetingLoading, setMeetingLoading] = useState(false)

    useEffect(() => {
        defaultUserList()
        projectDetails()
    }, [])

    const defaultUserList = () => {
        setLoading(true)
        getDefaultUsersList().then((data) => {
            if (data.success) {
                setDefaultUsers(data?.data)
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const projectDetails = () => {
        getProjectDetails(state.id).then((data) => {
            if (data.success) {
                setProject(data?.data)
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDeleteEmail = (email_id) => {
        setLoading(true)
        deleteProjectEmail(state.id, email_id).then((data) => {
            if (data.success) {
                projectDetails()
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDeletePhase = (phase_id) => {
        setLoading(true)
        deleteProjectPhase(state.id, phase_id).then((data) => {
            if (data.success) {
                projectDetails()
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDeleteMilestone = (milestone_id) => {
        setLoading(true)
        deleteProjectMilestone(state.id, milestone_id).then((data) => {
            if (data.success) {
                projectDetails()
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDeleteMeeting = (meeting_id) => {
        setMeetingLoading(true)
        deleteProjectMeeting(state.id, meeting_id).then((data) => {
            if (data.success) {
                projectDetails()
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setMeetingLoading(false)
        })
    }


    const handleCreateMeeting = (meeting_id) => {
        setMeetingLoading(true)
        deleteProjectMeeting(state.id, meeting_id).then((data) => {
            if (data.success) {
                projectDetails()
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setMeetingLoading(false)
        })
    }

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
              Project Details
            </Space>
          }
        >
          {loading ? (
            <Spin />
          ) : (
            <div
              style={{
                maxHeight: "60vh",
                overflow: "scroll",
                overflowX: "hidden",
              }}
            >
              <Descriptions
                title="Project Info"
                bordered
                column={{
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                size="small"
                extra={
                  canUpdate && (
                    <Button
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditProject(true);
                      }}
                    ></Button>
                  )
                }
              >
                <Descriptions.Item label="Project Name">
                  {project?.project_name}
                </Descriptions.Item>
                <Descriptions.Item label="Project Number">
                  {project?.project_number}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {getFormatDate(project?.project_start_date)}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {getFormatDate(project?.project_end_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Number Of Days">
                  {project?.number_of_days}
                </Descriptions.Item>
                {/* <Descriptions.Item label="Status">{project?.project_status && getProjectStatus(project?.project_status)?.value || ''}</Descriptions.Item> */}
              </Descriptions>

              <div className="mt-5">
                <Descriptions
                  layout="vertical"
                  bordered
                  column={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                  }}
                  size="small"
                >
                  <Descriptions.Item label={"Categories"}>
                    {(project?.projectCategories &&
                      project?.projectCategories.length &&
                      project?.projectCategories.map(({ ref_category }) => (
                        <Tag bordered={false}>
                          {ref_category?.category_name}
                        </Tag>
                      ))) ||
                      "no-record"}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <div className="mt-5">
                <Descriptions
                  layout="vertical"
                  bordered
                  column={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                  }}
                  size="small"
                >
                  <Descriptions.Item label={"Description"}>
                    {project?.description}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Descriptions
                className="mt-5"
                title="Project Members"
                bordered
                column={{
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                size="small"
              >
                <Descriptions.Item label="Project Manager">
                  {project?.ref_project_manager?.username}
                </Descriptions.Item>
                <Descriptions.Item label="Project Coordinator">
                  {project?.ref_project_coordinator?.username}
                </Descriptions.Item>
                <Descriptions.Item label="MEP Manager">
                  {project?.ref_mep_manager?.username}
                </Descriptions.Item>
                <Descriptions.Item label="Joinery Manager">
                  {project?.ref_joinery_manager?.username}
                </Descriptions.Item>
              </Descriptions>
              <Row gutter={gutter} className="mt-5">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Descriptions bordered layout="vertical" column={1}>
                    <Descriptions.Item label="Default Team Members">
                      <div style={{ maxHeight: "250px", overflow: "scroll" }}>
                        <List
                          // bordered
                          size="small"
                          dataSource={defaultUsers}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                // title={item}
                                description={item.username}
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Descriptions bordered layout="vertical" column={1}>
                    <Descriptions.Item label="Team Members">
                      <div style={{ maxHeight: "250px", overflow: "scroll" }}>
                        {project?.projectMembers &&
                        project?.projectMembers.length ? (
                          <List
                            // bordered
                            size="small"
                            dataSource={project?.projectMembers}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<Avatar icon={<UserOutlined />} />}
                                  // title={item}
                                  description={
                                    item?.ref_project_member?.username
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <>no-record</>
                        )}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              {project?.is_percentage ? (
                <Descriptions
                  className="mt-5"
                  title={"Payment Milestone Option 2"}
                  bordered
                  column={1}
                  size="small"
                  extra={
                    canUpdate && (
                      <Button
                        type="link"
                        onClick={() => setAddMileStoneWithPercentage(true)}
                      >
                        Add Milestone
                      </Button>
                    )
                  }
                >
                  <Descriptions.Item label={"Milestone Name"}>
                    {"Percentage"}
                  </Descriptions.Item>
                  {project?.projectMilestone &&
                    project?.projectMilestone.length &&
                    project?.projectMilestone.map((milestone) => {
                      return (
                        <Descriptions.Item label={milestone?.milestone_name}>
                          <Row justify="space-between">
                            <Col>{milestone?.percentage + "%"}</Col>
                            <Col>
                              <Space>
                                <Button
                                  size="small"
                                  type="link"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    setMileStoneWithPercentageData({
                                      milestone_name: milestone?.milestone_name,
                                      project_milestone_id:
                                        milestone?.project_milestone_id,
                                      percentage: milestone?.percentage,
                                    });
                                    setEditMileStoneWithPercentage(true);
                                  }}
                                ></Button>
                                <Popconfirm
                                  title="Delete milestone"
                                  description={
                                    "Are you sure you want to delete " +
                                    milestone?.milestone_name
                                  }
                                  onConfirm={() =>
                                    handleDeleteMilestone(
                                      milestone?.project_milestone_id
                                    )
                                  }
                                  onCancel={() => {
                                    return 0;
                                  }}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    size="small"
                                    type="link"
                                    danger
                                    icon={<DeleteOutlined />}
                                  ></Button>
                                </Popconfirm>
                              </Space>
                            </Col>
                          </Row>
                        </Descriptions.Item>
                      );
                    })}
                </Descriptions>
              ) : (
                <Descriptions
                  className="mt-5"
                  title={"Payment Milestone Option 1"}
                  bordered
                  column={1}
                  size="small"
                  layout="vertical"
                  extra={
                    canUpdate && (
                      <Button type="link" onClick={() => setAddMileStone(true)}>
                        Add Milestone
                      </Button>
                    )
                  }
                >
                  <Descriptions.Item label={"Milestone Name"}>
                    <div
                      style={{
                        maxHeight: "250px",
                        overflow: "scroll",
                        overflowX: "hidden",
                      }}
                    >
                      {project?.projectMilestone &&
                      project?.projectMilestone.length ? (
                        <List
                          // bordered
                          size="small"
                          dataSource={project?.projectMilestone}
                          renderItem={(item) => (
                            <List.Item
                              actions={[
                                <Button
                                  size="small"
                                  type="link"
                                  onClick={() => {
                                    setMileStoneData({
                                      milestone_name: item?.milestone_name,
                                      project_milestone_id:
                                        item?.project_milestone_id,
                                      percentage: item?.percentage,
                                      milestone_status: item?.milestone_status,
                                    });
                                    setEditMileStone(true);
                                  }}
                                  icon={<EditOutlined />}
                                ></Button>,
                                <Popconfirm
                                  title="Delete milestone"
                                  description={
                                    "Are you sure you want to delete " +
                                    item?.milestone_name
                                  }
                                  onConfirm={() =>
                                    handleDeleteMilestone(
                                      item?.project_milestone_id
                                    )
                                  }
                                  onCancel={() => {
                                    return 0;
                                  }}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    size="small"
                                    type="link"
                                    danger
                                    icon={<DeleteOutlined />}
                                  ></Button>
                                </Popconfirm>,
                              ]}
                            >
                              <List.Item.Meta
                                description={
                                  item?.milestone_status ? (
                                    <>
                                      {item?.milestone_name + " "}
                                      <Tag size="small" color="#87d068">
                                        Completed
                                      </Tag>
                                    </>
                                  ) : (
                                    item?.milestone_name
                                  )
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <>no-record</>
                      )}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              )}
              {/* <Descriptions className='mt-5' title={"Payment Milestone " + (project?.is_percentage ? "Option 2" : "Option 1")} bordered column={1} size='small'>
                            <Descriptions.Item label={'Milestone Name'}>{'Percentage'}</Descriptions.Item>
                            {project?.projectMilestone && project?.projectMilestone.length && project?.projectMilestone.map(milestone => {
                                return (
                                    <Descriptions.Item label={milestone?.milestone_name}>{project?.is_percentage ? milestone?.percentage + "%" : ''}</Descriptions.Item>
                                )
                            })}
                        </Descriptions> */}

              <Card
                className="mt-5"
                title={"Emails"}
                size="small"
                extra={
                  canUpdate && (
                    <Button type="link" onClick={() => setAddEmail(true)}>
                      Add Email
                    </Button>
                  )
                }
              >
                {(project?.projectMembersEmail &&
                  project?.projectMembersEmail.length &&
                  project?.projectMembersEmail.map(
                    ({ email, project_members_email_id }, index) => (
                      <Tag
                        key={"add_email"}
                        className="hoverable-item"
                        bordered={false}
                        closable
                        onClose={(e) => {
                          e.preventDefault();
                          confirm({
                            title: "Delete Email",
                            content: `Are you sure to delete ${email}?`,
                            onOk() {
                              handleDeleteEmail(project_members_email_id);
                            },
                            onCancel() {
                              return 0;
                            },
                          });
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            setEmailData({ email, project_members_email_id });
                            setEditEmail(true);
                          }}
                        >
                          {email}
                        </span>
                      </Tag>
                    )
                  )) ||
                  "no-record"}
              </Card>

              <Card
                className="mt-5"
                title={"Phase Screen"}
                size="small"
                extra={
                  canUpdate && (
                    <Button type="link" onClick={() => setAddPhase(true)}>
                      Add Phase
                    </Button>
                  )
                }
              >
                {(project?.projectPhase &&
                  project?.projectPhase.length &&
                  project?.projectPhase.map(
                    ({ phase_name, project_phases_id }) => (
                      <Tag
                        className="hoverable-item"
                        color="#108ee9"
                        closable
                        onClose={(e) => {
                          e.preventDefault();
                          confirm({
                            title: "Delete Phase",
                            content: `Are you sure to delete ${phase_name}?`,
                            onOk() {
                              handleDeletePhase(project_phases_id);
                            },
                            onCancel() {
                              return 0;
                            },
                          });
                        }}
                        bordered={false}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            setPhaseData({ phase_name, project_phases_id });
                            setEditPhase(true);
                          }}
                        >
                          {phase_name}
                        </span>
                      </Tag>
                    )
                  )) ||
                  "no-record"}
              </Card>

              <Card
                className="mt-5"
                title={"Project Meetings"}
                size="small"
                extra={
                  canUpdate && (
                    <Button type="link" onClick={() => setAddMeeting(true)}>
                      Add Meeting
                    </Button>
                  )
                }
              >
                <List
                  className="mt-5"
                  size="small"
                  loading={meetingLoading}
                  // header={<div>Project Meetings</div>}
                  // style={{ maxHeight: '160px', overflow: 'scroll' }}
                  // footer={<div>Footer</div>}
                  bordered
                  dataSource={project?.projectMeetings}
                  renderItem={(item) => (
                    <List.Item
                      key={item?.project_meeting_id}
                      actions={[
                        <Button
                          danger
                          shape="circle"
                          icon={<MinusOutlined />}
                          onClick={() =>
                            handleDeleteMeeting(item?.project_meeting_id)
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
                            <span style={{ fontSize: "11px", color: "gray" }}>
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
              </Card>
            </div>
          )}
        </Card>

        {editProject && (
          <UpdateProject
            editProject={editProject}
            setEditProject={setEditProject}
            project_id={state.id}
            fetch={projectDetails}
            project={project}
          />
        )}
        {addEmail && (
          <AddEmail
            addEmail={addEmail}
            setAddEmail={setAddEmail}
            project_id={state.id}
            fetch={projectDetails}
            existEmail={project?.projectMembersEmail}
          />
        )}
        {addPhase && (
          <AddPhase
            addPhase={addPhase}
            setAddPhase={setAddPhase}
            project_id={state.id}
            fetch={projectDetails}
          />
        )}
        {addMileStone && (
          <AddMileStone
            addMileStone={addMileStone}
            setAddMileStone={setAddMileStone}
            project_id={state.id}
            fetch={projectDetails}
          />
        )}
        {addMileStoneWithPercentage && (
          <AddMileStoneWithPercentage
            addMileStoneWithPercentage={addMileStoneWithPercentage}
            setAddMileStoneWithPercentage={setAddMileStoneWithPercentage}
            project_id={state.id}
            fetch={projectDetails}
          />
        )}
        {editEmail && (
          <UpdateEmail
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            project_id={state.id}
            fetch={projectDetails}
            email={emailData?.email}
            project_members_email_id={emailData?.project_members_email_id}
          />
        )}
        {editPhase && (
          <UpdatePhase
            editPhase={editPhase}
            setEditPhase={setEditPhase}
            project_id={state.id}
            fetch={projectDetails}
            phase={phaseData?.phase_name}
            project_phases_id={phaseData?.project_phases_id}
          />
        )}
        {editMileStone && (
          <UpdateMileStone
            editMileStone={editMileStone}
            setEditMileStone={setEditMileStone}
            project_id={state.id}
            fetch={projectDetails}
            milestone_name={mileStoneData?.milestone_name}
            milestone_status={mileStoneData?.milestone_status}
            project_milestone_id={mileStoneData?.project_milestone_id}
          />
        )}
        {editMileStoneWithPercentage && (
          <UpdateMileStoneWithPercentage
            editMileStoneWithPercentage={editMileStoneWithPercentage}
            setEditMileStoneWithPercentage={setEditMileStoneWithPercentage}
            project_id={state.id}
            fetch={projectDetails}
            milestone_name={mileStoneWithPercentageData?.milestone_name}
            percentage={mileStoneWithPercentageData?.percentage}
            project_milestone_id={
              mileStoneWithPercentageData?.project_milestone_id
            }
          />
        )}

        {addMeeting && (
          <AddMeeting
            addMeeting={addMeeting}
            setAddMeeting={setAddMeeting}
            project_id={state.id}
            fetch={projectDetails}
          />
        )}
      </>
    );
}

export default ViewProject
