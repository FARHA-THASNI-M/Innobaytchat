import {
  deleteApi,
  getApi,
  patchApi,
  postApi,
  putApi,
} from "../../services/api";

export const getUsersList = () => {
  return getApi("/user/list");
};

export const getDefaultUsersList = () => {
  return getApi("/user/default-users");
};

export const getCategoriesList = () => {
  return getApi("/categories/getallcategories");
};

export const createProject = (data) => {
  return postApi("/project/create", data);
};

export const projectList = (data) => {
  return postApi("/project/list", data);
};

export const deleteProject = (id) => {
  return deleteApi(`/project/${id}`);
};

export const getProjectDetails = (id) => {
  return getApi(`/project/${id}/details`);
};

export const createEmail = (id, data) => {
  return postApi(`/project/${id}/email`, data);
};

export const createPhase = (id, data) => {
  return postApi(`/project/${id}/phase`, data);
};

export const createMilestone = (id, data) => {
  return postApi(`/project/${id}/milestone`, data);
};

export const updateMilestone = (id, data) => {
  return putApi(`/project/${id}/milestone`, data);
};

export const createMilestoneWithPercentage = (id, data) => {
  return postApi(`/project/${id}/milestone-percentage`, data);
};

export const updateMilestoneWithPercentage = (id, data) => {
  return putApi(`/project/${id}/milestone-percentage`, data);
};

export const deleteProjectEmail = (id, email_id) => {
  return deleteApi(`/project/${id}/email/${email_id}`);
};

export const updateEmail = (id, data) => {
  return putApi(`/project/${id}/email`, data);
};

export const updatePhase = (id, data) => {
  return putApi(`/project/${id}/phase`, data);
};

export const deleteProjectPhase = (id, phase_id) => {
  return deleteApi(`/project/${id}/phase/${phase_id}`);
};

export const deleteProjectMilestone = (id, milestone_id) => {
  return deleteApi(`/project/${id}/milestone/${milestone_id}`);
};

export const updateProject = (id, data) => {
  return patchApi(`/project/${id}/update`, data);
};

export const getAllSubCategories = () => {
  return getApi(`/categories/getallchildcategories`);
};

export const getProjectUsers = (project_id) => {
  return getApi(`/project/${project_id}/users`);
};

export const getProjectMembers = (project_id) => {
  return getApi(`/project/${project_id}/project-members`);
};

export const deleteProjectMeeting = (id, meeting_id) => {
  return deleteApi(`/project/${id}/meeting/${meeting_id}`);
};

export const createProjectMeeting = (id, data) => {
  return postApi(`/project/${id}/meeting`, data);
};

export const updateProjectMeeting = (id, data) => {
  return putApi(`/project/${id}/meeting`, data);
};

export const getRecentProjects = () => {
  return getApi(`/project/recent`);
};

export const updateRecentProject = (id) => {
  return putApi(`/project/${id}/recent`);
};

export const projectBasicDetails = (id) => {
  return getApi(`/project/${id}/basic-details`);
};
