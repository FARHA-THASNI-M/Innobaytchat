import { deleteApi, getApi, postApi } from "../../services/api/index";
import axios from "axios";
import dayjs from "dayjs";

export const logout = () => {
  return getApi("/user/logout");
};

export const awsData = () => {
  return getApi("/user/aws");
};

export const getUploadUrl = (data) => {
  return postApi("/project/generate-url", data);
};

export const checkFileIsExist = (data) => {
  return postApi("/files/is-exist", data);
};

export const downloadFile = async (url) => {
  try {
    if (!url) {
      throw new Error("URL is undefined or empty.");
    }
    const nameArray = url.split("/");
    const fileName = nameArray[nameArray.length - 1];
    const { data } = await getApi(`/project/download-attachment?path=${url}`);
    if (!data || !data.url) {
      throw new Error("Invalid response from postApi: missing download URL.");
    }
    const response = await axios.get(data.url, { responseType: "blob" });
    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(fileUrl);

    return true; // Indicate successful download
  } catch (error) {
    console.error("Error downloading the file: ", error);
    return false; // Indicate failure
  }
};

export const downloadFileFromURL = async (fileUrl, fileName) => {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error("Failed to download the file.");

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const deleteAttachmentByAttachmentId = async (task_id, id) => {
  const { data } = await deleteApi(`/task/${task_id}/attachment/${id}`);
  return data;
};

export const dateFormat = (inputDate) => {
  const parsedDate = dayjs(inputDate);
  return parsedDate.format("DD/MM/YYYY h:mm A");
};

export const deleteSnagAttachmentByAttachmentId = async (sang_id, id) => {
  const { data } = await deleteApi(`/snag/${sang_id}/attachment/${id}`);
  return data;
};

export const getFolderListing = (data) => {
  return postApi(`/folder/list`, data);
};
export const getFoldercreate = (data) => {
  return postApi(`/folder/create`, data);
};

export const getFilerscreate = (data) => {
  return postApi(`/files/create`, data);
};

export const getFileDelete = (files_id) => {
  return deleteApi(`/files/${files_id}/delete`);
};

export const deleteFolder = (folder_id) => {
  console.log("folder_id", folder_id);
  return deleteApi(`/folder/${folder_id}/delete`);
};

export const generateAvatarLink = (name) => {
  const nameWords = name.split(" ");
  const initials = nameWords
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  const sanitizedInitials = initials.replace(/[^a-zA-Z0-9]/g, "");
  return `https://ui-avatars.com/api/?name=${sanitizedInitials}&background=random&color=fff`;
};


export const currentTimestamp = () => {
  const now = new Date();
  return now.getTime();
}


export const formatStatusText = (text) => {
  let lowerCaseStr = text.toLowerCase();
  let stringWithSpaces = lowerCaseStr.replace(/_/g, " ");
  let sentenceCaseStr =
    stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1);
  return sentenceCaseStr;
}

export const fileIsPdfOrImage = (name) => {
  const extension = name.split(".").pop().toLowerCase();
  if (extension === "pdf") {
    return true;
  } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    return true;
  } else {
    return false;
  }
}