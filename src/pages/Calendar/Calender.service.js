import { getApi } from "../../services/api";

export const getProjectMeetings = (id) => {
  return getApi(`/project/${id}/meetings`);
};
export const getProjectAssignedTasks = (id) => {
  return getApi(`/task/project/${id}/assigned-tasks`);
};
