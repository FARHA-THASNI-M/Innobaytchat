import { useSelector } from "react-redux";
import {
  getProjectMembers,
  getProjectUsers,
  getRecentProjects,
  getUsersList,
  projectBasicDetails,
  updateRecentProject,
} from "../pages/Projects/project.service";
import {
  getChartData,
  getProjectCategories,
  getProjectPhases,
} from "../pages/Task/task.service";

import { resetSocket } from "./socket";

export const getUserId = () => {
  return localStorage.getItem("id");
};

export const clearOnLogout = (props) => {
  resetSocket();
  localStorage.clear();
  sessionStorage.clear();
  props.resetLookup();
  props.resetPermissions();
  props.resetAuthUser();
  props.setProject({});
  props.setRecentProject({});
   props.setFilesDetails({});
};

export const getUserDetails = () => {
  const user = useSelector((state) => state.mainReducers?.auth);
  return user;
};

export const getRecentProjectDetails = () => {
  const recentProjects = useSelector(
    (state) => state.mainReducers?.recentProjects
  );
  return recentProjects;
};

export const getPermissions = () => {
  const permissions = useSelector((state) => state.mainReducers?.permissions);
  return permissions?.permissions || [];
};

export const isAdmin = () => {
  const permissions = useSelector((state) => state.mainReducers?.permissions);
  return permissions?.permissions;
};

export const getLookup = () => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  return lookup?.lookup || {};
};

export const getProject = () => {
  const project = useSelector((state) => state.mainReducers.project);
  return project?.project || {};
};

export const getFilesDetails = () => {
  const files = useSelector((state) => state.mainReducers.files);
  return files.fileDetails || {};
};

export const getItem = (show, label, key) => {
  if (show) {
    return {
      label,
      key,
    };
  } else return;
};

export const getProjectStatus = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { PROJECT_STATUS = [] } = lookup?.lookup;
  return getLookupData(PROJECT_STATUS, value);
};

export const getPriority = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { PRIORITY = [] } = lookup?.lookup;
  return getLookupData(PRIORITY, value);
};

export const getType = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { TYPE = [] } = lookup?.lookup;
  return getLookupData(TYPE, value);
};

export const getViolationCategory = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { VIOLATION_CATEGORY = [] } = lookup?.lookup;
  return getLookupData(VIOLATION_CATEGORY, value);
};

export const getRecurrenceType = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { RECURRENCE_TYPE = [] } = lookup?.lookup;
  return getLookupData(RECURRENCE_TYPE, value);
};

export const getViolationSuggestedBy = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { VIOLATION_SUGGESTED_BY = [] } = lookup?.lookup;
  return getLookupData(VIOLATION_SUGGESTED_BY, value);
};

export const getTaskStatus = (value = null) => {
  const lookup = useSelector((state) => state.mainReducers?.lookup);
  const { TASK_STATUS = [] } = lookup?.lookup;
  return getLookupData(TASK_STATUS, value);
};

const getLookupData = (data, value) => {
  if (value) {
    if (data && data.length) {
      return data.filter(({ key }) => key === value)[0] || {};
    }
  }
  return data;
};

export const getUsersData = async () => {
  return getUsersList().then((data) => {
    if (data.success) {
      return userDataFormatter(data?.data?.rows);
    }
    return [];
  });
};
export const getUsersEmailDropDown = async () => {
  return getUsersList().then((data) => {
    if (data.success) {
      return userDataEmailFormatter(data?.data?.rows);
    }
    return [];
  });
};

export const getProjectUsersData = async (project_id) => {
  return getProjectUsers(project_id).then((data) => {
    if (data.success) {
      return data?.data || [];
    }
    return [];
  });
};

export const getProjectMembersData = async (project_id) => {
  return getProjectMembers(project_id).then((data) => {
    if (data.success) {
      return data?.data;
    }
    return {};
  });
};

export const getProjectCategoriesData = async (project_id) => {
  return getProjectCategories(project_id).then((data) => {
    if (data.success) {
      return data?.data || [];
    }
    return [];
  });
};

export const getProjectPhaseData = async (project_id) => {
  return getProjectPhases(project_id).then((data) => {
    if (data.success) {
      return data?.data || [];
    }
    return [];
  });
};

export const getUserShortName = (first_name, last_name) => {
  if (first_name && last_name) {
    return first_name[0]?.toUpperCase() + last_name[0]?.toUpperCase();
  }
  return first_name[0]?.toUpperCase() + first_name[1]?.toUpperCase();
};

export const userDataFormatter = (data) => {
  return (
    data
      .map(({ user_id, first_name, last_name, ref_role }) => ({
        value: user_id,
        label: `${first_name} ${last_name}`,
        desc: ref_role?.role_name,
        avatar: getUserShortName(first_name, last_name),
        key: user_id,
      })) || []
  );
};

export const userDataEmailFormatter = (data) => {
  return (
    data
      .filter(({ default_user }) => !default_user)
      .map(({ user_id, first_name, last_name, email }) => ({
      value: email,
      label: email,
      desc: `${first_name} ${last_name}`,
      avatar: getUserShortName(first_name, last_name),
      key: user_id,
    })) || []
  );
};

export const getGanttChartData = async (project_id) => {
  return getChartData(project_id).then((data) => {
    if (data.success) {
      return data?.data;
    }
    return [];
  });
};

export const getPriorityColor = (data) => {
  switch (data) {
    case "High":
      return "error";
    case "Low":
      return "processing";
    default:
      return "warning";
  }
};

export const lookupFormatter = (data, labelKey = "key", valueKey = "key") => {
  return (
    data.map((x) => ({
      value: x[valueKey],
      label: x[labelKey],
    })) || []
  );
};

export const getProjectStatusAsObject = (data) => {
  const dataObject = data.reduce((acc, curr) => {
    acc[curr.key] = { ...curr };
    return acc;
  }, {});
  return dataObject;
};

export const setRecentProject = async (project_id) => {
  return updateRecentProject(project_id).then((data) => {
    if (data.success) {
      return data?.data || [];
    }
    return [];
  });
};

export const getRecentProjectsOfUser = async () => {
  return await getRecentProjects().then((data) => {
    if (data.success) {
      return data?.data || [];
    }
    return [];
  });
};

export const getProjectBasicDetails = async (project_id) => {
  return await projectBasicDetails(project_id).then((data) => {
    if (data.success) {
      return data?.data || { project_id };
    }
    return { project_id };
  });
};
