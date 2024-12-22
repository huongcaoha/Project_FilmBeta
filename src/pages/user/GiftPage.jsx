import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getUser } from "../../services/booking";
import {
  checkUserReceiveGift,
  getGifts,
  saveGiftUser,
  updateGetCoin,
} from "../../services/giftService";

export default function GiftPage() {
  const [user, setUser] = useState({});
  const [gifts, setGifts] = useState([]);
  const [gift, setGift] = useState({});
  const [checkReceiveGift, setCheckReceiveGift] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fetchUser = async () => {
    try {
      const response = await getUser();
      setUser(response);
    } catch (error) {}
  };

  const fetchReceiveGift = async () => {
    const response = await checkUserReceiveGift();
    setCheckReceiveGift(response);
  };

  const fetchGifts = async () => {
    const response = await getGifts();
    setGifts(response);
  };
  useEffect(() => {
    fetchUser();
    fetchGifts();
    fetchReceiveGift();
  }, [gift]);

  const updateStatusGetCoin = async () => {
    try {
      const response = await updateGetCoin();
      setUser(response);
    } catch (error) {}
  };

  const handleGetCoin = () => {
    updateStatusGetCoin();
    fetchUser();
  };

  const updateDataGift = async (giftUserRequest) => {
    try {
      const response = await saveGiftUser(giftUserRequest);
    } catch (error) {}
  };

  const handleGetGift = () => {
    const randomNumber = Math.floor(Math.random() * gifts.length);
    setGift(gifts[randomNumber]);
    const giftUserRequest = {
      userId: user.id,
      giftId: gifts[randomNumber].id,
      status: true,
    };
    updateDataGift(giftUserRequest);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setGift(null);
    setShowForm(false);
  };
  return (
    <div>
      <div className="relative">
        <div className="absolute bottom-[250px] left-[43%]">
          {checkReceiveGift ? (
            <img
              className="w-[300px] h-[300px]"
              src="https://res.cloudinary.com/dudtrotnp/image/upload/v1734876096/pngtree-d-open-gift-box-with-rays-yellow-red-ribbon-suitable-for-png-image_14409896_oqozgp.png"
              alt="gift"
            />
          ) : (
            <img
              className="w-[300px] h-[300px]"
              src="https://cdn.pixabay.com/animation/2023/11/29/03/39/03-39-03-19_512.gif"
              alt="gift"
            />
          )}
        </div>
        <div className="absolute top-[40px] left-[50px]">
          <img
            className="bg-[white] rounded-2xl"
            src="https://www.betacinemas.vn/Assets/Common/logo/logo.png"
            alt=""
          />
        </div>
        <div className=" absolute right-[150px] top-[20px] text-[yellow] flex flex-col gap-y-5">
          <div className="flex justify-center items-center gap-3">
            <img
              className="w-12 h-12 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI-_nq8Hoc2yYVuUoqged-Vz9ixN4gA8Nr_A&s"
              alt=""
            />
            <p className="text-xl">{user.coin}</p>
          </div>

          <div className="ml-[80px]">
            {user.getCoin ? (
              <Button
                className="w-[200px] h-10 text-xl font-semibold bg-gray-400"
                style={{
                  backgroundColor: "gray",
                  borderColor: "gray",
                  color: "black",
                }}
              >
                Đã nhận xu hôm nay
              </Button>
            ) : (
              <Button
                onClick={handleGetCoin}
                className="w-[200px] h-10 text-xl font-semibold bg-[yellow]"
              >
                Nhận 1000 xu
              </Button>
            )}
          </div>
        </div>

        <div className="absolute bottom-[200px] left-[45%]">
          {checkReceiveGift ? (
            <Button
              className="bg-[red] text-white w-[250px] h-[50px] text-xl"
              style={{
                backgroundColor: "gray",
                borderColor: "gray",
                color: "black",
              }}
            >
              Đã nhận quà giáng sinh
            </Button>
          ) : (
            <Button
              className="bg-[red] text-white w-[200px] h-[50px] text-xl"
              onClick={handleGetGift}
            >
              Nhận quà giáng sinh
            </Button>
          )}
        </div>
        <img
          className="w-full h-[100vh]"
          src="https://img.pikbest.com/templates/20241101/merry-christmas-gift-boxes-and-snow-with-santa-on-red-theme_11043417.jpg!w700wp"
          // src="https://noithatbinhminh.com.vn/wp-content/uploads/2022/11/sao-noel-gif.gif"
          alt=""
        />

        <Modal open={showForm} onCancel={handleCloseForm} footer={null}>
          <h1 className="font-semibold text-lg">
            Chúc mừng bạn đã nhận được 1 món quà giáng sinh !
          </h1>
          <div className="flex flex-col justify-center items-center m-auto">
            <img className="w-[250px] h-[250px]" src={gift?.image} alt="gift" />
            <h2 className="font-bold text-[#ee46e2]">{gift?.giftName}</h2>
            <p className="font-bold">{gift?.description}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
}
