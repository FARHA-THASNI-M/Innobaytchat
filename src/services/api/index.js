import Axios from "axios";
import * as jwt_decode from "jwt-decode";
import config from "./config";
import { generateDeviceId } from "../../utils";
const abortController = new AbortController();
const cancelToken = Axios.CancelToken.source(abortController.signal);
const axiosInstance = Axios.create({
  baseURL: `${config.SERVER_URL}`,
  cancelToken: cancelToken.token,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.ip = JSON.parse(localStorage.getItem("meta"))?.ip;
    config.headers.device_id =
      JSON.parse(localStorage.getItem("meta"))?.deviceId;
    config.headers.is_mobile = "false";
    config.headers.timezone = JSON.parse(
      localStorage.getItem("meta")
    )?.timezone;
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    config.headers.device_token =
      JSON.parse(localStorage.getItem("meta"))?.deviceToken || "not-allowed";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      await localStorage.clear();
      window.location = "/";
    }
    return error;
  }
);

export const getApi = async (action, version = config.VERSION) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }
    const response = await axiosInstance.get(`${version}${action}`); // ,{ signal: abortController.signal }
    return response?.data;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const postApi = async (action, data, ip, version = config.VERSION) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }
    const response = await axiosInstance.post(`${version}${action}`, data);
    if (response?.data?.success) return response?.data;
    throw response;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const postRefreshToken = async (version = config.VERSION) => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      const response = await axiosInstance.post(
        `${version}/admin/refresh-token`,
        { refresh_token }
      );
      if (response?.data?.success) {
        localStorage.setItem("token", response?.data?.data?.token);
        return true;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("session_expire", "Y");
        window.location.reload();
        return false;
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.setItem("session_expire", "Y");
      window.location.reload();
      return false;
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.setItem("session_expire", "Y");
    window.location.reload();
    return false;
  }
};

export const putApi = async (action, data, ip, version = config.VERSION) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }
    const response = await axiosInstance.put(`${version}${action}`, data);
    return response?.data;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const patchApi = async (action, data, ip, version = config.VERSION) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }

    const response = await axiosInstance.patch(`${version}${action}`, data);
    if (response?.data?.success) return response?.data;
    throw response;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const postFormData = async (
  action,
  formData,
  version = config.VERSION
) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }
    const response = await axiosInstance.post(`${version}${action}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const deleteApi = async (action, version = config.VERSION) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }

    const response = await axiosInstance.delete(`${version}${action}`);
    return response?.data;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const getExternalApi = async (action) => {
  try {
    const response = await axiosInstance.get(`${action}`);

    const data = {};
    if (response?.status === 200) data.status = true;
    else data.status = false;
    data.data = response?.data ? response?.data : null;
    data.message = response?.data?.message;

    return data;
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const downloadApi = async (
  action,
  method = "POST",
  data,
  version = config.VERSION
) => {
  try {
    if (localStorage.getItem("token")) {
      const payload = jwt_decode.jwtDecode(localStorage.getItem("token"));

      if (payload.exp * 1000 < Date.now()) {
        await postRefreshToken();
      }
    }
    if (method === "POST") {
      const response = await axiosInstance.post(`${version}${action}`, data, {
        responseType: "blob",
      });
      return response?.data;
    } else {
      const response = await axiosInstance.get(`${version}${action}`, {
        responseType: "blob",
      });
      return response?.data;
    }
  } catch (error) {
    if (Axios.isCancel(error)) {
      return { message: "Request cancelled" };
    } else {
      return error.response?.data;
    }
  }
};

export const cancelRequest = () => {
  abortController.abort();
};
