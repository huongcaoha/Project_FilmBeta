import baseUrl from "../apis/instance";

export const fetchAllCategory = async (size, page, search) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/admin/categories?size=${size}&page=${page}&search=${search}`
  );
  return response.data;
};

//Thêm mới
export const createCategory = async (category) => {
  const response = await baseUrl.post(
    "api.myService.com/v1/admin/categories/add",
    category
  );
  return response;
};

//Xóa
export const deleteCategory = async (id) => {
  const response = await baseUrl.delete(
    `api.myService.com/v1/admin/categories/${id}`
  );
  return response;
};

//Cập nhật
export const updateCategory = async (id, category) => {
  const response = await baseUrl.put(
    `api.myService.com/v1/admin/categories/${id}`,
    category
  );
  return response;
};
