import authAction from "./actions/authAction";
import permissionsActions from "./actions/permissionsActions";
import lookupActions from "./actions/lookupAction";
import projectAction from "./actions/projectAction";
import recentProjectsAction from "./actions/recentProjectsAction";
import filesAction from "./actions/FilesAction"

const setAuthUser = (user) => {
  return (dispatch) => {
    return dispatch(authAction.setAuthUser(user));
  };
};

const updateAuthUser = (data) => {
  return (dispatch) => {
    return dispatch(authAction.updateAuthProps(data));
  };
};

const resetAuthUser = () => {
  return (dispatch) => {
    return dispatch(authAction.resetAuthProps());
  };
};

const setPermissions = (data) => {
  return (dispatch) => {
    return dispatch(permissionsActions.setPermissions(data));
  };
};

const resetPermissions = (data) => {
  return (dispatch) => {
    return dispatch(permissionsActions.resetPermission());
  };
};

const setLookup = (data) => {
  return (dispatch) => {
    return dispatch(lookupActions.setLookup(data));
  };
};

const resetLookup = () => {
  return (dispatch) => {
    return dispatch(lookupActions.resetLookup());
  };
};

const setProject = (data) => {
  return (dispatch) => {
    return dispatch(projectAction.setProject(data));
  };
};

const setRecentProject = (data) => {
  return (dispatch) => {
    return dispatch(recentProjectsAction.setRecentProject(data));
  };
};

const setFilesDetails = (data) => {
  return (dispatch) => {
    return dispatch(filesAction.setProjectFiles(data));
  };
};

export default {
  setAuthUser,
  updateAuthUser,
  resetAuthUser,
  setPermissions,
  setLookup,
  resetPermissions,
  resetLookup,
  setProject,
  setRecentProject,
  setFilesDetails,
};
