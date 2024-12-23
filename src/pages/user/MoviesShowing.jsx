import React, { useEffect, useState } from "react";
import baseUrl from "../../apis/instance";
import { fetchAllMoviesIsShowing } from "../../services/movieService";
import { Button } from "antd";
import { NavLink } from "react-router-dom";
import StatusMovie from "./StatusMovie";

import Banner from "./Banner";

import { isUserLogin } from "../../utils/auth";

export default function MoviesShowing() {
  const [moivesShowing, setMoviesShowing] = useState([]);

  const getAllMoviesShowing = async () => {
    try {
      const response = await fetchAllMoviesIsShowing();
      setMoviesShowing(response);
    } catch (error) {}
  };

  useEffect(() => {
    getAllMoviesShowing();
  }, []);

  const handleBuyTicket = () => {
    if (isUserLogin()) {
      console.log("Cho mua");
    } else {
      console.log("Bắt đăng nhập");
    }
  };
  return (
    <div>
      {/* <Banner /> */}
      <StatusMovie />
      <div className="py-6 px-[24px] md:px-[60px] lg:px-[160px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 p-4">
          {moivesShowing.map((movie) => (
            <div key={movie.id} className="font-[Oswald] w-[240px]">
              <div>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full object-cover rounded-lg"
                />
              </div>
              <p className="text-[rgb(51,122,183)] text-[20px] font-medium pt-1 pb-2">
                <NavLink to={`/movies/${movie.id}`}>{movie.movieName}</NavLink>
              </p>
              <p className="text-[16px] font-light leading-[24px] pb-1">
                <span className="font-medium">Thể loại: </span>{" "}
                {movie.categories.map((cate) => cate.categoryName).join(", ")}
              </p>
              <p className="text-[16px] font-light leading-[24px] pb-5">
                <span className="font-medium">Thời lượng: </span>{" "}
                {movie.duration} phút
              </p>
              <Button
                onClick={handleBuyTicket}
                type="primary"
                className="bg-blue-400 py-4 rounded text-[18px] font-normal w-full font-[Oswald] "
              >
                <NavLink to={`/movies/${movie.id}`}>MUA VÉ</NavLink>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
