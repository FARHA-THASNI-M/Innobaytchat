import { AUTH_USER } from "./types";

const setAuthUser = (user) => ({
  type: AUTH_USER,
  status: "success",
  payload: {
    user: user,
  },
});

const updateAuthProps = (data) => ({
  type: `UPDATE_${AUTH_USER}`,
  status: "success",
  payload: {
    ...data,
  },
});

const resetAuthProps = () => ({
  type: `RESET_${AUTH_USER}`,
  status: "success",
  payload: {},
});

export default {
  setAuthUser,
  updateAuthProps,
  resetAuthProps,
};
