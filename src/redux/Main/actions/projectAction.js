import { SET_CURRENT_PROJECT } from "../types";

const setProject = (data) => ({
  type: SET_CURRENT_PROJECT,
  payload: {
    project: data,
  },
});

export default {
  setProject,
};
