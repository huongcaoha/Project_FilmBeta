import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

import "../../css/MovieBooking.css";
import { Button, message, Modal } from "antd";
import { getSeatByScreen } from "../../services/screenRoom";
import moment from "moment";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { getListSeatSolds } from "../../services/seatService";
import "../../css/bookingTicket.css";
import {
  getMoneyBySeats,
  handleBooking,
  seatToMoney,
} from "../../services/booking";
import { useNavigate } from "react-router-dom";
export default function BookingTicket() {
  const [cookies, setCookies, removeCookie] = useCookies([
    "showTimeDetail",
    "selectedSeats",
  ]); // Khai báo cookies

  const [seats, setSeats] = useState([]);
  const showTimeDetail = cookies.showTimeDetail || null;
  const [selectedSeats, setSelectecSeats] = useState([]);
  const screenRoomDetail = showTimeDetail.screenRoom;
  const rows = screenRoomDetail.numberRowSeat; // Số hàng ghế
  const cols = screenRoomDetail.numberColSeat; // Số cột ghế
  const [chairsSolds, setChairsSolds] = useState([]);
  const [formConfirm, setFormConfirm] = useState(false);
  const [totalMoney, setTotalMoney] = useState(0);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getListSeats = async () => {
    const chairsSolds = await getListSeatSolds(showTimeDetail.id);
    try {
      const response = await getSeatByScreen(screenRoomDetail.id);
      let listSeats = response.map((seat) => {
        const checkSeatSold = chairsSolds.map((s) => s.id).includes(seat.id);

        if (checkSeatSold) {
          return { ...seat, sold: true };
        } else {
          return { ...seat, sold: false };
        }
      });

      setSeats(listSeats);
    } catch (error) {
      console.error(error);
    }
  };
  const seatGrid = () => {
    const grid = [];
    for (let i = 0; i <= rows; i++) {
      grid.push(seats.slice(i * cols, (i + 1) * cols));
    }

    return grid;
  };

  useEffect(() => {
    getListSeats();
  }, [screenRoomDetail.id]);

  const toggleSeat = async (seat) => {
    const checkSeatExist = selectedSeats.map((s) => s.id).includes(seat.id);

    let newArr = [];
    if (checkSeatExist) {
      newArr = selectedSeats.filter((s) => s.id !== seat.id);
      let checkSeatValid = true;
      const newSelected = newArr.map((select) => select.id);
      const grid = seatGrid();

      for (let i = 0; i < grid.length; i++) {
        const row = [];
        for (let j = 0; j < grid[i].length; j++) {
          if (newSelected.includes(grid[i][j].id)) {
            row.push(j);
          }
        }

        if (row.length > 1) {
          for (let k = 0; k < row.length - 1; k++) {
            if (row[k + 1] - row[k] === 2) {
              console.log(row[k + 1], row[k], row[k + 1] - row[k]);
              checkSeatValid = false;
              break;
            }
          }
        }
      }
      if (checkSeatValid) {
        setSeats((pre) => {
          return pre.map((s) => {
            if (s.id === seat.id) {
              return { ...s, status: 1 };
            } else {
              return s;
            }
          });
        });
        const seatIds = newArr.map((s) => s.id);
        const money = await getMoneyBySeats(showTimeDetail.id, seatIds);
        setTotalMoney(money);
        setSelectecSeats(newArr);
      } else {
        message.error("Không được bỏ trống số ghế bên cạnh");
      }
    } else {
      let checkSeatValid = true;
      const newSelected = [...selectedSeats, seat].map((select) => select.id);
      const grid = seatGrid();

      for (let i = 0; i < grid.length; i++) {
        const row = [];
        for (let j = 0; j < grid[i].length; j++) {
          if (newSelected.includes(grid[i][j].id)) {
            row.push(j);
          }
        }

        if (row.length > 1) {
          for (let k = 0; k < row.length - 1; k++) {
            if (row[k + 1] - row[k] === 2) {
              console.log(row[k + 1], row[k], row[k + 1] - row[k]);
              checkSeatValid = false;
              break;
            }
          }
        }
      }

      if (!checkSeatValid) {
        message.error("Không được bỏ trống số ghế bên cạnh");
        return;
      } else {
        newArr = [...selectedSeats, seat];
        setSeats((pre) => {
          return pre.map((s) => {
            if (s.id === seat.id) {
              return { ...s, status: 2 };
            } else {
              return s;
            }
          });
        });
      }
      const seatIds = newArr.map((s) => s.id);
      const money = await getMoneyBySeats(showTimeDetail.id, seatIds);
      setTotalMoney(money);
      setSelectecSeats(newArr);
    }
  };

  const getPriceSeat = async (seatId, showTimeId) => {
    const response = await seatToMoney(seatId, showTimeId);
    return response;
  };

  const handlePayment = async () => {
    const selected = await Promise.all(
      selectedSeats.map(async (seat) => {
        const price = await getPriceSeat(seat.id, showTimeDetail.id);
        return { ...seat, price: price };
      })
    );
    if (selected.length === 0) {
      message.error("You need to choose a plan before continuing.");
    } else {
      setCookies("selectedSeats", JSON.stringify(selected), { path: "/" });
      navigate("/user/payment");
    }
  };

  return (
    <div>
      <div className="content flex justify-between gap-[100px]  bg-[#f8f8f8] w-[100%] py-[5%] pt-[50px] pl-[100px]">
        <div className="relative screen text-center bg-black lg:w-[50%]  h-[80vh] ">
          <p className=" w-[70%] h-[40px] m-auto flex justify-center items-center mt-3 text-2xl text-black bg-white  p-5">
            Projection Screen
          </p>
          {screenRoomDetail && (
            <div className="booking-section">
              <div className="seat-map">
                {seatGrid().map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="seat-row"
                    style={{ display: "flex" }}
                  >
                    {row.map((seat) =>
                      seat.sold ? (
                        <button
                          key={seat.id}
                          style={{
                            margin: "2px",
                            backgroundColor: "red",
                            color: "black",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            visibility: seat.status === 1 ? "" : "hidden",
                          }}
                        >
                          {seat.seatName}
                        </button>
                      ) : (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          //    className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                          style={{
                            margin: "2px",
                            backgroundColor:
                              seat.typeSeat === "STANDARD"
                                ? seat.status === 0
                                  ? "black"
                                  : seat.status === 1
                                  ? "#f0f0f0"
                                  : "yellow"
                                : seat.status === 0
                                ? "black"
                                : seat.status === 1
                                ? "pink"
                                : "yellow",
                            color: "black",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            visibility: seat.status === 0 ? "hidden" : "",
                          }}
                        >
                          {seat.seatName}
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between mt-10 ml-10">
            <div className="lg:flex gap-y-3 justify-start gap-x-10 text-white  absolute bottom-0 w-[100%] flex-wrap">
              <div className="flex gap-4 items-center">
                <div className="bg-red-600 w-10 h-10"></div>
                <p className="font-bold">Chairs sold</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-pink-500 w-10 h-10"></div>
                <p className="font-bold">SweetBox Seat</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-yellow-500 w-10 h-10"></div>
                <p className="font-bold">Selected chair</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-[white] border border-[#007bff] w-10 h-10"></div>
                <p className="font-bold">Empty chair</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[50%]">
          <div className="bg-white w-[50%] ">
            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                <div className="pi-img-wrapper flex ">
                  <img
                    style={{ width: "40%" }}
                    alt=""
                    src={showTimeDetail.movie.poster}
                  />
                  {/* <span style={{ position: "absolute", top: 10, left: 10 }}>
                    <img
                      src="/Assets/Common/icons/films/c-13.png"
                      className="img-responsive"
                    />
                  </span> */}
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 p-[20px]">
                    <h3 className="bold color1 text-xl font-bold">
                      {showTimeDetail.movie.movieName}
                    </h3>
                    <h4 className="text-xl mt-5">{showTimeDetail.typeMovie}</h4>
                  </div>
                </div>
              </div>

              <div className="col-lg-16 col-md-16 col-sm-8 col-xs-16">
                <ul
                  className="list-unstyled padding-left-30 padding-right-30 padding-top-10 padding-bottom-10 font-md font-family-san"
                  style={{ marginBottom: 0 }}
                >
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex mt-4 mb-4">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-tags" />
                        &nbsp;Thể loại :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {showTimeDetail.movie.categories
                            .map((cate) => cate.categoryName)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                    {/* <p>Thể loại : Tâm lý , hài hước</p> */}
                  </li>
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-clock-o" />
                        &nbsp;Thời lượng :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {showTimeDetail.movie.duration}
                        </span>
                      </div>
                    </div>
                    {/* <p>Thời lượng : 113 phút</p> */}
                  </li>
                </ul>
              </div>
              <div className="col-lg-16 col-md-16 col-sm-8 col-xs-16">
                <hr
                  className="border-dashed border-top-2"
                  style={{ marginTop: 5, marginBottom: 5 }}
                />
                <ul className="list-unstyled padding-left-30 flex flex-col gap-5 padding-right-30 padding-top-10 padding-bottom-10 font-md font-family-san">
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-institution" />
                        &nbsp;Rạp chiếu :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {showTimeDetail.theater.name}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-calendar" />
                        &nbsp;Ngày chiếu :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {showTimeDetail.showDate}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-clock-o" />
                        &nbsp;Giờ chiếu :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {moment(showTimeDetail.showTime).format("HH:MM")}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-desktop" />
                        &nbsp;Phòng chiếu :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="bold ml-[150px]">
                          {showTimeDetail.screenRoom.screenName}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="padding-bottom-10 padding-top-10">
                    <div className="row flex">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <i className="fa fa-cubes" />
                        &nbsp;Ghế ngồi :
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="seat-name-selected bold ml-[100px]">
                          {selectedSeats
                            .map((seat) => seat.seatName)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </li>

                  <li className="padding-bottom-10 padding-top-10">
                    <div className="flex">
                      <p>Tổng tiền :</p>
                      <p className="ml-[100px]">{formatCurrency(totalMoney)}</p>
                    </div>
                  </li>
                </ul>
                <div className="text-center padding-bottom-30 mt-5 mb-5 ">
                  <Button onClick={handlePayment} type="primary">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
