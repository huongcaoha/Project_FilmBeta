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

//Phần user và permitAll

//Phim đang chiếu (7days)
export const fetchAllMoviesIsShowing = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/permit_all/is_showing"
  );
  return response.data;
};

//Phim sắp chiếu
export const fetchAllMoviesComingSoon = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/permit_all/coming_soon"
  );
  return response.data;
};

//Phim mới nhất
export const fetchAllMoviesNew = async () => {
  const response = await baseUrl.get(
    "api.myService.com/v1/permit_all/movies_new"
  );
  return response.data;
};

//Chi tiết phim
export const fetchMovieById = async (movieId) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/permit_all/movies/${movieId}`
  );

  return response.data;
};
