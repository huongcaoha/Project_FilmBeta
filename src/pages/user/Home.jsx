import React from "react";
import Header from "../../layout/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../layout/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
}
