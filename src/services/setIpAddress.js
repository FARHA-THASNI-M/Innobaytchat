import axios from "axios";

export const setIpAddress = (ip) => {
  if (ip) {
    console.log("set ip: ", ip);
    axios.defaults.headers.common["ip"] = ip;
  } else {
    axios.defaults.headers.common["ip"] = null;
  }
};

export const setDeviceId = (deviceId) => {
  if (deviceId) {
    axios.defaults.headers.common["device_id"] = deviceId;
  } else {
    axios.defaults.headers.common["device_id"] = null;
  }
};

export const setTimeZone = (timezone) => {
  if (timezone) {
    axios.defaults.headers.common["timezone"] = timezone;
  } else {
    axios.defaults.headers.common["timezone"] = null;
  }
};

export const setIsMobile = (is_mobile = false) => {
  axios.defaults.headers.common["is_mobile"] = is_mobile;
};
