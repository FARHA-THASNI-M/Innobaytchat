import { postApi, getApi } from "../../services/api";

export const getTileData = () => {
  return getApi(`/dashboard/project/count`);
};
export const getTaskTileData = () => {
  return getApi(`/dashboard/task/count`);
};

export const getTaskOverviewData = (body) => {
  return postApi(`/dashboard/task/overview`, body);
};

export const getProjectProgressData = () => {
  return getApi(`/dashboard/project/progress`);
};

export const getProjectStatusData = () => {
  return getApi(`/dashboard/project/status`);
};
export const getTaskInProgressData = () => {
  return getApi(`/dashboard/task/in-progress`);
};
export const getTaskCompletionData = () => {
  return getApi(`/dashboard/task/completion`);
};

export const getTaskStatusData = () => {
  return getApi(`/dashboard/task/status`);
};