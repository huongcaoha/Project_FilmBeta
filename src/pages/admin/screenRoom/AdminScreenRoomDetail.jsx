import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSeatByScreen } from "../../../services/screenRoom";

export default function AdminScreenRoomDetail() {
  const screenRoomDetail = useSelector((state) => state.screenRoomDetail);
  const [cols, setCols] = useState(screenRoomDetail.numberColSeat);
  const { rows, setRows } = useState(
    screenRoomDetail.isDoubleSeat
      ? screenRoomDetail.numberRowSeat + 1
      : screenRoomDetail.numberRowSeat
  );
  const [seats, setSeats] = useState([]);

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
  }, []);

  return (
    <div className="container">
      <h1 className="text-center text-5xl font-bold">
        {screenRoomDetail.screenName}
      </h1>

      <div
        className={`grid grid-cols-${cols} gap-y-5 pl-[150px] py-[50px] mx-auto`}
      >
        {seats.map((seat) => (
          <div key={seat.id} className="seat">
            <input
              style={seat.isDoubleSeat ? { border: "pink", color: "pink" } : {}}
              name="seatId"
              type="checkbox"
              id={`seat-${seat.id}`}
            />
            <label htmlFor={`seat-${seat.id}`}>{seat.seatName}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
