import moment from "moment";
import baseUrl from "../apis/instance";
import { da } from "date-fns/locale";

export const fetchAllBookings = async (
  page = 0,
  date,
  movieId,
  theaterId,
  screenRoomId,
  showTimeId
) => {
  let url = `/api.myService.com/v1/admin/bookings?page=${page}&date=${date}&movieId=${movieId}&theaterId=${theaterId}&screenRoomId=${screenRoomId}&showTimeId=${showTimeId}`;
  const response = await baseUrl.get(url);

  return response.data;
};

export const getBookingSeatById = async (bookingId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/admin/bookingSeats/${bookingId}`
  );

  return response.data;
};

export const handleBooking = async (
  showTimeId,
  listSeatId,
  totalPriceFood,
  foodBookingRequests,
  giftId,
  discount
) => {
  const response = await baseUrl.post("/api.myService.com/v1/bookings", {
    showTimeId: showTimeId,
    listSeatId: listSeatId,
    totalPriceFood: totalPriceFood,
    foodBookingRequests: foodBookingRequests,
    giftId: giftId,
    discount: discount,
  });
  return response.data;
};

export const getMoneyBySeats = async (showTimeId, seatIds) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/bookings/getMoneyBySeat?showTimeId=${showTimeId}&seatIds=${seatIds}`
  );

  return response.data;
};

export const getUser = async () => {
  const response = await baseUrl.get(
    "/api.myService.com/v1/user/account/getUser"
  );
  return response.data;
};

export const seatToMoney = async (seatId, showTimeId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/bookings/getPriceOfSeat/seatId/${seatId}/showTimeId/${showTimeId}`
  );
  return response.data;
};
