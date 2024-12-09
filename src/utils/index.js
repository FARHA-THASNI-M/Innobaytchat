import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { IP_URL } from "../constants";
import CryptoJS from "crypto-js";
import { getDeviceToken } from "./firebase";

export const getIp = () => {
  return new Promise(async (resolve, reject) => {
    await Axios.get(IP_URL)
      .then(({ data }) => {
        resolve({ ip: data?.ip });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const generateDeviceId = async () => {
  return uuidv4();
};

export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getMetaData = async () => {
  const { ip } = await getIp();
  const deviceId = (await generateDeviceId()) || "20f6ef1c-e51a-4b40-950d-8a157c8a21b7";
  const timezone = getTimeZone();
  let deviceToken = "not-allowed";
  try {
    deviceToken = (await getDeviceToken()) || "not-allowed";
  } catch (err) {
    console.log("deviceToken error", err);
  }
  // const deviceToken = "";
  return { ip, deviceId, timezone, deviceToken };
};

export const getAWSDecrypt = (data, code) => {
  try {
    const AES_SECRET_KEY = import.meta.env.VITE_ACCESS_KEY;
    console.log({ data }, { code }, { key: AES_SECRET_KEY });
    var IV = CryptoJS.enc.Utf8.parse(code);
    var key = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY);
    const bytes = CryptoJS.AES.decrypt(data, key, {
      iv: IV,
    });
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
    return decryptedData;
    // const AES_SECRET_SALT = import.meta.env.VITE_SECRET_SALT;
    // const secretSalt = CryptoJS.enc.Hex.parse(code);
    // const decryptedBytes = CryptoJS.AES.decrypt(
    //   data,
    //   CryptoJS.enc.Hex.parse(AES_SECRET_KEY),
    //   {
    //     iv: secretSalt,
    //     mode: CryptoJS.mode.CBC
    //   }
    // );
    // const iv = CryptoJS.enc.Utf8.parse(code);

    // Decrypt data using AES-256-CBC
    // const decryptedBytes = CryptoJS.AES.decrypt(
    //   {
    //     ciphertext: data,
    //   },
    //   // data,
    //   CryptoJS.enc.Utf8.parse(AES_SECRET_KEY),
    //   {
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    //   }
    // );

    // // Convert decrypted bytes to UTF-8 encoded string
    // console.log(decryptedBytes);

    // const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // console.log(decryptedData);
    // const result = CryptoJS.enc.Utf8.stringify(decryptedData);
    // console.log(result);
    // // Parse the decrypted JSON object
    // const decryptedObject = JSON.parse(result);
    // console.log(decryptedObject);
    // Convert decrypted bytes to UTF-8 encoded string
    // const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // // Parse the decrypted JSON object
    // const decryptedObject = JSON.parse(decryptedData);

    return {};
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getDifferenceBetweenDates = (start, end) => {
  if (start && end) {
    const startDate = moment(start);
    const endDate = moment(end);
    const diffDays = endDate.diff(startDate, "days");
    return diffDays;
  }
  return 0;
};

export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const formatTablePayload = (tableParams) => {
  const { current = 1, pageSize = 10 } = tableParams;

  const data = {
    page: current,
    pageSize: pageSize,
    filters: tableParams?.filters ? flattenObject(tableParams.filters) : null,
    sort:
      tableParams && tableParams?.field && tableParams?.order
        ? [tableParams?.field, tableParams?.order === "ascend" ? "asc" : "desc"]
        : ["createdAt", "desc"],
  };
  return data;
};

export const getFormatDate = (data, format = "DD-MM-YYYY") => {
  return moment(data).format(format);
};

export const getFormatDateTime = (data, format = "DD-MM-YYYY HH:mm:ss") => {
  return moment(data).format(format);
};