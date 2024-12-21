import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu, Select } from "antd";
import { getCity, getTheaterByCityName } from "../services/theaterService";
import { useCookies } from "react-cookie";

const { Option } = Select;

export default function SelectTheater() {
  const [cities, setCities] = useState([]);
  const [cookies, setCookie] = useCookies(["currentTheater"]);
  const [currentTheater, setCurrentTheater] = useState(
    cookies.currentTheater || "Beta Hà Nội"
  );

  const getCities = async () => {
    const response = await getCity();
    const cityPromises = response.map(async (city) => {
      const theaters = await getTheaterByCityName(city.cityName);
      return { ...city, theaters: theaters };
    });

    const newCities = await Promise.all(cityPromises);
    setCities(newCities);
  };

  useEffect(() => {
    getCities();
  }, []);

  const handleMenuClick = (theater) => {
    setCurrentTheater(theater);
    setCookie("currentTheater", theater, { path: "/" }); // Lưu cookie
  };

  const items = cities.map((city) => ({
    key: city.cityName,
    label: city.cityName,
    children: city.theaters.map((theater) => ({
      key: theater.id,
      label: (
        <div onClick={() => handleMenuClick(theater.name)}>{theater.name}</div>
      ),
    })),
  }));

  const handleChange = (value) => {
    console.log("Selected Theater: ", value);
    setCurrentTheater(value);
  };

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <Select
        onChange={handleChange}
        className="w-[200px]"
        value={currentTheater}
        suffixIcon={<DownOutlined />}
      >
        {/* Hiển thị giá trị hiện tại */}
        <Option value={currentTheater}>{currentTheater}</Option>
      </Select>
    </Dropdown>
  );
}
