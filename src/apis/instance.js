import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
export default baseUrl;
