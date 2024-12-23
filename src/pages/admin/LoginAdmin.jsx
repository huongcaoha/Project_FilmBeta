import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../apis/instance"; // Sử dụng instance đã có
import { useCookies } from "react-cookie"; // Sửa import

const LoginAdmin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["data"]); // Sử dụng useCookies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await baseUrl.post(
        "/api.myService.com/v1/auth/sign-in",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      // Lưu token vào Cookie
      setCookies("data", JSON.stringify(response.data), { path: "/" }); // Sử dụng setCookies

      // Kiểm tra quyền ADMIN
      if (response.data.roles.some((e) => e.roleName === "ADMIN")) {
        navigate("/admin");
      } else {
        setError("Tài khoản không có quyền quản trị.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập Admin:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Đăng nhập thất bại!");
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs sm:max-w-md p-6 sm:p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Đăng Nhập ADMIN
        </h2>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
