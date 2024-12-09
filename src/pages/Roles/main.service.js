import {
  deleteApi,
  getApi,
  postApi,
  putApi
} from "../../services/api/index";

export const getUserDetails = () => {
  return postApi("/user/list");
};

export const createRole = (data) => {
  return postApi("/role/create", data);
};

export const getRoleDetail = (id) => {
  return getApi(`/role/${id}/details`);
};

export const updateRoleDetails = (data) => {
  return putApi(`/role/update`, data);
};

export const deleteRoleDetails = (id) => {
  return deleteApi(`/role/${id}`);
};

export const getRoleList = () => {
  return getApi("/role/getallroles");
};
export const getAllPermission = () => {
  return getApi("/permission/getallpermissions");
};

export const createRolePermission = (data) => {
  return postApi("/role-permission/create", data);
};

export const getRolePermissionByRoleId = (id) => {
  return getApi(`/role-permission/role/${id}`);
};
