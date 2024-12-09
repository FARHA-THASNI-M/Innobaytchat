import {
  MessageOutlined,
  NotificationOutlined,
  ProjectOutlined,
  UngroupOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Badge, Divider, Layout, Menu, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { COMPANY, ICONS, ROUTES } from "../../../constants";
import { PERMISSIONS } from "../../../constants/permissions";
import { getPermissions, getRecentProjectDetails, getUserDetails, setRecentProject } from "../../../services";

const { Sider } = Layout;

function getItem(show, label, key, icon, children, type) {
  if (show) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  } else return;
}

const colors = ["#FFA500", "#E4CCFD", "#76A5EA"]

const SideMenu = (props) => {
  const navigate = useNavigate();
  const permissions = getPermissions();
  const user = getUserDetails();
  const handleMenuClick = (event) => {
    const selectedMenuItem = event.domEvent.currentTarget; // Get the selected menu item DOM element
    const selectedMenuLabel = selectedMenuItem.textContent; // Get the label (text) of the selected menu item
    props.setAuthUser({ path: event.key });
    navigate(event.key);
  };
  const recentProjects = getRecentProjectDetails()?.projects || []

  const handleNavigation = async (project) => {
    props.setAuthUser({ loading: true });
    props.setRecentProject({ projects: await setRecentProject(project?.project_id) });
    props.setProject(project);
    props.setAuthUser({ loading: false });
    navigate(ROUTES.TASK.PATH, { state: { project } });
  }

  return (
    props.project.project &&
    !props.project.project.is_mobile && (
      <Sider
        key={"slider"}
        trigger={null}
        collapsible
        collapsed={props.collapsed}
        style={{ background: "white" }}
      >
        <div className="logo">
          <h3
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                gap: "5px",
              }}
            >
              <img src={COMPANY.LOGO} height={props?.collapsed ? 10 : 25}></img>{" "}
              {/* {props?.collapsed ? "" : COMPANY.NAME} */}
            </div>
          </h3>
        </div>
        <div className="demo-logo-vertical" />
        <Menu
          key={"SideMenuMenu"}
          // theme="dark"
          mode="inline"
          defaultSelectedKeys={[user?.path || ROUTES.CHAT.PATH]}
          onClick={handleMenuClick}
          items={[
            // getItem(
            //   permissions.includes(PERMISSIONS.DASHBOARD_VIEW) || false,
            //   ROUTES.DASHBOARD.TITLE,
            //   ROUTES.DASHBOARD.PATH,
            //   <img src={ICONS.DASHBOARD} height={14} width={14}></img>
            // ),
            // getItem(
            //   permissions.includes(PERMISSIONS.PROJECT_MENU) || false,
            //   ROUTES.PROJECTS.TITLE,
            //   ROUTES.PROJECTS.PATH,
            //   <ProjectOutlined />
            // ),
            getItem(
              true,
              ROUTES.CHAT.TITLE,
              ROUTES.CHAT.PATH,
              <MessageOutlined />
            ),
            // getItem(
            //   permissions.includes(PERMISSIONS.NOTIFICATION_VIEW) || false,
            //   ROUTES.NOTIFICATION.TITLE,
            //   ROUTES.NOTIFICATION.PATH,
            //   <NotificationOutlined />
            // ),
            // getItem(
            //   true,
            //   ROUTES.USER.TITLE,
            //   ROUTES.USER.PATH,
            //   <UsergroupAddOutlined />
            // ),
            // getItem(
            //   permissions.includes(PERMISSIONS.ROLE_MANAGEMENT_VIEW) || false,
            //   ROUTES.ROLE.TITLE,
            //   ROUTES.ROLE.PATH,
            //   <UngroupOutlined />
            // ),
          ]}
        />
        {/* {!props.collapsed && recentProjects && recentProjects.length > 0 && (
          <>
            <Divider />
            <div style={{ margin: "20px" }}>
              <Typography.Text
                type="secondary"
                style={{ justifyContent: "center" }}
              >
                <b>Recent Projects</b>
              </Typography.Text>
              <div className="mt-2">
                <Space direction="vertical" style={{ height: "0px" }}>
                  {recentProjects.map((project, index) => {
                    return (
                      <>
                        <Badge
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleNavigation(project?.ref_recent_project);
                          }}
                          color={colors[index]}
                          text={project?.ref_recent_project?.project_name}
                        />
                      </>
                    );
                  })}
                </Space>
              </div>
            </div>
          </>
        )} */}
      </Sider>
    )
  );
};

export default SideMenu;
