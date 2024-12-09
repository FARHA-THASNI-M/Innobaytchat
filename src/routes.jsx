import React, { lazy } from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
import { ROUTES } from "./constants";
import { getUserDetails } from "./services";

const GanttRedirect = lazy(() => import("./pages/Gantt/GanttRedirect"));
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/main"));
const Projects = lazy(() => import("./pages/Projects/main"));
const CreateProject = lazy(() =>
  import("./pages/Projects/CreateProject/CreateProject")
);
const ViewProject = lazy(() =>
  import("./pages/Projects/ViewProject/ViewProject")
);
const UpdateProject = lazy(() =>
  import("./pages/Projects/UpdateProject/UpdateProject")
);
const Notification = lazy(() => import("./pages/Notification/main"));
const Gantt = lazy(() => import("./pages/Gantt/main"));
const Calendar = lazy(() => import("./pages/Calendar/main"));
const Files = lazy(() => import("./pages/Files/main"));
const OlderVersionFIle = lazy(() => import("./pages/Files/OlderVersionFIle"));
const Chat = lazy(() => import("./pages/Chat/main"));
const Task = lazy(() => import("./pages/Task/main"));
const TaskDetails = lazy(() => import("./pages/Task/TaskDetails"));
const SnagDetails = lazy(() => import("./pages/Task/SnagDetails"));
const ViolationDetails = lazy(() => import("./pages/Task/ViolationDetails"));
const NotFound = lazy(() => import("./components/common/error/NotFoundError"));
const User = lazy(() => import("./pages/User/main"));
const UserDetails = lazy(() => import("./pages/User/UserDetails"));
const Role = lazy(() => import("./pages/Roles/main"));
const RoleDetails = lazy(() => import("./pages/Roles/RolesDetails"));
const Permission = lazy(() => import("./pages/Roles/pages/Permission"));
const InternalServerError = lazy(() =>
  import("./components/common/error/InternalServerError")
);

const authenticatedRoutes = (props) => {
  return [
    {
      path: "/",
      element: <Navigate to={ROUTES.CHAT.PATH} replace />,
    },
    {
      path: ROUTES.DASHBOARD.PATH,
      element: <Dashboard />,
    },
    {
      path: ROUTES.PROJECTS.PATH,
      children: [
        {
          index: true,
          element: <Projects {...props} />,
        },
        {
          path: `create`,
          element: <CreateProject />,
        },
        {
          path: `view`,
          element: <ViewProject {...props} />,
        },
        {
          path: `update/:id`,
          element: <UpdateProject />,
        },
      ],
    },
    {
      path: ROUTES.NOTIFICATION.PATH,
      element: <Notification {...props} />,
    },
    {
      path: ROUTES.TASK.PATH,
      children: [
        {
          index: true,
          element: <Task {...props} />,
        },
        {
          path: `details`,
          element: <TaskDetails {...props} />,
        },
      ],
      // element: <Task {...props} />,
    },
    {
      path: ROUTES.SNAG_DETAILS.PATH,
      element: <SnagDetails {...props} />,
    },
    {
      path: ROUTES.VIOLATION_DETAILS.PATH,
      element: <ViolationDetails {...props} />,
    },
    {
      path: ROUTES.GANTT.PATH,
      element: <Gantt {...props} />,
    },
    {
      path: ROUTES.CALENDER.PATH,
      element: <Calendar {...props} />,
    },
    {
      path: ROUTES.USER.PATH,
      children: [
        { index: true, element: <User {...props} /> },
        { path: "details/:key?/:id?", element: <UserDetails {...props} /> },
      ],
    },
    {
      path: ROUTES.ROLE.PATH,
      children: [
        { index: true, element: <Role {...props} /> },
        { path: "details/:key?/:id?", element: <RoleDetails {...props} /> },
        { path: "permission", element: <Permission {...props} /> },
      ],
    },
    {
      path: ROUTES.FILES.PATH,
      children: [
        { index: true, element: <Files {...props} /> },
        { path: "older/version", element: <OlderVersionFIle {...props} /> },
      ],
    },
    {
      path: ROUTES.CHAT.PATH,
      element: <Chat />,
    },
    {
      path: "500",
      element: <InternalServerError {...props} />,
    },
    {
      path: "*",
      element: <NotFound {...props} />,
    },
    {
      path: ROUTES.REDIRECT.PATH,
      element: <GanttRedirect />,
    },
  ];
};

const unauthenticatedRoutes = (props) => {
  return [
    {
      path: ROUTES.LOGIN.PATH,
      element: <Login {...props} />,
    },
    // {
    //   path: ROUTES.REDIRECT.PATH,
    //   element: <GanttRedirect />,
    // },
  ];
};

const Routes = (props) => {
  const navigate = useNavigate();
  const user = getUserDetails();
  const isAuthenticated = user && user.isAuthenticated;
  // props.user?.isAuthenticated || localStorage.getItem("token") ? true : false;

  const routingConfig = useRoutes(
    isAuthenticated ? authenticatedRoutes(props) : unauthenticatedRoutes(props)
  );
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN.PATH);
    }
  }, [navigate]);

  return routingConfig;
};

export default Routes;
