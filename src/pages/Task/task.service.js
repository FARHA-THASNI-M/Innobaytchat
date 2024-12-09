import {
  deleteApi,
  downloadApi,
  getApi,
  patchApi,
  postApi,
} from "../../services/api";

export const getProjectCategories = (project_id) => {
  return getApi(`/project/${project_id}/categories`);
};
export const getChartData = (project_id) => {
  return getApi(`/project/${project_id}/ganttchart`);
};

export const getTaskListMeta = (project_id, data) => {
  return postApi(`/project/${project_id}/task-meta`, data);
};

export const getProjectPhases = (project_id) => {
  return getApi(`/project/${project_id}/phases`);
};

export const taskList = (data) => {
  return postApi(`/task/list`, data);
};

export const createTask = (data) => {
  return postApi(`/task/create`, data);
};

export const updateTask = (task_id, data) => {
  return patchApi(`/task/${task_id}/update`, data);
};

export const addComment = (data) => {
  return postApi(`/comment/create`, data);
};

export const getComments = (data) => {
  return postApi(`/comment/list`, data);
};

export const deleteTask = (task_id) => {
  return deleteApi(`/task/${task_id}`);
};

export const deleteComment = (id) => {
  return deleteApi(`/comment/${id}`);
};

export const updateComment = (id, data) => {
  return patchApi(`/comment/${id}/update`, data);
};

export const subtaskList = (data) => {
  return postApi(`/task/sub-task/list`, data);
};

export const taskDetails = (id) => {
  return getApi(`/task/${id}/details`);
};

export const snagList = (data) => {
  return postApi(`/snag/list`, data);
};

export const createSnag = (data) => {
  return postApi(`/snag/create`, data);
};

export const updateSnag = (id, data) => {
  return patchApi(`/snag/${id}/update`, data);
};

export const deleteSnag = (id, data) => {
  return deleteApi(`/snag/${id}`);
};

export const snagDetails = (id) => {
  return getApi(`/snag/${id}/details`);
};

export const violationList = (data) => {
  return postApi(`/violation/list`, data);
};

export const createViolation = (data) => {
  return postApi(`/violation/create`, data);
};

export const updateViolation = (id, data) => {
  return patchApi(`/violation/${id}/update`, data);
};

export const deleteViolation = (id) => {
  return deleteApi(`/violation/${id}`);
};

export const downloadViolation = (id) => {
  return downloadApi(`/violation/${id}/details?download=${true}`, "GET", null);
};

export const violationDetails = (id) => {
  return getApi(`/violation/${id}/details`);
};

export const fetchTaskByStatus = async (id, status, page, limit) => {
  return await getApi(
    `/task/subtask/${id}/${status}?page=${page}&pageSize=${limit}`
  );
};
