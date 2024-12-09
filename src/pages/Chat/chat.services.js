import {
  deleteApi,
  getApi,
  patchApi,
  postApi,
  putApi,
} from "../../services/api";

export const getAgoraAccessToken = () => {
  return getApi("/agora/token");
};
export const userprofile = (user_id) => {
  return getApi(`/user/detail`);
};

export const agoraUsersList = () => {
  return getApi(`/agora/users/list`);
};

export const fileStore = (body) => {
  return postApi(`/files/create`, body);
};

export const fileUpload = (body) => {
  return postApi(`/chat/message/file/generate-url`, body);
};
export const allUserList = () => {
  return getApi(`/user/list`);
};

export const allGroupList = () => {
  return getApi(`/chat/group/list`);
};
