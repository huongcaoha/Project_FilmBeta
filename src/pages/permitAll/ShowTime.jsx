import React, { useEffect, useState } from "react";
import { getMovieByMonth, getShowTimeByMovieAndDate } from "../../services/showTime";
import { TagOutlined, FieldTimeOutlined } from "@ant-design/icons"; // Thêm FieldTimeOutlined
import { Button, Modal } from "antd";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function ShowTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [showTimeDetail , setShowTimeDetail] = useState(null);
  const [formDetail , setFormDetail] = useState(false);
  const [cookies, setCookie] = useCookies(['showTimeDetail']); // Khai báo cookies
  const navigate = useNavigate();

  const handleOpenFormDetail = (showTimeDetail) => {
    setShowTimeDetail(showTimeDetail);
    setFormDetail(true);
  }

  const handleCloseFormDetail = () => {
    setShowTimeDetail(null);
    setFormDetail(false);
  }

  const handleBookingTicket = () => {
    setCookie("showTimeDetail", showTimeDetail, { path: '/user' }); // Lưu cookie
    navigate("/user/bookingTicket"); // Chuyển hướng
  };
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
    
    let moviesWithShowTimes = await Promise.all(
      response.map(async (movie) => {
        const showTimeOfMovie = await getShowTimeByMovieAndDate(movie.id, currentDate);
        return { ...movie, showTimes: showTimeOfMovie };
      })
    );
  
    // Lọc những phim có lịch chiếu
    moviesWithShowTimes = moviesWithShowTimes.filter(movie => movie.showTimes.length > 0);
    
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
    <div className="bg-[#f8f8f8] w-full min-h-[100vh] border border-black">
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

      <div style={{ display : "flex" , flexWrap : "wrap" ,
         justifyContent : "center" , gap : "200px" ,
          margin : "50px 100px"}}>
            {movies.length === 0 ? <h1 className="text-2xl">There are currently no scheduled movie showtimes.</h1> : <></>}
        {movies.map(movie => (
          <div key={movie.id} className="flex gap-10" style={{  maxWidth : "600px" , borderBottom : "5px solid blue" , paddingBottom : "50px"}}>
            {/* ảnh phim */}
            <div>
              <img style={{width : "300px" }} src="https://files.betacorp.vn/media/images/2024/12/11/400x633-1-095019-111224-51.jpg" alt="" />
            </div>

            {/* tên phim và lịch chiếu */}
            <div className="">
              

            <div>
            <div className="flex gap-7 mt-6" style={{maxWidth : "300px"}}>
                <h1>{movie.movieName}</h1>
                <div className="flex">
                  <p><TagOutlined /> thể loại phim</p>
                  <p><FieldTimeOutlined /> {movie.duration}</p>
                </div>
              </div>
             
               {/* Thời gian chiếu theo date */}
               {movie.showTimes.map((st, index) => {
                 const showTimeDate = new Date(st.showTime); // Chuyển đổi chuỗi thành Date
                 const hour = showTimeDate.getHours();
                 const minute = String(showTimeDate.getMinutes()).padStart(2, '0'); // Đảm bảo phút có 2 chữ số

                  // Xác định AM hoặc PM
                  const period = hour >= 12 ? 'PM' : 'AM';
                  const formattedHour = String(hour % 12 || 12).padStart(2, '0'); // Chuyển đổi sang định dạng 12 giờ
                            
                  return (
                    <Button onClick={() =>handleOpenFormDetail(st)} className="mt-3 mr-2" key={index}>
                      {formattedHour}:{minute} {period}
                    </Button>
                  );
                })}
              </div>

            </div>
          </div>
        ))}

    <Modal
      open={formDetail}
      onCancel={handleCloseFormDetail}
      footer={null} // Không hiển thị footer
      centered // Căn giữa modal
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} // Background trong suốt
    >
      <div style={{ backdropFilter: 'blur(10px)', padding: '20px' }}>
        <h2 className="text-xl">Thông tin lịch chiếu</h2>
        <div>
          <div><img src="https://files.betacorp.vn/media/images/2024/12/11/400x633-1-095019-111224-51.jpg" alt="" /></div>
          <div>
            <h1>Movie : {showTimeDetail?.movie.movieName}</h1>
            <div>
              <p>Theater : {showTimeDetail?.theater.name}</p>
              <p>Time : {showTimeDetail?.showTime}</p>
            </div>
            <Button onClick={handleBookingTicket} type="primary" className="flex m-auto mt-5">Book tickets</Button>
          </div>
        </div>
      </div>
    </Modal>
      </div>
    </div>
  );
}