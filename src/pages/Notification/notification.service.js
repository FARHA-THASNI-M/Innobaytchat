import { getApi } from "../../services/api";

export const getNotificationList = (page = 1, pageSize = 25) => {
  return getApi(`/notifications/list?page=${page}&pageSize=${pageSize}`);
};
