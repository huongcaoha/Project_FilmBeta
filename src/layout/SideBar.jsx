import React, { useState } from "react";
import {
  AppleOutlined,
  BookOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  FileSearchOutlined,
  GiftOutlined,
  HomeOutlined,
  InsertRowLeftOutlined,
  MailOutlined,
  MessageOutlined,
  PictureOutlined,
  UserSwitchOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, NavLink } from "react-router-dom";
import "../css/sideBarAdmin.css";
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
      <NavLink to={"/admin/theaters"} className="text-base font-semibold mb-5">
        Theater
      </NavLink>
    ),
  },
  {
    key: "3",
    icon: <InsertRowLeftOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/screenRooms"} className="text-base font-semibold mb-5">
        ScreenRoom
      </Link>
    ),
  },
  {
    key: "4",
    icon: <FieldTimeOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/showTimes"} className="text-base font-semibold mb-5">
        ShowTime
      </Link>
    ),
  },
  {
    key: "5",
    icon: <MailOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/category"} className="text-base font-semibold mb-5">
        Category
      </Link>
    ),
  },
  {
    key: "6",
    icon: <BookOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/bookings"} className="text-base font-semibold mb-5">
        Booking
      </Link>
    ),
  },
  {
    key: "7",
    icon: <YoutubeOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/movie"} className="text-base font-semibold mb-5">
        Movie
      </Link>
    ),
  },
  {
    key: "8",
    icon: <MessageOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/comment"} className="text-base font-semibold mb-5">
        Comment
      </Link>
    ),
  },
  {
    key: "9",
    icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/users"} className="text-base font-semibold mb-5">
        User
      </Link>
    ),
  },
  {
    key: "10",
    icon: <PictureOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/banners"} className="text-base font-semibold mb-5">
        Banner
      </Link>
    ),
  },
  {
    key: "11",
    icon: <FileSearchOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/news"} className="text-base font-semibold mb-5">
        News
      </Link>
    ),
  },
  {
    key: "12",
    icon: <AppleOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/foods"} className="text-base font-semibold mb-5">
        Combo Food
      </Link>
    ),
  },
  {
    key: "13",
    icon: <GiftOutlined style={{ fontSize: "20px" }} />,
    label: (
      <Link to={"/admin/gifts"} className="text-base font-semibold mb-5">
        Gift
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
      className=" h-[100vh] pt-[50px] bg-[#f5f5f5] w-[240px]"
      mode="inline"
      defaultSelectedKeys={["231"]}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      items={items}
    />
  );
}
