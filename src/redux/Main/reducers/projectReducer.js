import { SET_CURRENT_PROJECT } from "../types";
const initialState = {
  project: {},
};

const ProjectReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PROJECT:
      state = { ...state, ...payload };
      return state;
    default:
      return state;
  }
};
export default ProjectReducer;
