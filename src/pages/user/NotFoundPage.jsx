import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen  text-gray-800">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! Trang bạn tìm không tồn tại.</p>
        <button
          onClick={goToHome}
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Quay lại trang chủ
        </button>
      </div>
      <Footer />
    </div>
  );
}
