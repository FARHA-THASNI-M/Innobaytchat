import { FETCH_SUBTASK_BY_TASKID_ERROR, FETCH_SUBTASK_BY_TASKID_REQUEST, FETCH_SUBTASK_BY_TASKID_SUCCESS } from "../../types";

export const setSubtaskError = (data) => ({
  type: FETCH_SUBTASK_BY_TASKID_ERROR,
  payload: {
    data
  },
});

export const setSubtaskSuccess = (data) => ({
  type: FETCH_SUBTASK_BY_TASKID_SUCCESS,
  payload: data,
});

export const setSubtaskRequest = () => ({
    type: FETCH_SUBTASK_BY_TASKID_REQUEST,
    payload: {},
  });

export default {
    setSubtaskRequest,
    setSubtaskSuccess,
    setSubtaskError
};
