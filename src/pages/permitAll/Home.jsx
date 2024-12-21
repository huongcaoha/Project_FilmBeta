import React from "react";
import Header from "../../layout/Header";
import { Outlet } from "react-router-dom";

import Footer from "../../layout/Footer";
import StatusMovie from "../user/StatusMovie";
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
