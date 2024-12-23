import React, { useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Select } from "antd";
import { logout } from "../redux/slices/userSlice";
import SelectTheater from "./SelectTheater";

import "../css/headerUser.css";
import { logoutUser } from "../services/logout";
import MenuHeader from "./MenuHeader";

export default function Header() {
  const [currentLink, setCurrentLink] = useState("movies");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calllogout = async () => {
    const response = await logoutUser();
  };

  const handleLogout = async () => {
    await calllogout();

    dispatch(logout());
    Cookies.remove("data");
    navigate("/login");
  };

  const fetchUser = async () => {
    try {
      const response = await getUserLogin();
      setUserLogin(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="sticky top-0 w-full z-50">
        <div className="h-6 bg-black flex justify-end items-center gap-4 px-[160px]">
          {currentUser ? (
            <>
              {/* Hiển thị thông tin người dùng */}
              <div className="text-white text-sm font-light">
                Xin chào: {currentUser.username}
              </div>
              <div
                className="text-white text-sm font-light cursor-pointer"
                onClick={handleLogout}
              >
                Đăng xuất
              </div>
            </>
          ) : (
            <>
              {/* Đăng nhập */}
              <div className="text-white text-sm font-light">
                <NavLink to="/login">Đăng nhập</NavLink>
              </div>

              {/* Ngăn cách */}
              <div className="text-white text-sm font-light">|</div>

              {/* Đăng ký */}
              <div className="text-white text-sm font-light">
                <NavLink to="/register">Đăng ký</NavLink>
              </div>
            </>
          )}

          {/* Quốc kỳ Việt Nam */}
          <div>
            <img
              src="https://www.betacinemas.vn/Assets/Common/icons/vietnam.png"
              alt="Vietnam Flag"
              className="h-6 w-auto"
            />
          </div>
        </div>

        <div className="bg-white h-16 flex justify-between items-center px-[160px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          {/* Logo */}
          <div>
            <NavLink to="/">
              <img
                src="https://www.betacinemas.vn/Assets/Common/logo/logo.png"
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* Chọn thành phố */}
          <div className="flex-shrink-0">
            <SelectTheater></SelectTheater>
          </div>

          {/* Các mục điều hướng */}
          <div className="header lg:flex gap-8 font-medium font-[Oswald] text-[18px] text-[rgb(51,51,51)] sm:hidden md:hidden">
            {" "}
            <div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
                to={"/showTime"}
              >
                LỊCH CHIẾU THEO RẠP
              </NavLink>
            </div>
            <div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
                to={"/movies"}
              >
                PHIM
              </NavLink>
            </div>
            <div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
                to={"/user/gifts"}
              >
                NHẬN QUÀ
              </NavLink>
            </div>
            {/* <div>
              <NavLink>RẠP</NavLink>
            </div> */}
            <div>
              <NavLink
                to={"/ticket_price"}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
              >
                GIÁ VÉ
              </NavLink>
            </div>
            <div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
                to={"/news"}
              >
                TIN MỚI VÀ ƯU ĐÃI
              </NavLink>
            </div>
            <div>
              <NavLink
                to={"/franchise"}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 " : "text-[rgb(51,51,51)] "
                }
              >
                NHƯỢNG QUYỀN
              </NavLink>
            </div>
            <div>
              <NavLink to={"*"}>THÀNH VIÊN</NavLink>
            </div>
          </div>
          <div className="lg:hidden md:block sm:block">
            <MenuHeader></MenuHeader>
          </div>
        </div>
      </div>
    </>
  );
}
