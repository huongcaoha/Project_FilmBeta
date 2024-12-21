import React, { useEffect, useState } from "react";
import { fetchAllNewsPermitAll } from "../../services/newsService";
import { NavLink } from "react-router-dom";

export default function ListNews() {
  const [listNews, setListNews] = useState([]);

  const getAllNews = async () => {
    try {
      const response = await fetchAllNewsPermitAll();

      setListNews(response);
    } catch (error) {}
  };

  useEffect(() => {
    getAllNews();
  }, []);

  return (
    <>
      <div className="px-[160px] pt-6 bg-[rgb(248,248,248)] text-[rgb(51,51,51)] font-[Oswald] pb-6">
        <p className="text-[32px] font-normal mb-8 ">KHUYẾN MÃI MỚI</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listNews.length > 0 ? (
            listNews.map((news, index) => (
              <div
                key={news?.id || news?.title} // Thêm key để tránh lỗi
                className={`relative ${
                  // Hàng đầu tiên, tin đầu tiên chiếm 2 cột và 2 hàng
                  index === 0
                    ? // ? "col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-2"
                      "col-span-2"
                    : // Hai tin còn lại trong hàng đầu tiên chiếm 1 cột và 1 hàng
                    index === 1 || index === 2
                    ? "col-span-1 h-fit"
                    : // Các tin còn lại chiếm 1 cột và 1 hàng
                      "col-span-1"
                }`}
              >
                {/* Hình ảnh */}
                <div className="mb-4">
                  <img
                    src={news?.image} // Hiển thị hình ảnh từ URL
                    alt={news?.title}
                    className={`w-full h-full object-cover rounded-[16px] ${
                      index === 0 ? "lg:h-full" : ""
                    }`} // Tăng kích thước ảnh cho tin đầu tiên
                  />
                </div>
                {/* Tiêu đề */}
                {/* Box màu cam với tiêu đề */}
                {index === 0 && (
                  <div className="absolute bottom-4 left-0 w-full bg-orange-400 bg-opacity-60 text-white p-6 rounded-b-[16px]">
                    <div className="text-lg font-normal text-[28px] hover:underline">
                      <NavLink to={`/news/${news?.id}`}>{news?.title}</NavLink>
                    </div>
                  </div>
                )}

                {/* Các box khác */}
                {index !== 0 && (
                  <div className="mt-4">
                    <div className="text-lg font-normal hover:underline">
                      <NavLink to={`/news/${news?.id}`}>{news?.title}</NavLink>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              Không có tin tức nào.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
