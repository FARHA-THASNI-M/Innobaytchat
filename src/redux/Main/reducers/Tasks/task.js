import { FETCH_SUBTASK_BY_TASKID_ERROR, FETCH_SUBTASK_BY_TASKID_REQUEST, FETCH_SUBTASK_BY_TASKID_SUCCESS } from "../../types";
const initialState = {
  isLoading: false,
  isSuccess: true,
  data: {},
  error: false
};

const TaskByStatusReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_SUBTASK_BY_TASKID_REQUEST:
      state = { ...state, isLoading: true };
      return state;
    case FETCH_SUBTASK_BY_TASKID_SUCCESS:
      state = { ...state, isLoading: false, error: false, ...payload };
      return state;
    
    case FETCH_SUBTASK_BY_TASKID_ERROR:
        state = { ...state, isLoading: false, isSuccess: false, error: payload.data };
        return state;
    
    default:
      return state;
  }
};
export default TaskByStatusReducer;
