import { SET_RECENT_PROJECTS } from "../types";

export const setRecentProject = (data) => ({
  type: SET_RECENT_PROJECTS,
  payload: {
    ...data,
  },
});

export default {
  setRecentProject,
};
