import React from "react";

import { Outlet } from "react-router-dom";

import SideBar from "../../layout/SideBar";
import HeaderAdmin from "../../layout/HeaderAdmin";

export default function Admin() {
  return (
    <div>
      <HeaderAdmin />

      <div className="flex">
        <SideBar />
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
