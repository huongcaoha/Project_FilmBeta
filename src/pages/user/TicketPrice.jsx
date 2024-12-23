import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getCity, getTheaterByCityName } from "../../services/theaterService";

export default function TicketPrice() {
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

  // Theo dõi sự thay đổi của cookie và cập nhật state
  useEffect(() => {
    if (cookies.currentTheater) {
      setCurrentTheater(cookies.currentTheater);
    }
  }, [cookies.currentTheater]);

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

  return (
    <div className="px-[200px] bg-[rgb(248,248,248)] pt-8">
      <p className="font-normal text-[28px] font-[Oswald] text-[rgb(51,51,51)] pb-4 uppercase">
        GIÁ VÉ RẠP {currentTheater}
      </p>
      <div>
        <img
          src="https://files.betacorp.vn/cms/images/2024/04/03/bang-gia-ve-tn-ve-2d-va-3d-1920x2400-150958-030424-19.png"
          alt=""
          className="w-full"
        />
      </div>
    </div>
  );
}
