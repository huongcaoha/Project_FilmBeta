import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useCookies } from "react-cookie";

export default function User() {
  // bảo vệ router
  const [cookies] = useCookies(["data"]);
  const [isUser, setIsUser] = useState(true);

  const checkIsUser = async () => {
    const roles =
      (await cookies.data?.roles?.map((role) => role.roleName)) || [];
    setIsUser(roles.includes("USER"));
  };

  useEffect(() => {
    checkIsUser();
  }, [cookies.data]);

  return (
    <div>
      <Header />
      {isUser ? <Outlet /> : <Navigate to="/login" />}
      <Footer />
    </div>
  );
}
