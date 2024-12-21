import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { fetchNewsDetail } from "../../services/newsService";
import { fetchAllMoviesComingSoon } from "../../services/movieService";

export default function NewsDetail() {
  const { newsId } = useParams();

  console.log(newsId);

  const [newsDetail, setNewsDetail] = useState(null);
  const [listMoviesComing, setListMoviesComing] = useState([]);

  console.log(newsDetail);

  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNewsDetail(newsId);
        setNewsDetail(newsData);
      } catch (error) {}
    };

    if (newsId) {
      getNews();
    }
  }, [newsId]);

  useEffect(() => {
    const getListMoviesComing = async () => {
      try {
        const response = await fetchAllMoviesComingSoon();
        setListMoviesComing(response);
      } catch (error) {}
    };
    getListMoviesComing();
  });

  return (
    <>
      <div className="flex justify-between gap-6 bg-[rgb(248,248,248)] px-[200px] pt-[140px] pb-6">
        {/* Phần nội dung news */}
        <div className="flex-1">
          <p className="text-[28px] font-light mb-6 font-[Oswald]">
            {newsDetail?.title}
          </p>
          <div className="w-[560px] pb-6">
            <img
              className="w-full rounded-[16px]"
              src={newsDetail?.image}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[16px] font-medium pb-8">
              {newsDetail?.content}
            </p>
            <div>
              <p className="text-[24px] font-medium font-[Oswald] pb-4">
                Điều khoản và điều kiện áp dụng:
              </p>
              <ul className="list-disc pl-6">
                <li>Áp dụng cho Khách hàng là Thành viên của Beta Cinemas.</li>
                <li>
                  Áp dụng cả với khách hàng mua vé trực tiếp tại quầy và khách
                  hàng đã mua vé online đến quầy lấy vé.
                </li>
                <li>
                  Áp dụng cho cả các suất chiếu đặc biệt và suất chiếu sớm.
                </li>
                <li>
                  Không áp dụng đồng thời cùng các chương trình khuyến mãi khác
                  của quầy Concession (như Mad Sale Day,...).
                </li>
                <li>
                  Không áp dụng cho các kênh bán hàng liên kết khác: 123phim,
                  TIX, Moveek, Airpay, Shopee, MoMo, VNPAY.
                </li>
                <li>Không áp dụng cho các Group Sale hoặc Private Show.</li>
                <li>Không áp dụng tích điểm thành viên.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Danh sách phim sắp chiếu */}
        <div className="flex-1 pt-6">
          <p className="text-center text-[36px] font-normal font-[Oswald]">
            PHIM SẮP CHIẾU
          </p>
          <div className="grid grid-cols-2 gap-4">
            {listMoviesComing?.map((movie) => (
              <div key={movie?.id} className="p-4 w-[282px] ">
                <img
                  src={movie?.poster}
                  alt={movie?.movieName}
                  className="w-full rounded-t-lg mb-2 rounded-[12px]"
                />
                <p className="text-[rgb(51,122,183)] text-[18px] text-center font-medium font-[Oswald]">
                  <NavLink to={`/movies/${movie.id}`}>
                    {movie.movieName}
                  </NavLink>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
