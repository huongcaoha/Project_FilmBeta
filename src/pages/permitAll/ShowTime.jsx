import React, { useEffect, useState } from "react";
import {
  getMovieByMonth,
  getShowTimeByMovieAndDate,
} from "../../services/showTime";
import {
  TagOutlined,
  FieldTimeOutlined,
  FrownOutlined,
} from "@ant-design/icons"; // Thêm FieldTimeOutlined
import { Button, Modal } from "antd";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "../../css/showTimeUser.css";
export default function ShowTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [showTimeDetail, setShowTimeDetail] = useState(null);
  const [formDetail, setFormDetail] = useState(false);
  const [cookies, setCookie] = useCookies(["showTimeDetail", "currentTheater"]); // Khai báo cookies
  const navigate = useNavigate();
  const currentTheater = cookies.currentTheater || "Beta Hà Nội";

  const handleOpenFormDetail = (showTimeDetail) => {
    setShowTimeDetail(showTimeDetail);
    console.log(showTimeDetail);
    setFormDetail(true);
  };

  const handleCloseFormDetail = () => {
    setShowTimeDetail(null);
    setFormDetail(false);
  };

  const handleBookingTicket = () => {
    setCookie("showTimeDetail", showTimeDetail, { path: "/" }); // Lưu cookie
    console.log(showTimeDetail);
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
      const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
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
        const showTimeOfMovie = await getShowTimeByMovieAndDate(
          movie.id,
          currentDate,
          currentTheater
        );
        return { ...movie, showTimes: showTimeOfMovie };
      })
    );
    // Lọc những phim có lịch chiếu
    moviesWithShowTimes = moviesWithShowTimes.filter(
      (movie) => movie.showTimes.length > 0
    );

    setMovies(moviesWithShowTimes);
  };

  useEffect(() => {
    getMovies();
  }, [currentDate, currentTheater]); // Thêm currentDate vào dependency array

  const handleDateClick = (date) => {
    setCurrentDate(date); // Chuyển đổi chuỗi ngày thành đối tượng Date
  };

  const weeks = dayOfWeeks();

  return (
    <div className="bg-[#f8f8f8] w-full min-h-[100vh] border border-black ">
      <div className="p-10 flex justify-center">
        <ul className="lg:flex gap-10 md:flex flexWrap  sm:flex flexWrap">
          {weeks.map((d, index) => (
            <li
              key={index}
              onClick={() => handleDateClick(d.date)}
              style={{
                cursor: "pointer",
                borderBottom:
                  moment(currentDate).format("YYYY-MM-DD") ===
                  moment(d.date).format("YYYY-MM-DD")
                    ? "2px solid blue"
                    : "none",
              }}
            >
              <h1 className="flex">
                <p className="text-4xl">{d.day}</p>
                <p className="mt-4">
                  /{d.month} - {d.dayOfWeek}
                </p>
              </h1>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "50px",
          margin: "50px 100px",
        }}
      >
        {movies.length === 0 ? (
          <div>
            <p className="font-[Oswald] font-normal text-[30px] text-[rgb(51,51,51)]">
              Danh sách trống <FrownOutlined /> !!!
            </p>
          </div>
        ) : (
          <></>
        )}
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="lg:grid grid-cols-2 gap-10 item sm:flex md:flex"
            style={{
              maxWidth: "600px",
              borderBottom: "2px solid blue",
              paddingBottom: "50px",
            }}
          >
            {/* ảnh phim */}
            <div>
              <img
                style={{
                  width: "280px",
                  height: "443px",
                  borderRadius: "10px",
                }}
                src={movie.poster}
                alt=""
              />
            </div>

            {/* tên phim và lịch chiếu */}
            <div className="">
              <div>
                <h1 className="text-[#03599d] text-4xl font-semibold">
                  {movie.movieName}
                </h1>
                <div className="flex gap-7 mt-6" style={{ maxWidth: "300px" }}>
                  <div className="flex gap-4">
                    <p className="text-xl">
                      <TagOutlined className="text-[#03599d]" />{" "}
                      {movie.categories
                        .map((cate) => cate.categoryName)
                        .join(", ")}
                    </p>
                    <p className="text-xl">
                      <FieldTimeOutlined className="text-[#03599d]" />{" "}
                      {movie.duration} phút
                    </p>
                  </div>
                </div>

                {/* Thời gian chiếu theo date */}
                {movie.showTimes.map((st, index) => {
                  const showTimeDate = new Date(st.showTime); // Chuyển đổi chuỗi thành Date
                  const hour = showTimeDate.getHours();
                  const minute = String(showTimeDate.getMinutes()).padStart(
                    2,
                    "0"
                  ); // Đảm bảo phút có 2 chữ số

                  // Xác định AM hoặc PM
                  const period = hour >= 12 ? "PM" : "AM";
                  const formattedHour = String(hour % 12 || 12).padStart(
                    2,
                    "0"
                  ); // Chuyển đổi sang định dạng 12 giờ

                  return (
                    <Button
                      onClick={() => handleOpenFormDetail(st)}
                      className="mt-3 mr-2 bg-[#e5e5e5]"
                      key={index}
                    >
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
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }} // Background trong suốt
        >
          <div style={{ backdropFilter: "blur(10px)", padding: "20px" }}>
            <h2 className="text-2xl font-semibold mb-5">
              Thông tin lịch chiếu
            </h2>
            <div className="text-xl">
              <div className="flex justify-center items-center">
                <img
                  className="w-[240px]"
                  src={showTimeDetail?.movie.poster}
                  alt=""
                />
              </div>
              <div className="mt-4">
                <h1>
                  Movie : <b>{showTimeDetail?.movie.movieName}</b>
                </h1>
                <div>
                  <p>
                    Theater : <b>{showTimeDetail?.theater.name}</b>
                  </p>
                  <p>
                    Time :{" "}
                    <b>
                      {moment(showTimeDetail?.showTime).format(
                        "hh:mm DD-MM-YYYY"
                      )}
                    </b>
                  </p>
                </div>
                <Button
                  onClick={handleBookingTicket}
                  type="primary"
                  className="flex m-auto mt-5"
                >
                  Book tickets
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
