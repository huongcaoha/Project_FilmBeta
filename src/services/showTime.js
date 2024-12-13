import baseUrl from "../apis/instance";

export const fetchAllShowTime = async (
  page = 0,
  size = 5,
  search = "",
  showDate = "",
  theaterId = "",
  movieId = "",
  screenRoomId = ""
) => {
  let url = `/api.myService.com/v1/admin/showTimes`;
  let params = [];
  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (search) {
    params.push(`search=${encodeURIComponent(search)}`); // Mã hóa tham số search
  }

  if (showDate) {
    params.push(`showDate=${encodeURIComponent(showDate)}`);
  }

  if (theaterId) {
    params.push(`theaterId=${theaterId}`);
  }

  if (movieId) {
    params.push(`movieId=${movieId}`);
  }

  if (screenRoomId) {
    params.push(`screenRoomId=${screenRoomId}`);
  }

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await baseUrl.get(url);
  return response.data;
};

export const createShowTime = async (showTime) => {
  const response = await baseUrl.post(
    "/api.myService.com/v1/admin/showTimes",
    showTime
  );
  console.log(response.data);
  return response.data;
};

export const deleteShowTime = async (id) => {
  const response = await baseUrl.delete(
    `/api.myService.com/v1/admin/showTimes/${id}`
  );
  return response.data;
};

export const updateShowTime = async (showTime, id) => {
  const response = await baseUrl.put(
    `/api.myService.com/v1/admin/showTimes/${id}`,
    showTime
  );
  return response.data;
};

export const getMovieByMonth = async () => {
  const response = await baseUrl.get(
    "/api.myService.com/v1/admin/movies/getMovieByMonth"
  );
  return response.data;
};
