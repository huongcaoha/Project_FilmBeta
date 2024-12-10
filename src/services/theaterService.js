import baseUrl from "../apis/instance";

export const fetchAllTheater = async (page = 0, size = 5, search = "") => {
  let url = "/api.myService.com/v1/admin/theaters";
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

export const createTheater = async (theater) => {
  const response = baseUrl.post(
    "/api.myService.com/v1/admin/theaters",
    theater
  );
  return response;
};
