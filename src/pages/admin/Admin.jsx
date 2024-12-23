import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import SideBar from "../../layout/SideBar";
import HeaderAdmin from "../../layout/HeaderAdmin";
import Cookies from "js-cookie";

export default function Admin() {
  //bảo vệ router
  const isAdmin = () => {
    const data = JSON.parse(Cookies.get("data") || "null");
    if (data) {
      if (data.roles.some((e) => e.roleName === "ADMIN")) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  // Kiểm tra xem đã có token và role admin??
  // return isAdmin ? (
  return (
    <>
      <HeaderAdmin />

      <div className="flex">
        <SideBar />
        <div className="p-6 flex-1">
          {isAdmin() ? <Outlet /> : <Navigate to="/loginadmin" />}
        </div>
      </div>
    </>
  );
}
