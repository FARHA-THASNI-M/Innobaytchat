import { deleteApi, patchApi, postApi } from "../../services/api";

export const getFilesListing = (data) => {
  return postApi(`/files/list`, data);
};

export const deleteFile = (id) => {
  return deleteApi(`/files/${id}/delete`);
};

export const updateFile = (id, data) => {
  return patchApi(`/files/${id}/update`, data);
};

export const olderVersionFiles = (data) => {
  return postApi(`/files/older/version`, data);
}
