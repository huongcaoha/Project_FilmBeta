import baseUrl from "../apis/instance";

export const fetchAllTheater = async (page = 0, size = 5, search = "") => {
  let url = `/api.myService.com/v1/theaters`;
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

  const response = baseUrl.get(url);
  return response ;
};

export const createTheater = async (theater) => {
  return await baseUrl.post("/api.myService.com/v1/admin/theaters", theater);
};

export const checkNameExist = async (name) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/admin/theaters/checkNameExist/${name}`
  );
  return response.data;
};

export const getCity = async () => {
  const response = await baseUrl.get("/api.myService.com/v1/city");
  return response.data;
};

export const deleteTheater = async (id) => {
  const response = await baseUrl.delete(
    `/api.myService.com/v1/admin/theaters/${id}`
  );
  return response.data;
};

export const updateTheater = async (theater, id) => {
  const response = await baseUrl.put(
    `/api.myService.com/v1/admin/theaters/${id}`,
    theater
  );
  return response.data;
};

export const getListTheaters = async () => {
  const response = await baseUrl.get(
    "/api.myService.com/v1/theaters/getTheaters"
  );
  return response.data;
};

export const getTheaterByCityName = async (cityName) => {
  const response = await baseUrl.get(
    `/api.myService.com/v1/theaters/getTheaterByCity?cityName=${cityName}`
  );

  return response.data;
};
