import React, { useEffect, useState } from "react";
import { fetchAllMoviesComingSoon } from "../../services/movieService";
import moment from "moment";
import { NavLink } from "react-router-dom";
import StatusMovie from "./StatusMovie";

export default function MoviesComingSoon() {
  const [moviesComingSoon, setMoviesComingSoon] = useState([]);

  const getAllMoviesComingSoon = async () => {
    try {
      const response = await fetchAllMoviesComingSoon();
      setMoviesComingSoon(response);
    } catch (error) {}
  };

  useEffect(() => {
    getAllMoviesComingSoon();
  }, []);
  return (
    <>
      <StatusMovie />
      <div className="py-6 px-[24px] md:px-[60px] lg:px-[160px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 p-4">
          {moviesComingSoon.map((movie) => (
            <div key={movie.id} className="font-[Oswald] w-[240px]">
              <div>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className=" w-full object-cover rounded-lg"
                />
              </div>
              <p className="text-[rgb(51,122,183)] text-[20px] font-medium pt-1 pb-2">
                <NavLink to={`/movies/${movie.id}`}>{movie.movieName}</NavLink>
              </p>
              <p className="text-[16px] font-light leading-[24px] pb-1">
                <span className="font-medium">Thể loại: </span>{" "}
                {movie.categories.map((cate) => cate.categoryName).join(", ")}
              </p>
              <p className="text-[16px] font-light leading-[24px] pb-1">
                <span className="font-medium">Thời lượng: </span>{" "}
                {movie.duration} phút
              </p>
              <p className="text-[16px] font-light leading-[24px] pb-1">
                <span className="font-medium">Ngày khởi chiếu: </span>{" "}
                <span className="text-[rgb(51,122,183)] font-normal">
                  {moment(movie.releaseDate).format("DD/MM/YYYY")}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
