import { AUTH_USER, RESET_AUTH_USER } from "../types";
const initialState = {
  user: {},
  isAuthenticated: false,
  path: "/",
  loading: false,
};

const AuthReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_USER:
      state = { ...state, ...payload };
      return state;
    case RESET_AUTH_USER:
      state = initialState;
      return state;
    default:
      return state;
  }
};
export default AuthReducer;
