import axios from "axios";

const setAuthToken = () => {
  const token = `Bearer ${localStorage.getItem("token")}`;
 
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
    console.log( axios.defaults.headers.common["Authorization"])
  } else {
    axios.defaults.headers.common["Authorization"] = "";
  }
};

export default setAuthToken;
