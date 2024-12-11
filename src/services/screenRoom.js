import baseUrl from "../apis/instance";

export const getAllScreenRoom = async (page = 0, size = 5, search = "") => {
  let url = `/api.myService.com/v1/admin/screenRooms`;
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

  return await baseUrl.get(url);
};

export const createScreenRoom = async (screenRoom) => {
  return await baseUrl.post(
    "/api.myService.com/v1/admin/screenRooms",
    screenRoom
  );
};

export const deleteScreenRoom = async (id) => {
  const response = await baseUrl.delete(
    `/api.myService.com/v1/admin/screenRooms/${id}`
  );
  return response.data;
};

export const updateScreenRoom = async (screenRoom, id) => {
  const response = await baseUrl.put(
    `/api.myService.com/v1/admin/screenRooms/${id}`,
    screenRoom
  );
  return response.data;
};
