import React, { useEffect, useState } from "react";
import { Button, Input, message, Modal, Radio, Table } from "antd";
// import ComboFood from "../admin/food/ComboFood";
// import { userGetAllComboFood } from "../../services/comboFood";
// import { useCookies } from "react-cookie";

// import { current } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { getUser } from "../../../services/booking";
import { getListSeatByBookingId } from "../../../services/seatService";
import { getFoodByBookingId } from "../../../services/comboFood";
import { getGiftUserById } from "../../../services/giftService";

export default function AdminBookingDetail({ bookingDetail }) {
  const [comboFoods, setComboFoods] = useState([]);
  const [formConfirm, setFormConfirm] = useState(false);
  const navigate = useNavigate();
  const [uuid, setUuid] = useState("");
  // const [cookies, setCookies, removeCookie] = useCookies([
  //   "selectedSeats",
  //   "showTimeDetail",
  // ]); // Khai báo cookies
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(bookingDetail.user);
  const [giftUser, setGiftUser] = useState(bookingDetail.gift);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getSeatByBookingId = async () => {
    const response = await getListSeatByBookingId(bookingDetail.id);
    setSelectedSeats(response);
  };

  // const fetchGiftUser = async () => {
  //   const response = await getGiftUserById(bookingDetail.)
  // }

  const fetchFoodByBookingId = async () => {
    const response = await getFoodByBookingId(bookingDetail.id);
    setComboFoods(response);
  };

  useEffect(() => {
    getSeatByBookingId();
    fetchFoodByBookingId();
  }, [bookingDetail]);

  const seatStandard = selectedSeats?.filter(
    (seat) => seat.seat.typeSeat === "STANDARD"
  );
  const seatDouble = selectedSeats?.filter(
    (seat) => seat.seat.typeSeat === "DOUBLE"
  );

  const totalMoneySeat = selectedSeats
    .map((seat) => seat.price)
    .reduce((pre, current) => pre + current, 0);
  const totalMoneyFood = comboFoods
    .map((food) => food.comboFood.price * food.quantity)
    .reduce((pre, current) => pre + current, 0);

  const columns = [
    {
      title: "Tên Combo",
      dataIndex: "name",
      render: (_, record) => <p>{record.comboFood.name}</p>,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record) => (
        <div>
          <img style={{ width: "100px" }} src={record.comboFood.image} alt="" />
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <p className="px-2">{record.quantity}</p>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "money",
      render: (_, record) => (
        <div>
          <p>{formatCurrency(record.price * record.quantity)}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#f8f8f8] m-auto">
      <div className="p-4 w-[100%] m-auto bg-[#f0f0f0]">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold">Chi Tiết Đặt Vé</h2>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-bold">Họ Tên: </span>
              <span>{user?.fullName}</span>
            </div>
            <div>
              <span className="font-bold">Số điện thoại: </span>
              <span>{user?.phone}</span>
            </div>
            <div>
              <span className="font-bold">Email: </span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {seatStandard.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-bold">Seat standard</h3>
            <div className="flex justify-between">
              <span>
                {seatStandard.length} x {seatStandard[0].price}{" "}
              </span>
              <span>
                = {formatCurrency(seatStandard.length * seatStandard[0].price)}
              </span>
            </div>
            <hr className="my-2" />
          </div>
        ) : (
          <></>
        )}
        {seatDouble.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-bold">Seat SweetBox</h3>
            <div className="flex justify-between">
              <span>
                {seatDouble.length} x {seatDouble[0].price}{" "}
              </span>
              <span>
                = {formatCurrency(seatDouble.length * seatDouble[0].price)}
              </span>
            </div>
            <hr className="my-2" />
          </div>
        ) : (
          <></>
        )}

        <div className="mb-4">
          <h3 className="font-bold">COMBO FOOD</h3>
          <Table columns={columns} dataSource={comboFoods} pagination={false} />
        </div>

        {giftUser ? (
          <div>
            <h3 className="font-bold">GIFT</h3>
            <div className="flex justify-between items-center px-[50px]">
              <img className="w-12 h-12" src={giftUser?.image} alt="" />
              <p>{giftUser?.giftName}</p>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex justify-between mt-4">
          <span>Tổng tiền vé :</span>
          <span>{formatCurrency(totalMoneySeat)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng tiền food :</span>
          <span>{formatCurrency(totalMoneyFood)}</span>
        </div>
        <div className="flex justify-between">
          <span>Giảm giá : </span>
          <span>{formatCurrency(bookingDetail.discount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Số tiền cần thanh toán:</span>
          <span>
            {formatCurrency(
              totalMoneyFood + totalMoneySeat - bookingDetail.discount
            )}
          </span>
        </div>

        <div className="flex justify-center p-3"></div>
      </div>
    </div>
  );
}
