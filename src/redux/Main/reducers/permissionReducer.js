import { RESET_PERMISSIONS, SET_LOADING, SET_PERMISSIONS } from "../types";
const initialState = {
  isLoading: true,
  permissions: [],
};

const PermissionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      state = { ...state, isLoading: payload };
      return state;
    case SET_PERMISSIONS:
      state = { ...state, ...payload };
      return state;
    case RESET_PERMISSIONS:
      state = initialState;
      return state;
    default:
      return state;
  }
};
export default PermissionReducer;
