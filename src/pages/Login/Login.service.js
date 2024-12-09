import { getApi, postApi } from "../../services/api/index";

export const login = (data) => {
  return postApi("/user/login", data);
};

export const getPermission = () => {
  return getApi("/role-permission");
};

export const getLookup = () => {
  return getApi("/config");
};

export const getUserProfile = (id) => {
  return getApi(`/user/${id}/profile`);
};
