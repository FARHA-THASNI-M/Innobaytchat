import { RESET_PERMISSIONS, SET_PERMISSIONS } from "../types";

const setPermissions = (data) => ({
  type: SET_PERMISSIONS,
  payload: {
    permissions: data,
  },
});

const resetPermission = () => ({
  type: RESET_PERMISSIONS,
  status: "success",
  payload: {},
});

export default {
  setPermissions,
  resetPermission
};
