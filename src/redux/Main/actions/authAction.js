import { AUTH_USER, RESET_AUTH_USER } from "../types";

const setAuthUser = (data) => ({
  type: AUTH_USER,
  status: "success",
  payload: {
    ...data,
  },
});

// const updateAuthProps = (data) => ({
//   type: UPDATE_AUTH_USER,
//   status: "success",
//   payload: {
//     ...data,
//   },
// });

const resetAuthProps = () => ({
  type: RESET_AUTH_USER,
  status: "success",
  payload: {},
});

export default {
  setAuthUser,
  //   updateAuthProps,
  resetAuthProps,
};
