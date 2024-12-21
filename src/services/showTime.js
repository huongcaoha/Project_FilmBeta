import moment from "moment";
import baseUrl from "../apis/instance";

export const fetchAllShowTime = async (
  page,
  movieId,
  theaterId,
  screenRoomId,
  showTimeId
) => {
  const url = `/api.myService.com/v1/showTimes?page=${page}&movieId=${movieId}&theaterId=${theaterId}&screenRoomId=${screenRoomId}&showTimeId=${showTimeId}`;
  const response = await baseUrl.get(url);
  return response.data;
};

export const createShowTime = async (showTime) => {
  const response = await baseUrl.post(
    "/api.myService.com/v1/admin/showTimes",
    showTime
  );

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
    "/api.myService.com/v1/movies/getMovieByMonth"
  );
  return response.data;
};

export const getShowTimeByScreenRoom = async (screenRoomId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/showTimes/getShowTimeByScreenRoom/${screenRoomId}`
  );
  return response.data;
};

export const getShowTimeByMovieAndDate = async (movieId, date, theaterName) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/showTimes/getShowTimeByMovieAndDate?movieId=${movieId}&date=${moment(
      date
    ).format("YYYY-MM-DD")}&theaterName=${theaterName}`
  );
  return response.data;
};

export const findMovieById = async (movieId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/movies/${{ movieId }}`
  );
  return response.data;
};
