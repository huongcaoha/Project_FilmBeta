import baseUrl from "../apis/instance";

//Thống kê số người đăng ký mới
export const fetchAllNewUserRegister = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/dashboard/new_user_register"
  );
  return response.data;
};

//Thống kê số phòng chiếu
export const fetchAllScreenRoom = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/dashboard/count_screen_room"
  );
  return response.data;
};

//Thống kê số phim sắp chiếu
export const fetchAllMovieComingSoon = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/dashboard/movies_coming_soon"
  );
  return response.data;
};

//Thống kê tổng doanh thu
export const fetchTotalPrice = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/dashboard/revenue/total_price"
  );
  return response.data;
};

//Thống kê ra người chi tiêu nhiều nhất
export const fetchTop1UserBooking = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/dashboard/top_1_user_revenue"
  );
  return response.data;
};

//Thống kê biểu đồ theo tháng
export const fetchAllRevenuByYear = async (year) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/admin/dashboard/revenue/${year}`
  );
  return response.data;
};
