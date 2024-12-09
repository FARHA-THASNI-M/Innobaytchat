import { deleteApi, getApi, patchApi, postApi } from "../../services/api/index";

export const getUserDetails = () => {
  return postApi("/user/list");
};

export const createUser = (data) => {
  return postApi("/user/create", data);
};

export const getUserDetail = (id) => {
  return getApi(`/user/${id}/details`);
};

export const updateUserDetails = (id, data) => {
  return patchApi(`/user/${id}/update`, data);
};

export const deleteUserDetails = (id) => {
  return deleteApi(`/user/${id}`);
};

export const getRoleList = () => {
  return getApi("/role/getallroles");
};
