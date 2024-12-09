import { SET_PROJECT_FILES } from "../types";
const initialState = {
  files: [],
};

const FilesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PROJECT_FILES:
      state = { ...state, ...payload };
      return state;
    default:
      return state;
  }
};
export default FilesReducer;
