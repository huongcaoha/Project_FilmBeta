import baseUrl from "../apis/instance";

export const fetchAllShowTime = async (
  movieId,
  theaterId,
  screenRoomId,
  showTimeId
) => {
  // let url = `/api.myService.com/v1/admin/showTimes`;
  // let params = [];

  // if (movieId) {
  //   params.push(`movieId=${movieId}`);
  // }

  // if (theaterId) {
  //   params.push(`theaterId=${theaterId}`);
  // }

  // if (screenRoomId) {
  //   params.push(`screenRoomId=${screenRoomId}`);
  // }

  // if (showTimeId) {
  //   params.push(`showTimeId=${showTimeId}`);
  // }

  // if (params.length > 0) {
  //   url += `?${params.join("&")}`;
  // }

  // const response = await baseUrl.get(url);
  // console.log(url);
  const url = `/api.myService.com/v1/admin/showTimes?movieId=${movieId}&theaterId=${theaterId}&screenRoomId=${screenRoomId}&showTimeId=${showTimeId}`;
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

export const getShowTimeByScreenRoom = async (screenRoomId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/admin/showTimes/getShowTimeByScreenRoom/${screenRoomId}`
  );
  return response.data;
};

export const getShowTimeByMovieAndDate = async (movieId, date) => {
  
  const localDateString = date.toISOString().split('T')[0];
  const response = await baseUrl.get(`/api.myService.com/v1/admin/showTimes/getShowTimeByMovieAndDate?movieId=${movieId}&date=${localDateString}`);
  return response.data;
}
