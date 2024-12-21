import baseUrl from "../apis/instance";

export const getAllScreenRoom = async (page = 0, size = 5, search = "") => {
  let url = `/api.myService.com/v1/screenRooms`;
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

export const getSeatByScreen = async (screenRoomId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/seats/getAll/${screenRoomId}`
  );
  return response.data;
};

export const getScreenByTheater = async (theaterId) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/screenRooms/getScreenByTheater/${theaterId}`
  );

  return response.data;
};

export const getAllScreen = async () => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/screenRooms/getAll`
  );

  return response.data;
};

export const saveDataScreenRoomSeat = async (seats) => {
  seats.map((seat) => {
    const seatRequest = {
      screenRoomId: seat.screenRoom.id,
      seatName: seat.seatName,
      typeSeat: seat.typeSeat,
      status: seat.status,
    };
    const response = baseUrl.put(
      `/api.myService.com/v1/admin/seats/${seat.id}`,
      seatRequest
    );
    // sai kiểu dữu liệu cảu status , trong api là int còn trong react là boolean
  });
};
