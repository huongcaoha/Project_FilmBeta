import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
} from "antd";
import ComboFood from "../admin/food/ComboFood";
import { userGetAllComboFood } from "../../services/comboFood";
import { useCookies } from "react-cookie";
import { getUser, handleBooking } from "../../services/booking";
import { current } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { getGiftUser, useCoinUser, useGift } from "../../services/giftService";

export default function Payment() {
  const [comboFoods, setComboFoods] = useState([]);
  const [formConfirm, setFormConfirm] = useState(false);
  const navigate = useNavigate();
  const [uuid, setUuid] = useState("");
  const [useCoin, setUseCoin] = useState(false);
  const [cookies, setCookies, removeCookie] = useCookies([
    "selectedSeats",
    "showTimeDetail",
  ]); // Khai báo cookies
  const [selectedSeats, setSelectecSeats] = useState(
    cookies.selectedSeats || []
  );
  const [userGifts, setUserGifts] = useState([]);
  const [giftSelectedId, setGiftSelectedId] = useState(0);
  const getchGifts = async () => {
    const response = await getGiftUser();
    setUserGifts(response);
  };
  const showTimeDetail = cookies.showTimeDetail || {};

  const getAllComboFoods = async () => {
    const response = await userGetAllComboFood();

    setComboFoods(
      response.map((food) => {
        return { ...food, quantity: 0 };
      })
    );
  };
  const [user, setUser] = useState(null);
  const [coin, setCoin] = useState(0);
  const getUserLogin = async () => {
    const response = await getUser();
    setUser(response);
    setCoin(response.coin);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    getAllComboFoods();
    getUserLogin();
    getchGifts();
  }, []);

  const seatStandard = selectedSeats?.filter(
    (seat) => seat.typeSeat === "STANDARD"
  );
  const seatDouble = selectedSeats?.filter(
    (seat) => seat.typeSeat === "DOUBLE"
  );
  const totalMoneySeat = selectedSeats
    .map((seat) => seat.price)
    .reduce((pre, current) => pre + current, 0);
  const totalMoneyFood = comboFoods
    .map((food) => food.price * food.quantity)
    .reduce((pre, current) => pre + current, 0);

  const handleIncrementQuantiy = (food) => {
    const newComboFoods = comboFoods.map((cf) => {
      if (cf.id === food.id) {
        return { ...cf, quantity: cf.quantity + 1 };
      } else {
        return cf;
      }
    });
    setComboFoods(newComboFoods);
  };

  const handleReduceQuantiy = (food) => {
    if (food.quantity > 0) {
      const newComboFoods = comboFoods.map((cf) => {
        if (cf.id === food.id) {
          return { ...cf, quantity: cf.quantity - 1 };
        } else {
          return cf;
        }
      });
      setComboFoods(newComboFoods);
    }
  };

  const columns = [
    {
      title: "Tên Combo",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record) => (
        <div>
          <img style={{ width: "100px" }} src={record.image} alt="" />
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
          <Button onClick={() => handleReduceQuantiy(record)}>-</Button>
          <p className="px-2">{record.quantity}</p>
          <Button onClick={() => handleIncrementQuantiy(record)}>+</Button>
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

  const closeFormConfirm = () => {
    setUuid("");
    setFormConfirm(false);
  };

  const openFormConfirm = () => {
    setFormConfirm(true);
  };

  const useGiftUser = async () => {
    const response = await useGift(giftSelectedId);
  };

  const updateCoin = async () => {
    const response = await useCoinUser();
  };

  const handlePayment = async () => {
    // const cookie = new Cookies();
    // const data = cookie.get("data");
    const listFood = comboFoods
      .filter((food) => food.quantity > 0)
      .map((food) => {
        return {
          comboFoodId: food.id,
          quantity: food.quantity,
        };
      });
    const listSeatId = selectedSeats.map((seat) => seat.id);
    let totalMoneyFood = comboFoods
      .map((food) => food.quantity * food.price)
      .reduce((pre, current) => pre + current, 0);

    const discount = useCoin ? coin : 0;
    const response = await handleBooking(
      showTimeDetail.id,
      listSeatId,
      totalMoneyFood,
      listFood,
      giftSelectedId,
      discount
    );

    if (
      (typeof response === "string" && response.trim()) ||
      (typeof response === "object" && response)
    ) {
      if (giftSelectedId) {
        useGiftUser();
      }
      console.log(giftSelectedId);

      if (useCoin) {
        updateCoin();
      }
      message.success("Payment successfully ! Thanks you so much ");
      setUuid(response.serial_number);
    } else {
      message.error("Payment error , the seat has been booked. ");
    }
  };

  const handleOke = () => {
    closeFormConfirm();
    navigate("/");
  };

  const handleToggleUseCoin = () => {
    setUseCoin((pre) => !pre);
  };

  return (
    <div className="bg-[#f8f8f8] m-auto">
      <div className="p-4 w-[40%] m-auto bg-[#f0f0f0]">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold">THÔNG TIN THANH TOÁN</h2>
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
          <h3 className="font-bold">COMBO ƯU ĐÃI</h3>
          <Table columns={columns} dataSource={comboFoods} pagination={false} />
        </div>
        <div className="flex justify-end items-center m-5">
          <Select
            className="w-[300px] h-[50px]"
            value={giftSelectedId}
            onChange={(e) => setGiftSelectedId(e)}
          >
            <Option value={0}>Chọn quà tặng</Option>
            {userGifts.map((gift) => (
              <Option value={gift.id}>
                <div className="flex justify-between items-center px-[50px]">
                  <img className="w-12 h-12" src={gift.gift.image} alt="" />
                  <p>{gift.gift.giftName}</p>
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex justify-between px-5">
          <label>
            Sử dụng coin để trừ tiền : <b className="ml-3">{coin}</b>
          </label>
          <Switch checked={useCoin} onChange={handleToggleUseCoin}></Switch>
        </div>

        <div className="flex justify-between mt-4">
          <span>Tổng tiền vé :</span>
          <span>{formatCurrency(totalMoneySeat)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng tiền food :</span>
          <span>{formatCurrency(totalMoneyFood)}</span>
        </div>
        {useCoin ? (
          <div className="flex justify-between">
            <span>Số tiền được giảm :</span>
            <span>-{formatCurrency(coin)}</span>
          </div>
        ) : (
          <></>
        )}
        <div className="flex justify-between">
          <span>Số tiền cần thanh toán:</span>
          {useCoin ? (
            <span>
              {formatCurrency(totalMoneyFood + totalMoneySeat - coin)}
            </span>
          ) : (
            <span>{formatCurrency(totalMoneyFood + totalMoneySeat)}</span>
          )}
        </div>

        <div className="flex justify-center p-3">
          <Button onClick={openFormConfirm} type="primary">
            Payment
          </Button>
        </div>
      </div>
      <Modal
        open={formConfirm}
        onCancel={uuid ? handleOke : closeFormConfirm}
        onOk={uuid ? handleOke : handlePayment}
        contentLabel="Confirm booking ticket"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {uuid ? (
          <div>
            <h1>Đặt vé thành công</h1>
            <p>Hãy đưa mã này cho nhân viên để lấy vé </p>
            <QRCode value={uuid} size={256} />
          </div>
        ) : (
          <p>Are you sure you want to book seats for this movie?</p>
        )}
      </Modal>
    </div>
  );
}
