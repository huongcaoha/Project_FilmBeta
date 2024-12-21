import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function StatusMovie() {
  const location = useLocation();

  // Kiểm tra xem có đang ở "/movies" hoặc "/movies/showing" không
  const isNowShowingActive =
    location.pathname === "/movies" ||
    location.pathname === "/movies/showing" ||
    location.pathname === "/";

  return (
    <>
      {/* Thể loại đang chiếu, sắp chiếu và đặc biệt */}
      <div className="h-16 flex justify-center items-center font-[Oswald] text-[30px] text-[rgb(51,51,51)] pt-6 mb-6">
        {/* PHIM SẮP CHIẾU */}
        <div className="px-6 pb-3 transition-all border-b-[1px]">
          <NavLink
            to="/movies/coming_soon"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 border-blue-500 border-b-2 pb-3"
                : "text-[rgb(51,51,51)] border-transparent border-b-2 pb-3"
            }
          >
            PHIM SẮP CHIẾU
          </NavLink>
        </div>

        {/* PHIM ĐANG CHIẾU */}
        <div className="px-6 pb-3 transition-all border-b-[1px]">
          <NavLink
            to="/movies/showing"
            className={({ isActive }) =>
              isActive || isNowShowingActive
                ? "text-blue-500 border-blue-500 border-b-2 pb-3"
                : "text-[rgb(51,51,51)] border-transparent border-b-2 pb-3"
            }
          >
            PHIM ĐANG CHIẾU
          </NavLink>
        </div>

        {/* SUẤT CHIẾU MỚI NHẤT */}
        <div className="px-6 pb-3 transition-all border-b-[1px]">
          <NavLink
            to="/movies/special"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 border-blue-500 border-b-2 pb-3"
                : "text-[rgb(51,51,51)] border-transparent border-b-2 pb-3"
            }
          >
            SUẤT CHIẾU MỚI NHẤT
          </NavLink>
        </div>
      </div>
    </>
  );
}
