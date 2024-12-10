import baseUrl from "../apis/instance";

export const fetchAllCategory = async (size, page, search) => {
  const response = await baseUrl.get(
    `admin/categories?size=${size}&page=${page}&search=${search}`
  );
  return response.data;
};

//Thêm mới
export const createCategory = async (category) => {
  const response = await baseUrl.post("admin/categories/add", category);
  return response;
};

//Xóa
export const deleteCategory = async (id) => {
  const response = await baseUrl.delete(`admin/categories/${id}`);
  return response;
};

//Cập nhật
export const updateCategory = async (id, category) => {
  const response = await baseUrl.put(`admin/categories/${id}`, category);
  return response;
};
