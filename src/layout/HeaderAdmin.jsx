import React from "react";
import { UserOutlined } from "@ant-design/icons";
export default function HeaderAdmin() {
  return (
    <div className="bg-[#001529] flex justify-between items-center text-white h-[60px] px-[100px] ">
      <div className="flex">
        <img
          className="w-[150px] h-[50px]"
          src="https://betacinemas.vn/Assets/Common/logo/logo.png"
          alt=""
        />
      </div>
      <ul className="flex justify-end items-center gap-4 ">
        <li>
          {" "}
          <UserOutlined className="mr-5" />
          Xin chào : Admin
        </li>
      </ul>
    </div>
  );
}
