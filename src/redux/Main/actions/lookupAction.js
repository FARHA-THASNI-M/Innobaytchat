import { RESET_LOOKUP, SET_LOOKUP } from "../types";

const setLookup = (data) => ({
  type: SET_LOOKUP,
  payload: {
    lookup: data,
  },
});

const resetLookup = () => ({
  type: RESET_LOOKUP,
  status: "success",
  payload: {},
});

export default {
  setLookup,
  resetLookup,
};
