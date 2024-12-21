import React, { useEffect, useState } from "react";
import { fetchAllMoviesNew } from "../../services/movieService";
import { Button } from "antd"; // Import Button nếu sử dụng từ Ant Design
import { FrownOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import StatusMovie from "./StatusMovie";
import { isUserLogin } from "../../utils/auth";

export default function MoviesNew() {
  const [moviesNew, setMoviesNew] = useState([]);

  const getAllMoviesNew = async () => {
    try {
      const response = await fetchAllMoviesNew();
      setMoviesNew(response);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    getAllMoviesNew();
  }, []);

  const handleBuyTicket = () => {
    if (isUserLogin()) {
      console.log("Cho mua");
    } else {
      console.log("Phaie login");
    }
  };

  return (
    <div>
      <StatusMovie />
      <div className="container mx-auto py-6 px-[220px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {moviesNew.length > 0 ? (
            moviesNew.map((movie) => (
              <div key={movie.id} className="font-[Oswald] w-[228px]">
                {" "}
                {/* Thêm key để giúp React nhận diện */}
                <div>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-[228px] h-[360px] object-cover rounded-lg"
                  />
                </div>
                <p className="text-[rgb(51,122,183)] text-[20px] font-medium pt-1 pb-2">
                  <NavLink to={`/movies/${movie.id}`}>
                    {movie.movieName}
                  </NavLink>
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
                  className="bg-blue-400 py-4 rounded text-[18px] font-normal w-full font-[Oswald]"
                >
                  MUA VÉ
                </Button>
              </div>
            ))
          ) : (
            <p className="font-[Oswald] font-normal text-[30px] text-[rgb(51,51,51)]">
              Danh sách trống <FrownOutlined /> !!!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
