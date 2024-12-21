import baseUrl from "../apis/instance";

export const fetchAllComments = async (size, page, search) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/admin/comments?size=${size}&page=${page}&search=${search}`
  );

  return response.data;
};

//Trả lời bình luận
export const replyComment = async (reply, id) => {
  const response = await baseUrl.post(
    `api.myService.com/v1/admin/comments/reply/${id}`,
    { replyComment: reply.replyComment }
  );
  return response;
};

//Thay đổi trạng thái commnet

export const updateStatusComment = async (id, comment) => {
  const response = await baseUrl.put(
    `api.myService.com/v1/admin/comments/updateStatus/${id}`,
    comment
  );
  return response;
};

//Comment bên user và permit_all

export const findAllCommentByMovieId = async (movieId) => {
  const response = await baseUrl.get(
    `api.myService.com/v1/permit_all/comments/movie/${movieId}`
  );
  return response.data;
};

//User Comment
export const postCommentByMovieId = async (movieId, newComment) => {
  const response = await baseUrl.post(
    `api.myService.com/v1/user/comments/movie/${movieId}/add`,
    newComment
  );
  return response;
};

//Xóa comment
export const deleteComment = async (movieId) => {
  const response = await baseUrl.delete(
    `api.myService.com/v1/user/comments/movie/${movieId}/delete`
  );
  return response;
};

// Sửa bình luận
export const editComment = async (movieId, comment) => {
  const response = await baseUrl.put(
    `api.myService.com/v1/user/comments/movie/${movieId}/update`,
    comment
  );
  return response;
};
