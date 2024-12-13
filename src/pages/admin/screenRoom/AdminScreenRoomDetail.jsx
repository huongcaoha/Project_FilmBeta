import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSeatByScreen } from "../../../services/screenRoom";

export default function AdminScreenRoomDetail() {
  const screenRoomDetail = useSelector((state) => state.screenRoomDetail);
  const [cols, setCols] = useState(screenRoomDetail.numberColSeat);
  const [seats, setSeats] = useState([]);
  const [seatStandards, setSeatStandards] = useState([]);
  const [seatSweetBoxs, setSeatSweetBoxs] = useState([]);

  const changeStatusSeat = (id) => {
    const newSeats = seats.map((seat) => {
      if (seat.id === id) {
        return { ...seat, status: !seat.status };
      } else {
        return seat;
      }
    });
    setSeats(newSeats);
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
  }, []);

  useEffect(() => {
    if (seats.length > 0) {
      if (screenRoomDetail.doubleSeat) {
        const standards = seats.slice(
          0,
          seats.length - screenRoomDetail.numberColSeat
        );
        const sweetBoxes = seats.slice(
          seats.length - screenRoomDetail.numberColSeat
        );
        setSeatStandards(standards);
        setSeatSweetBoxs(sweetBoxes);
      } else {
        setSeatStandards(seats);
      }
    }
  }, [seats, screenRoomDetail]);

  return (
    <div className="container">
      <h1 className="text-center text-5xl font-bold">
        {screenRoomDetail.screenName}
      </h1>

      <div className="text-center flex bg-black">
        <p className="m-auto text-2xl text-white">Projection Screen</p>
      </div>

      <div
        className={`grid grid-cols-${cols} gap-x-[10px] gap-y-[10px] pl-[150px] py-[50px] mx-auto`}
      >
        {seatStandards.map((seat) => (
          <div key={seat.id} className="seat w-full">
            <input
              type="checkbox"
              checked={!seat.status}
              value={seat.id}
              name="seatId"
              id={`seat-${seat.id}`}
              onChange={() => changeStatusSeat(seat.id)}
            />
            <label htmlFor={`seat-${seat.id}`}>{seat.seatName}</label>
          </div>
        ))}

        {seatSweetBoxs.map((seat) => (
          <div key={seat.id} className="seat !bg-pink-500">
            <input
              type="checkbox"
              checked={!seat.status}
              value={seat.id}
              name="seatId"
              id={`seat-${seat.id}`}
              onChange={() => changeStatusSeat(seat.id)}
            />
            <label htmlFor={`seat-${seat.id}`}>{seat.seatName}</label>
          </div>
        ))}
      </div>

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
          <div className="bg-white border border-[#007bff] w-10 h-10"></div>
          <p className="font-bold">Standard Seat</p>
        </div>
      </div>
    </div>
  );
}
