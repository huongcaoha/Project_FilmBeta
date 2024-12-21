import axios from "axios";
import { Cookies } from "react-cookie";
const baseUrl = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

const handleAddInterceptors = (instance) => {
  // request
  instance.interceptors.request.use(
    (config) => {
      const cookie = new Cookies();
      const data = cookie.get("data");

      if (data) {
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  // response

  instance.interceptors.response.use(
    (response) => {
      // Xử lý phản hồi thành công
      return response;
    },
    (error) => {
      // Xử lý lỗi
      console.error("Error in response:", error);
      return Promise.reject(error);
    }
  );
};

handleAddInterceptors(baseUrl);
export default baseUrl;
