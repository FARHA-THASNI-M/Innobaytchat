import {
  SmallDashOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Modal, Progress, Space, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { PERMISSIONS } from "../../constants/permissions";
import { getItem, getPermissions, getProjectStatus } from "../../services";
import styles from "../../styles/_projectListingComponent.module.css";
const { confirm } = Modal;
function ProjectListingComponent({ project, handleDelete }) {
  // view/1
  const navigate = useNavigate();
  const permissions = getPermissions();
  const navigateToTask = () => {
    navigate(ROUTES.TASK.PATH, { state: { project } });
  };

  const onDeleteProject = async (data) => {
    confirm({
      title: "Delete Project",
      content: `Are you sure to delete ${data.project_name} project?`,
      onOk() {
        handleDelete(data?.project_id);
      },
      onCancel() {
        return 0;
      },

    });
  }

  return (
    <>
      <div
        className={styles.projectlistingmaincomponent}

      >
        <div className={styles.cardsectionnamecontainer} onClick={navigateToTask}>
          <div
            style={{
              background: "#0084FF",
              color: "#FFF",
              fontWeight: "600",
              padding: "1px 3px",
              width: "70px",
            }}
          >
            {project?.project_number}
          </div>
          <div style={{ width: "300px", maxWidth: "100%" }}>
            {project?.project_name}
          </div>
        </div>

        <div className={styles.cardsectionsrow}>
          <div className={styles.blueborderbubble}>{project?.project_status && getProjectStatus(project?.project_status)?.value || ''}</div>
          <div>
            <div>Delayed</div>
            <div style={{ color: "#EC2027" }}>2 Tasks</div>
          </div>
        </div>

        <div className={styles.cardsectionsrow}>
          <div>
            <div style={{ color: "#6B7280" }}>Timeline</div>
            <div style={{ color: "#6B7280" }}>{moment.utc(project?.project_start_date).format("DD MMM, YY") + "-" + moment.utc(project?.project_end_date).format("DD MMM, YY")}</div>
          </div>
          <div>
            <Avatar.Group
              maxCount={2}
              maxPopoverTrigger="click"
              size="large"
              maxStyle={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
                cursor: "pointer",
              }}
            >
              <Tooltip title={<Space direction="vertical">
                <b>{project?.ref_project_manager?.username}</b>
                {project?.ref_project_manager?.ref_role?.role_name}
              </Space>} placement="top">
                <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
              <Tooltip title={<Space direction="vertical">
                <b>{project?.ref_project_coordinator?.username}</b>
                {project?.ref_project_coordinator?.ref_role?.role_name}
              </Space>} placement="top">
                <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
            </Avatar.Group>
          </div>
        </div>
        <div className={styles.cardsectionsrow}>
          <div style={{ width: "300px", maxWidth: "80%" }}>
            <Progress percent={project?.project_percentage} status="active" />
          </div>
          <div>
            <Dropdown
              menu={{
                items: [
                  getItem(permissions.includes(PERMISSIONS.PROJECT_VIEW), (
                    <div
                      onClick={(e) => {
                        navigate(`${ROUTES.PROJECTS.PATH}/view`, { state: { id: project?.project_id } });
                      }}
                    >
                      Project Settings
                    </div>
                  ), "1"),
                  getItem(permissions.includes(PERMISSIONS.TASK_VIEW), <div onClick={navigateToTask}>Task Settings</div>, "2"),
                  getItem(permissions.includes(PERMISSIONS.PROJECT_DELETE),
                    <Button danger type="link" size="small" onClick={() => onDeleteProject(project)}>Move to trash</Button>
                    , "3"),
                ]
              }}
              placement="bottom"
              trigger={'click'}
            >
              <Button style={{ border: "none" }}>
                <SmallDashOutlined />
              </Button>
            </Dropdown>
          </div>
        </div >
      </div >
    </>
  );
}

export default ProjectListingComponent;
