import {
  BarsOutlined,
  CalendarOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PartitionOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Flex, Popover, Space, Tabs, Tag, Typography } from "antd";
import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, TITLE } from "../../../constants";
import { persistor } from "../../../redux/Store/Store";
import { clearOnLogout, getPermissions, getProject, getUserDetails, getUserShortName } from "../../../services";
import { logout } from "../service";
import { PERMISSIONS } from "../../../constants/permissions";

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

const Header = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = getPermissions();
  const { pathname } = location;
  const project = getProject();
  const userData = getUserDetails();
  const [showSearch, setShowSearch] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("");
  const initialTab = "0";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    enableTabs(pathname);
  }, [pathname]);

  const enableTabs = (path) => {
    switch (path) {
      case ROUTES.DASHBOARD.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.DASHBOARD.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.USER.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.USER.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.ROLE.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.ROLE.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.PROJECTS.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.PROJECTS.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.CREATE_PROJECTS.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.CREATE_PROJECTS.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.VIEW_PROJECTS.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.VIEW_PROJECTS.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.TASK.PATH: {
        setShowSearch(false);
        setShowTabs(true);
        setHeaderTitle(ROUTES.TASK.TITLE);
        break;
      }
      case ROUTES.GANTT.PATH: {
        setShowSearch(false);
        setShowTabs(true);
        setHeaderTitle(ROUTES.GANTT.TITLE);
        break;
      }
      case ROUTES.CALENDER.PATH: {
        setShowSearch(false);
        setShowTabs(true);
        setHeaderTitle(ROUTES.CALENDER.TITLE);
        break;
      }
      case ROUTES.FILES.PATH: {
        setShowSearch(false);
        setShowTabs(true);
        setHeaderTitle(ROUTES.FILES.TITLE);
        break;
      }
      case ROUTES.OLDER_FILES.PATH: {
        setShowSearch(false);
        setShowTabs(true);
        setHeaderTitle(ROUTES.FILES.TITLE);
        setActiveTab("3");
        break;
      }
      case ROUTES.CHAT.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.CHAT.TITLE);
        setActiveTab(initialTab);
        break;
      }
      case ROUTES.TASK_DETAILS.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.TASK_DETAILS.TITLE);
        setActiveTab(initialTab);
        break;
      }

      case ROUTES.NOTIFICATION.PATH: {
        setShowSearch(false);
        setShowTabs(false);
        setHeaderTitle(ROUTES.NOTIFICATION.TITLE);
        setActiveTab(initialTab);
        break;
      }
      default: {
        setShowSearch(false);
        setShowTabs(false);
        setActiveTab(initialTab);
        break;
      }
    }
  };

  const logoutHandler = () => {
    props.setAuthUser({ loading: true });
    logout()
      .then((data) => {
        persistor.flush().then(() => {
          clearOnLogout(props);
          return navigate(ROUTES.LOGIN.PATH);
        });
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
        props.setAuthUser({ loading: false });
      });
  };

  const items = [
    // {
    //   key: "profile",
    //   label: (
    //     <Popover content={<>
    //       <Typography.Text>{userData?.user?.email}</Typography.Text>
    //     </>} title={<>{userData?.user?.username + " "}<Tag color="green">{userData?.user?.ref_role?.role_name}</Tag></>}>
    //       <Typography.Text type="secondary">{userData?.user?.first_name + " " + userData?.user?.last_name}</Typography.Text>
    //     </Popover>
    //   ),
    // },
    {
      key: "logout",
      label: (
        <Button
          type="link"
          icon={<LogoutOutlined />}
          onClick={logoutHandler}
          danger
        >
          {TITLE.LOGOUT}
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: "0",
      label: "Task List",
      icon: <BarsOutlined />,
    },
    getItem(
      permissions.includes(PERMISSIONS.GANTT_VIEW) || false,
      "Gantt Chart",
      "1",
      <PartitionOutlined />,
      null,
      null
    ),
    getItem(
      permissions.includes(PERMISSIONS.CALENDAR_VIEW) || false,
      "Calendar",
      "2",
      <CalendarOutlined />,
      null,
      null
    ),
    getItem(
      permissions.includes(PERMISSIONS.FILES_VIEW) || false,
      "Files",
      "3",
      <FileOutlined />,
      null,
      null
    ),
  ];

  const onChange = (key) => {
    setActiveTab(key);
    switch (key) {
      case "1": {
        navigate(ROUTES.GANTT.PATH, { state: { project } });
        break;
      }
      case "2": {
        navigate(ROUTES.CALENDER.PATH);
        break;
      }
      case "3": {
        navigate(ROUTES.FILES.PATH);
        break;
      }
      case "4": {
        navigate(ROUTES.CHAT.PATH);
        break;
      }
      default:
        navigate(ROUTES.TASK.PATH, { state: { project } });
        break;
    }
  };

  return (
   props.project.project &&
    !props.project.project.is_mobile  &&  <header
      style={{
        padding: 0,
        background: "white",
        height: "60px",
      }}
    >
      <Flex vertical={false} justify={"space-between"}>
        <p
          type="text"
          // icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          // onClick={() => props.setCollapsed(!props.collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            paddingTop:"12px",
            paddingLeft:"12px",

          }}
        >
          {headerTitle}
        </p>

        <Flex align="center" style={{marginRight:"10px"}} vertical={false}>
            {showTabs && (
              <Tabs
                activeKey={activeTab}
                items={tabItems}
                onChange={onChange}
              />
            )}
        </Flex>
        <Space style={{ float: "right", padding: "20px" }} align="baseline">
          {userData?.user?.first_name && userData?.user?.last_name ? <Popover content={<>
            <Typography.Text>{userData?.user?.email}</Typography.Text>
          </>} title={<>{userData?.user?.username + " "}<Tag color="green">{userData?.user?.ref_role?.role_name}</Tag></>}>
            <Typography.Text type="secondary">{userData?.user?.first_name + " " + userData?.user?.last_name}</Typography.Text>
          </Popover> : <></>}
          <Dropdown
            menu={{
              items,
            }}
          >
            {userData?.user?.first_name && userData?.user?.last_name ?
              <Avatar
                style={{ backgroundColor: "#87d068" }}
              // icon={<UserOutlined />}
              >{getUserShortName(userData?.user?.first_name, userData?.user?.last_name)}</Avatar>
              : <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              ></Avatar>
            }
          </Dropdown>
        </Space>
      </Flex>
    </header>
  );
};

export default Header;
