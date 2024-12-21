import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSeatByScreen,
  saveDataScreenRoomSeat,
} from "../../../services/screenRoom";
import "../../../css/MovieBooking.css";
import { Button, message } from "antd";
import { useCookies } from "react-cookie";

export default function AdminScreenRoomDetail() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies([
    "adminShowRoomDetail",
  ]);
  const screenRoomDetail = cookies.adminShowRoomDetail;

  const rows = screenRoomDetail.numberRowSeat; // Số hàng ghế
  const cols = screenRoomDetail.numberColSeat; // Số cột ghế

  const toggleSeat = (seat) => {
    setSeats(
      seats.map((s) => {
        if (s.id === seat.id) {
          return { ...s, status: s.status === 1 ? 0 : 1 };
        } else {
          return s;
        }
      })
    );
  };

  const handleSaveData = async () => {
    const response = await saveDataScreenRoomSeat(seats);
    message.success("Update successfully");
  };

  const getListSeats = async () => {
    try {
      const response = await getSeatByScreen(screenRoomDetail.id);
      setSeats(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListSeats();
  }, [screenRoomDetail.id]);

  // Chia ghế thành hàng (row) và cột (col)
  const seatGrid = () => {
    const grid = [];
    for (let i = 0; i <= rows; i++) {
      grid.push(seats.slice(i * cols, (i + 1) * cols));
    }
    return grid;
  };

  return (
    <div className="container bg-[#866c70] w-[80%] mt-10 m-auto">
      <h1 className="text-center text-5xl font-bold">
        {screenRoomDetail.screenName}
      </h1>

      <div className="text-center flex bg-black">
        <p className="m-auto text-2xl text-white">Projection Screen</p>
      </div>

      {screenRoomDetail && (
        <div className="booking-section">
          <div className="seat-map">
            {seatGrid().map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="seat-row"
                style={{ display: "flex" }}
              >
                {row.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    className={`seat ${
                      selectedSeats.includes(seat.id) ? "selected" : ""
                    }`}
                    style={{
                      margin: "2px",
                      backgroundColor:
                        seat.typeSeat === "STANDARD"
                          ? seat.status
                            ? "#f0f0f0"
                            : "black"
                          : seat.status
                          ? "pink"
                          : "black",
                      color: "black",
                      padding: "10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    {seat.seatName}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <div className="flex justify-start gap-x-10">
          <div className="flex gap-4 items-center">
            <div className="bg-black w-10 h-10"></div>
            <p className="font-bold">Block Seat</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-pink-500 w-10 h-10"></div>
            <p className="font-bold">SweetBox Seat</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#f0f0f0] border border-[#007bff] w-10 h-10"></div>
            <p className="font-bold">Standard Seat</p>
          </div>
        </div>

        <div>
          <Button
            onClick={handleSaveData}
            className="w-[100px] h-[40px]"
            type="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
