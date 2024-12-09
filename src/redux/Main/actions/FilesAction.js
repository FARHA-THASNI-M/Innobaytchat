import { SET_PROJECT_FILES } from "../types";

export const setProjectFiles = (data) => ({
  type: SET_PROJECT_FILES,
  payload: {
    ...data,
  },
});

export default {
  setProjectFiles,
};
