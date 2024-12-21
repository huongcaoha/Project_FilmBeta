import baseUrl from "../apis/instance";

export const fetchAllNews = async (size, page, search) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/admin/news?size=${size}&page=${page}&search=${search}`
  );
  return response.data;
};

export const createNews = async (news) => {
  const response = await baseUrl.post(
    "api.myService.com/v1/admin/news/add",
    news
  );
  return response;
};

export const updateNews = async (id, news) => {
  const response = await baseUrl.put(
    `api.myService.com/v1/admin/news/${id}`,
    news
  );
  return response;
};

export const deleteNews = async (id) => {
  const response = await baseUrl.delete(
    `api.myService.com/v1/admin/news/${id}`
  );
  return response;
};

//Phần user và permit All

export const fetchAllNewsPermitAll = async () => {
  const response = await baseUrl.get("api.myService.com/v1/permit_all/news");

  return response.data;
};

//Chi tiết tin tức
export const fetchNewsDetail = async (newsId) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/permit_all/news/${newsId}`
  );
  return response.data;
};
