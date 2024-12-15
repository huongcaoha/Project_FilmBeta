import React, { useEffect, useState } from "react";
import { getMovieByMonth, getShowTimeByMovieAndDate } from "../../services/showTime";
import { TagOutlined, FieldTimeOutlined } from "@ant-design/icons"; // Thêm FieldTimeOutlined
import { Button } from "antd";

export default function ShowTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [movies, setMovies] = useState([]);

  const dayOfWeeks = () => {
    const week = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayOfWeek = daysOfWeek[date.getDay()];
      
      week.push({
        day,
        month,
        dayOfWeek,
        date: date.toDateString(),
      });
    }
    return week;
  };

  const getMovies = async () => {
    const response = await getMovieByMonth();
    
    const moviesWithShowTimes = await Promise.all(
      response.map(async (movie) => {
        const showTimeOfMovie = await getShowTimeByMovieAndDate(movie.id, currentDate);
        return { ...movie, showTimes: showTimeOfMovie };
      })
    );

    setMovies(moviesWithShowTimes);
  };

  useEffect(() => {
    getMovies();
  }, [currentDate]); // Thêm currentDate vào dependency array

  const handleDateClick = (date) => {
    setCurrentDate(new Date(date)); // Chuyển đổi chuỗi ngày thành đối tượng Date
  };
  
  const weeks = dayOfWeeks();
  
  return (
    <div className="bg-[#f8f8f8] w-full h-full border border-black">
      <div className="p-10 flex justify-center">
        <ul className="flex gap-10">
          {weeks.map((d, index) => (
            <li key={index} onClick={() => handleDateClick(d.date)} style={{
              cursor: 'pointer',
              borderBottom: currentDate.toDateString() === d.date ? '2px solid blue' : 'none'
            }}>
              <h1 className="flex">
                <p className="text-4xl">{d.day}</p>
                <p className="mt-4">/{d.month} - {d.dayOfWeek}</p>
              </h1>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display : "flex" , flexWrap : "wrap" , justifyContent : "center" , gap : "200px" , margin : "50px 100px"}}>
        {movies.map(movie => (
          <div key={movie.id} className="flex gap-10 border border-black">
            {/* ảnh phim */}
            <div>
              <img style={{width : "300px"}} src="https://files.betacorp.vn/media/images/2024/12/11/400x633-1-095019-111224-51.jpg" alt="" />
              <div className="flex gap-7">
                <h1>{movie.movieName}</h1>
                <div className="flex">
                  <p><TagOutlined /> thể loại phim</p>
                  <p><FieldTimeOutlined /> {movie.duration}</p>
                </div>
              </div>
            </div>

            {/* tên phim và lịch chiếu */}
            <div className="">
              

              <div>
                {/* thời gian chiếu theo date */}
                {movie.showTimes.map((st, index) => {
                const showTimeDate = new Date(st.showTime); // Chuyển đổi chuỗi thành Date
                const hour = String(showTimeDate.getHours()).padStart(2, '0'); // Đảm bảo giờ có 2 chữ số
                const minute = String(showTimeDate.getMinutes()).padStart(2, '0'); // Đảm bảo phút có 2 chữ số
                return <Button key={index}>{hour}:{minute}</Button>
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}