import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Cookies from "js-cookie";

export default function User() {
  // bảo vệ router
  // const isUser = () => {
  //   const data = JSON.parse(Cookies.get("data") || null);
  //   if (data) {
  //     if (data.roles.some((e) => e.roles === "USER")) {
  //       return true;
  //     }
  //     return false;
  //   } else {
  //     return false;
  //   }
  // };
  const isUser = () => {
    return true;
  };
  return (
    <div>
      <Header></Header>
      {isUser() ? <Outlet /> : <Navigate to="/login" />}
      <Footer></Footer>
    </div>
  );
}
