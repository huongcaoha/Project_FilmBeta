import baseUrl from "../apis/instance";

export const fetchAllBookings = async (page = 0, size = 5, search = "") => {
  let url = `/api.myService.com/v1/admin/bookings`;
  const params = [];
  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (search) {
    params.push(`search=${encodeURIComponent(search)}`); // Mã hóa tham số search
  }

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

// export const getMovies = async () => {
//   const response = await baseUrl.get()
// }
