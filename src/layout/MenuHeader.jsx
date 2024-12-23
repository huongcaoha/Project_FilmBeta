import React from "react";
import { Dropdown, Menu } from "antd";
import { BarsOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

export default function MenuHeader() {
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to={"/showTime"}>LỊCH CHIẾU THEO RẠP</NavLink>
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to={"/movies"}>PHIM</NavLink>
      </Menu.Item>
      <Menu.Item key="3">
        <NavLink to={"/user/gifts"}>NHẬN QUÀ</NavLink>
      </Menu.Item>
      <Menu.Item key="4">
        <NavLink to={"/ticket_price"}>GIÁ VÉ</NavLink>
      </Menu.Item>
      <Menu.Item key="5">
        <NavLink to={"/news"}>TIN MỚI VÀ ƯU ĐÃI</NavLink>
      </Menu.Item>
      <Menu.Item key="6">
        <NavLink to={"/franchise"}>NHƯỢNG QUYỀN</NavLink>
      </Menu.Item>
      <Menu.Item key="7">
        <NavLink to={"*"}>THÀNH VIÊN</NavLink>
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ padding: "20px" }}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <BarsOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Dropdown>
    </div>
  );
}
