import baseUrl from "../apis/instance";

export const fetchAllBookings = async (
  page = 0,
  size = 5,
  movieId,
  theaterId,
  screenRoomId,
  showTimeId
) => {
  let url = `/api.myService.com/v1/admin/bookings`;
  const params = [];
  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }
  if (movieId) {
    params.push(`movieId=${encodeURIComponent(search.movieId)}`);
  }
  if (theaterId) {
    params.push(`theaterId=${encodeURIComponent(search.theaterId)}`);
  }
  if (screenRoomId) {
    params.push(`screenRoomId=${encodeURIComponent(search.screenRoomId)}`);
  }
  if (showTimeId) {
    params.push(`showTimeId=${encodeURIComponent(search.showTimeId)}`);
  }

  // Nếu có tham số, thêm chúng vào URL
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await baseUrl.get(url);
  return response.data;
};

export const getBookingSeatById = async (bookingId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/admin/bookingSeats/${bookingId}`
  );
  console.log(response.data);
  return response.data;
};
