import React from "react";
import { Outlet } from "react-router-dom";
import StatusMovie from "./StatusMovie";

export default function Movie() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
