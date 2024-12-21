import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieById } from "../../services/movieService";
import moment from "moment";
import {
  deleteComment,
  editComment,
  findAllCommentByMovieId,
  postCommentByMovieId,
} from "../../services/adminComment";
import { getUserLogin } from "../../services/loginAdmin";

import { Button, Input, message, Modal } from "antd";
import { FrownOutlined, UserOutlined } from "@ant-design/icons";
import { getShowTimeByMovieAndDate } from "../../services/showTime";
import { useCookies } from "react-cookie";

export default function MovieDetail() {
  const { movieId } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cookies, setCookie] = useCookies(["showTimeDetail", "currentTheater"]); // Khai báo cookies
  const currentTheater = cookies.currentTheater || "Beta Hà Nội";
  const [showTimes, setShowTimes] = useState([]);

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [formDetail, setFormDetail] = useState(false);
  const [showTimeDetail, setShowTimeDetail] = useState(null);
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState("");
  const [userLogin, setUserLogin] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await getUserLogin();
      setUserLogin(response);
      setIsLoggedIn(true);
    } catch (error) {}
  };

  //Xóa bình luận
  const handleDelete = async () => {
    if (!userLogin) {
      message.error("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    // Tìm bình luận của người dùng hiện tại
    const userComment = comments.find(
      (comment) => comment.user.username === userLogin.username
    );

    if (!userComment) {
      message.error("Bạn không có quyền sửa bình luận này!");
    }

    const hasChildComment = comments.some(
      (comment) => comment.parentComment?.id === userComment.id
    );

    if (hasChildComment) {
      message.error("Không thể xóa bình luận vì có bình luận con.");
      return;
    }

    try {
      const response = await deleteComment(movieId).then(() => {
        message.success("Bình luận của bạn đã được xóa!");
        setComments(
          comments.filter(
            (comment) => comment.user.username !== userLogin.username
          )
        );
      });
    } catch (error) {}
  };

  //Sửa bình luận
  const handleEdit = async () => {
    if (!userLogin) {
      message.error("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    const userComment = comments.find(
      (comment) => comment.user.username === userLogin.username
    );

    if (!userComment) {
      message.error("Bạn không có quyền sửa bình luận này!");
    }

    if (!newComment.trim()) {
      message.warning("Nội dung bình luận không được để trống!");
      return;
    }

    try {
      const updatedComment = {
        id: userComment.id,
        comment: newComment,
      };

      // Gọi API để chỉnh sửa bình luận
      const response = await editComment(movieId, updatedComment);

      if (response.status === 200) {
        // Cập nhật bình luận sau khi chỉnh sửa
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedComment.id
              ? { ...comment, comment: updatedComment.comment }
              : comment
          )
        );
        setEditingComment(null); // Reset trạng thái chỉnh sửa
        setNewComment(""); // Reset ô nhập liệu
        message.success("Bình luận của bạn đã được chỉnh sửa!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi chỉnh sửa bình luận!");
    }
  };

  //Thêm bình luận
  const handleComment = async () => {
    if (!userLogin) {
      message.error("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) {
      message.warning("Nội dung bình luận không được để trống!");
      return;
    }
    const commentData = { comment: newComment, user: userLogin, status: true };
    try {
      const response = await postCommentByMovieId(movieId, commentData);

      message.success("Bình luận của bạn đã được gửi thành công!");
      setNewComment("");
      getAllCommentsByMovieId(movieId);
    } catch (error) {
      console.log(error);

      message.error("Bạn đã bình luận phim này rồi !!!");
    }
  };

  //Hiển thị tất cả bình luận của phim đó
  const getAllCommentsByMovieId = async (movieId) => {
    try {
      const response = await findAllCommentByMovieId(movieId);
      setComments(response);
    } catch (error) {}
  };

  const dayOfWeeks = () => {
    const week = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      const dayOfWeek = daysOfWeek[date.getDay()];

      week.push({
        day,
        month,
        dayOfWeek,
        date: date.toDateString(),
      });
    }
    return week;
  };

  const weeks = dayOfWeeks();

  const handleDateClick = (date) => {
    setCurrentDate(date); // Chuyển đổi chuỗi ngày thành đối tượng Date
  };

  const showTimeByMovieAndDate = async () => {
    const response = await getShowTimeByMovieAndDate(
      movieId,
      currentDate,
      currentTheater
    );
    setShowTimes(response);
  };

  useEffect(() => {
    const getMovie = async () => {
      try {
        const movieData = await fetchMovieById(movieId);
        setMovie(movieData);
      } catch (error) {}
    };

    if (movieId) {
      getMovie();
      getAllCommentsByMovieId(movieId);
      fetchUser();
    }

    showTimeByMovieAndDate();
  }, [movieId, currentDate, currentTheater]);

  const handleOpenFormDetail = (showTimeDetail) => {
    setShowTimeDetail(showTimeDetail);
    setFormDetail(true);
  };

  const handleCloseFormDetail = () => {
    setShowTimeDetail(null);
    setFormDetail(false);
  };

  const handleBookingTicket = () => {
    setCookie("showTimeDetail", showTimeDetail, { path: "/user" }); // Lưu cookie
    navigate("/user/bookingTicket"); // Chuyển hướng
  };

  return (
    <>
      <div className="py-4 pl-[172px] pt-8">
        <p className="text-[24px] font-[Oswald]">
          <span className="text-[rgb(51,51,51)]">Trang chủ {"> "}</span>
          <span className="text-[rgb(51,122,183)]">{movie?.movieName}</span>
        </p>
      </div>
      <div className="px-[160px] flex gap-10">
        <div className="w-[258px]">
          <img
            src={movie?.poster}
            alt=""
            className="h-[407px] w-full rounded-[16px]"
          />
        </div>
        <div className="flex-1">
          <p className="text-[33px] font-[Oswald] font-medium">
            {movie?.movieName}
          </p>
          <div className="text-[18px] pb-1">
            <p className="pb-1">{movie?.description}</p>
            <p className="pb-1">
              <span className="font-medium">ĐẠO DIỄN: </span> {movie?.director}
            </p>
            <p className="flex gap-1 pb-1">
              <span className="font-medium">DIỄN VIÊN: </span>
              <span className="flex-1">{movie?.cast}</span>
            </p>
            <p className="pb-1">
              <span className="font-medium">THỂ LOẠI: </span>{" "}
              {movie?.categories.map((cate) => cate?.categoryName).join(", ")}
            </p>
            <p className="pb-1">
              <span className="font-medium">THỜI LƯỢNG: </span>{" "}
              {movie?.duration} phút
            </p>
            <p className="pb-1">
              <span className="font-medium">NGÔN NGỮ: </span> {movie?.language}
            </p>
            <p>
              <span className="font-medium">NGÀY KHỞI CHIẾU: </span>{" "}
              {moment(movie?.releaseDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
      </div>

      {/* Phần lịch chiếu và đặt vé*/}

      <div className="p-10 flex justify-center">
        <ul className="flex gap-10">
          {weeks.map((d, index) => (
            <li
              key={index}
              onClick={() => handleDateClick(d.date)}
              style={{
                cursor: "pointer",
                borderBottom:
                  moment(currentDate).format("YYYY-MM-DD") ===
                  moment(d.date).format("YYYY-MM-DD")
                    ? "2px solid blue"
                    : "none",
              }}
            >
              <h1 className="flex">
                <p className="text-4xl">{d.day}</p>
                <p className="mt-4">
                  /{d.month} - {d.dayOfWeek}
                </p>
              </h1>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center items-center">
        {showTimes.map((st) => {
          const showTimeDate = new Date(st.showTime);

          // Kiểm tra nếu showTimeDate là hợp lệ
          if (isNaN(showTimeDate)) {
            console.error(`Invalid date: ${st.showTime}`);
            return null; // Hoặc có thể hiển thị một thông báo lỗi
          }

          const hour = showTimeDate.getHours();
          const minute = String(showTimeDate.getMinutes()).padStart(2, "0");
          const period = hour >= 12 ? "PM" : "AM";
          const formattedHour = String(hour % 12 || 12).padStart(2, "0");

          return (
            <Button
              onClick={() => handleOpenFormDetail(st)}
              className="mt-3 mr-2 bg-[#e5e5e5]"
              key={st.id || st.showTime} // Sử dụng một thuộc tính duy nhất
            >
              {formattedHour}:{minute} {period}
            </Button>
          );
        })}
        {showTimes.length === 0 ? (
          <div>
            <p className="font-[Oswald] font-normal text-[30px] text-[rgb(51,51,51)]">
              Danh sách trống <FrownOutlined /> !!!
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Modal
        open={formDetail}
        onCancel={handleCloseFormDetail}
        footer={null} // Không hiển thị footer
        centered // Căn giữa modal
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }} // Background trong suốt
      >
        <div style={{ backdropFilter: "blur(10px)", padding: "20px" }}>
          <h2 className="text-2xl font-semibold mb-5">Thông tin lịch chiếu</h2>
          <div className="text-xl">
            <div className="flex justify-center items-center">
              <img
                style={{
                  borderRadius: "10px",
                  width: "400px",
                  height: "563px",
                }}
                src={showTimeDetail?.movie.poster}
                alt=""
              />
            </div>
            <div className="mt-4">
              <h1>Movie : {showTimeDetail?.movie.movieName}</h1>
              <div>
                <p>Theater : {showTimeDetail?.theater.name}</p>
                <p>
                  Time :{" "}
                  {moment(showTimeDetail?.showTime).format(
                    "DD-MM-YYYY / HH:MM:00"
                  )}
                </p>
              </div>
              <Button
                onClick={handleBookingTicket}
                type="primary"
                className="flex m-auto mt-5"
              >
                Book tickets
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Phần comment */}
      <div className="px-[160px] pt-10">
        {/* Khung nhập liệu và nút gửi */}
        <div className="flex gap-4 border-t py-4">
          <Input
            placeholder="Add a comment ..."
            className="w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="primary"
            className="h-12 px-6"
            onClick={editingComment ? handleEdit : handleComment}
          >
            {editingComment ? "Update" : "Post"}
          </Button>
        </div>

        {/* Hiển thị các bình luận */}
        <div>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`flex gap-4 border-b pb-4 ${
                comment.parentComment ? "ml-8 pt-2" : "pt-4"
              }`} // Kiểm tra nếu có parentComment thì thêm lùi vào
            >
              <div>
                <UserOutlined className="text-xl" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{comment.user.username}</div>
                <div className="text-gray-400 flex justify-between items-center">
                  <div>{comment.comment}</div>
                  <div>
                    {/* Hiển thị nút xóa và chỉnh sửa chỉ nếu là bình luận của userLogin */}
                    {comment.user.username === userLogin?.username && (
                      <div className="flex ml-auto">
                        <Button
                          className="font-medium"
                          type="link"
                          onClick={() => {
                            setEditingComment(comment);
                            setNewComment(comment.comment);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          className="font-medium"
                          type="link"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
