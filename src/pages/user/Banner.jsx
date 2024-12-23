import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Outlet } from "react-router-dom";

export default function Banner() {
  const images = [
    "https://files.betacorp.vn/media/images/2024/12/20/art-online-khai-truong-vy-1702-x-621-092548-201224-43.png",
    "https://files.betacorp.vn/media/images/2024/12/18/ctkm-khai-truong-rap-moi-1702x621-120724-181224-69.png",
    "https://files.betacorp.vn/media/images/2024/12/20/1702x621-101550-201224-81.png",
    "https://files.betacorp.vn/media/images/2024/12/20/hen-ho-xi-ne-uu-dai-si-me-1702-x-621-111419-201224-49.png",
    "https://files.betacorp.vn/media/images/2024/12/20/1702x621-3-092105-201224-32.jpg",
    "https://files.betacorp.vn/media/images/2024/12/20/xem-phim-cuc-chill-1702-x-621-112701-201224-11.png",
    "https://files.betacorp.vn/media/images/2024/12/13/xap-xinh-an-choi-1702-x-621-160546-131224-65.png",
  ];
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "auto" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Outlet />
    </div>
  );
}
