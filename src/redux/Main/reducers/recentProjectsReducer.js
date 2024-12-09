import { SET_RECENT_PROJECTS } from "../types";
const initialState = {
  projects: [],
};

const RecentProjectsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_RECENT_PROJECTS:
      state = { ...state, ...payload };
      return state;
    default:
      return state;
  }
};
export default RecentProjectsReducer;
