import React, { useState } from "react";
import { DashboardOutlined, MailOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
const items = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <MailOutlined />,
    label: "Product Management",
  },
  {
    key: "3",
    icon: <MailOutlined />,
    label: "Order Management",
  },
  {
    key: "4",
    icon: <MailOutlined />,
    label: "User Management",
  },
  {
    key: "5",
    icon: <MailOutlined />,
    label: <Link to={"/admin/category"}>Category Management</Link>,
  },
];
const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items);

export default function SideBar() {
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  return (
    <Menu
      className="h-[100vh] pt-[50px] bg-[#f5f5f5]"
      mode="inline"
      defaultSelectedKeys={["231"]}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
      }}
      items={items}
    />
  );
}
