import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout } from "../redux/slices/userSlice";
import { logoutAdmin, logoutUser } from "../services/logout";
import { Button } from "antd";

export default function HeaderAdmin() {
  const { currentUser } = useSelector((state) => state.user); // Lấy thông tin admin từ Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calllogout = async () => {
    const response = await logoutAdmin();
    console.log(response);
  };

  const handleLogout = async () => {
    await calllogout();
    dispatch(logout());
    Cookies.remove("adminData");
    // Điều hướng về trang đăng nhập
    navigate("/loginadmin");
  };

  return (
    <div className="w-full bg-[#001529] flex justify-between items-center text-white h-[60px] px-[100px]">
      <div className="flex">
        <img
          className="w-[150px] h-[50px]"
          src="https://betacinemas.vn/Assets/Common/logo/logo.png"
          alt="Logo"
        />
      </div>
      <ul className="flex justify-end items-center gap-4">
        <li className="flex items-center">
          <UserOutlined className="mr-2" />
          Xin chào: Admin
          {/* Xin chào: {currentUser.username} */}
        </li>
        <li>
          <div>|</div>
        </li>
        <li>
          <div onClick={handleLogout}>Đăng xuất</div>
        </li>
      </ul>
    </div>
  );
}
