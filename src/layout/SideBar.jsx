import React, { useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  InsertRowLeftOutlined,
  MailOutlined,
  MessageOutlined,
  PictureOutlined,
  UserSwitchOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
const items = [
  {
    key: "1",
    icon: <DashboardOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Dashboard
      </Link>
    ),
  },
  {
    key: "2",
    icon: <HomeOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Theater Management
      </Link>
    ),
  },
  {
    key: "3",
    icon: <InsertRowLeftOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        ScreenRoom Management
      </Link>
    ),
  },
  {
    key: "4",
    icon: <FieldTimeOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        ShowTime Management
      </Link>
    ),
  },
  {
    key: "5",
    icon: <MailOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Category Management
      </Link>
    ),
  },
  {
    key: "6",
    icon: <BookOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Booking Management
      </Link>
    ),
  },
  {
    key: "7",
    icon: <YoutubeOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Movie Management
      </Link>
    ),
  },
  {
    key: "8",
    icon: <MessageOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Comment Management
      </Link>
    ),
  },
  {
    key: "9",
    icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        User Management
      </Link>
    ),
  },
  {
    key: "10",
    icon: <PictureOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={""} className="text-base font-semibold mb-5">
        Banner Management
      </Link>
    ),
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
