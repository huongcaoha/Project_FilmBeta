import baseUrl from "../apis/instance";

export const fetchAllMovie = async (size, page, search) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/admin/movies?size=${size}&page=${page}&search=${search}`
  );
  return response.data;
};

//Thêm
export const createMovie = async (movie) => {
  const response = await baseUrl.post(
    "api.myService.com/v1/admin/movies/add",
    movie
  );
  return response;
};

//Xóa
export const deleteMovie = async (id) => {
  const response = await baseUrl.delete(
    `api.myService.com/v1/admin/movies/${id}`
  );
  return response;
};

//Sửa
export const updateMovie = async (id, movie) => {
  const response = await baseUrl.put(
    `api.myService.com/v1/admin/movies/${id}`,
    movie
  );
  return response;
};

export const fetchAllCategory = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/admin/categories/all"
  );

  return response.data;
};
