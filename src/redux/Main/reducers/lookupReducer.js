import { RESET_LOOKUP, SET_LOOKUP } from "../types";
const initialState = {
  lookup: [],
};

const LookupReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOOKUP:
      state = { ...state, ...payload };
      return state;
    case RESET_LOOKUP:
      state = initialState;
      return state;
    default:
      return state;
  }
};
export default LookupReducer;
