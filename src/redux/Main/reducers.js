import { combineReducers } from "redux";
import { AUTH_USER } from "./types";
import PermissionReducer from "./reducers/permissionReducer";
import LookupReducer from "./reducers/lookupReducer";
import AuthReducer from "./reducers/authReducer";
import TaskByStatusReducer from "./reducers/Tasks/task";
import ProjectReducer from "./reducers/projectReducer";
import RecentProjectsReducer from "./reducers/recentProjectsReducer";
import FilesReducer from "./reducers/filesReducer";
let dataState = {
  user: null,
  path: "/",
  currentMenuTitle: "",
  breadCrumbPath: null,
};

const main = (state = dataState, action) => {
  switch (action.type) {
    case AUTH_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          details: action.payload.user,
        },
      };
    }
    case `UPDATE_${AUTH_USER}`: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    }
    case `RESET_${AUTH_USER}`: {
      return {
        ...state,
        user: {},
      };
    }
    default:
      return state;
  }
};

const reducers = combineReducers({
  // main,
  permissions: PermissionReducer,
  lookup: LookupReducer,
  auth: AuthReducer,
  taskByStatus: TaskByStatusReducer,
  project: ProjectReducer,
  recentProjects: RecentProjectsReducer,
  files:FilesReducer
});

export default reducers;
