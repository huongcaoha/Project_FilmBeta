import React from "react";
import QRCode from "react-qr-code";

export default function Demo() {
  const dataObject = {
    username: "huongcaoha",
    email: "huongcaoha1994@gmail.com",
    phone: "0367508795",
    numberSeat: "G2 , G3",
    room: 10,
    theater: "Beta Hà Nội",
    time: "20-12-2024 19:30",
    movie: "Vua hải tặc",
    food: "combo 1",
    totalMoney: 240000,
  };

  const value = JSON.stringify(dataObject); // Chuyển đổi đối tượng thành chuỗi

  return (
    <div>
      <h1>QR Code Example</h1>
      <QRCode value={value} size={256} />
    </div>
  );
}
