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
        <Outlet>Content</Outlet>
      </div>
    </div>
  );
}
