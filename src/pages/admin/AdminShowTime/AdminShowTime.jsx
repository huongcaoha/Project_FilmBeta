import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Select } from "antd";
import { LoadingOutlined, RedoOutlined } from "@ant-design/icons";

import {
  createShowTime,
  deleteShowTime,
  fetchAllShowTime,
  findMovieById,
  getMovieByMonth,
  getShowTimeByScreenRoom,
  updateShowTime,
} from "../../../services/showTime";
import {
  fetchAllTheater,
  getListTheaters,
} from "../../../services/theaterService";
import { useDebounce } from "../../../hooks/useDebounce";
import { getAllScreen, getScreenByTheater } from "../../../services/screenRoom";
import moment from "moment";

export default function AdminShowTime() {
  const [showTimes, setShowTimes] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [formConfirm, setFormConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [screenRooms, setScreenRooms] = useState([]);
  const [search, setSearch] = useState({
    movieId: "",
    theaterId: "",
    screenRoomId: "",
    showTimeId: "",
  });
  const [movies, setMovies] = useState([]);
  const [showTime, setShowTime] = useState({
    movieId: "",
    showTime: "",
    typeMovie: "",
    theaterId: "",
    screenRoomId: "",
  });

  const [error, setError] = useState({
    movieId: "",
    showTime: "",
    typeMovie: "",
    theaterId: "",
    screenRoomId: "",
  });

  const [searchMovies, setSearchMovies] = useState([]);
  const [searchTheaters, setSearchTheaters] = useState([]);
  const [searchScreenRooms, setSearchScreenRooms] = useState([]);
  const [searchShowTimes, setSearchShowTimes] = useState([]);

  const getScreenByTheaterId = async () => {
    try {
      const response = await getScreenByTheater(Number(showTime.theaterId));
      setScreenRooms(response);
    } catch (error) {}
  };

  //---------------------------------

  const getMovies = async () => {
    try {
      const response = await getMovieByMonth();
      setSearchMovies(response);
    } catch (error) {}
  };

  const getTheaters = async () => {
    try {
      const response = await getListTheaters();
      setSearchTheaters(response);
    } catch (error) {}
  };

  const getScreenRooms = async () => {
    if (search.theaterId) {
      try {
        const response = await getScreenByTheater(search.theaterId);
        setSearchScreenRooms(response);
      } catch (error) {}
    }
  };

  const getShowTimes = async () => {
    if (search.screenRoomId) {
      try {
        const response = await getShowTimeByScreenRoom(search.screenRoomId);
        setSearchShowTimes(response);
      } catch (error) {}
    }
  };

  const fetchShowTimes = async () => {
    try {
      const response = await fetchAllShowTime(
        currentPage - 1,
        search.movieId,
        search.theaterId,
        search.screenRoomId,
        search.showTimeId
      );

      setShowTimes(response.showTimes);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShowTimes();
    getMovies();
    getTheaters();
    getScreenRooms();
    getShowTimes();
  }, [
    search.movieId,
    search.theaterId,
    search.showTimeId,
    search.screenRoomId,
  ]);

  const fetchTheater = async () => {
    try {
      const response = await getListTheaters();

      setTheaters(response);
    } catch (error) {
      console.error(error);
    }
  };

  const useDebounceSearch = useDebounce(search, 300);

  const getMovie = async () => {
    try {
      const response = await getMovieByMonth();
      setMovies(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShowTimes();
    getMovie();
    fetchTheater();
    getScreenByTheaterId();
  }, [currentPage, useDebounceSearch, showTime.theaterId, search]);

  const handleSearchMovie = (value) => {
    setSearch({
      movieId: value,
      theaterId: "",
      screenRoomId: "",
      showTimeId: "",
    });
  };

  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
    setError({
      movieId: "",
      showTime: "",
      typeMovie: "",
      theaterId: "",
      screenRoomId: "",
    });
    setShowTime({
      movieId: "",
      showTime: "",
      typeMovie: "",
      theaterId: "",
      screenRoomId: "",
    });
    setIsUpdate(false);
    setIdUpdate(null);
  };

  const checkFormData = (e) => {
    let checkForm = true;
    if (!showTime.movieId) {
      setError((pre) => {
        return { ...pre, movieId: "Movie can not blank" };
      });
      checkForm = false;
    }

    if (!showTime.screenRoomId) {
      setError((pre) => {
        return { ...pre, screenRoomId: "Screen room can not blank" };
      });
      checkForm = false;
    }

    if (!showTime.showTime) {
      setError((pre) => {
        return { ...pre, showTime: "Show time can not blank" };
      });
      checkForm = false;
    }

    if (!showTime.typeMovie) {
      setError((pre) => {
        return { ...pre, typeMovie: "Type movie can not blank" };
      });
      checkForm = false;
    }

    if (!showTime.theaterId) {
      setError((pre) => {
        return { ...pre, theaterId: "Theater can not blank" };
      });
      checkForm = false;
    }
    return checkForm;
  };

  const checkFormValid = (e) => {
    const { name, value } = e.target;
    const newShowTime = { ...showTime, [name]: value };

    setShowTime(newShowTime);
    if (!value) {
      const newError = { ...error, [name]: name + " can not blank" };
      setError(newError);
    } else {
      const newError = { ...error, [name]: "" };
      setError(newError);
    }

    if (name === "theaterId") {
      getScreenByTheaterId(Number(value));
    }
  };

  const getMovieById = async () => {
    return await findMovieById(showTime.movieId);
  };

  const handelOpenFormUpdate = (showTime) => {
    setIsUpdate(true);
    setShowTime({
      movieId: showTime.movie.id,
      showTime: showTime.showTime,
      typeMovie: showTime.typeMovie,
      theaterId: showTime.theater.id,
      screenRoomId: showTime.screenRoom.id,
    });
    setIsShowForm(true);
    setIdUpdate(showTime.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = checkFormData();

    if (!isFormValid) {
      message.error("Create error");
    } else {
      const dateTime = e.target.showTime.value;
      let momentDate = moment(dateTime);
      const hour = momentDate.hours(); // Lấy giờ
      if (hour === 0) {
        momentDate = momentDate.add(12, "hours").format("YYYY-MM-DD HH:mm:ss");
      } else {
        momentDate = e.target.showTime.value;
      }
      const showTime = {
        movieId: Number(e.target.movieId.value),
        screenRoomId: Number(e.target.screenRoomId.value),
        showTime: momentDate,
        typeMovie: e.target.typeMovie.value,
        theaterId: Number(e.target.theaterId.value),
      };

      const movie = getMovieById(showTime.movieId);
      if (isUpdate) {
        if (showTime.showTime < movie.releaseDate) {
          message.error(
            "Showtime must be greater than or equal to release date"
          );
        } else {
          try {
            const response = await updateShowTime(showTime, idUpdate);
            if (response) {
              message.success("Update show time success");
              handleCloseForm();
              fetchShowTimes();
            } else {
              message.error("show time name existed");
            }
          } catch (err) {
            // setError({
            //   ...error,
            //   showTime: err?.response?.data.message.showTime,
            // });
            message.error(
              "Show time existed or time must be future or present"
            );
          }
        }
      } else {
        try {
          console.log(
            "showTime: ",
            moment(showTime).format("YYYY-MM-DD hh:mm:ss A")
          );

          const response = await createShowTime(showTime);
          if (response) {
            message.success("create show time success");
            handleCloseForm();
            fetchShowTimes();
          } else {
            message.error(
              "Show time existed or time must be future or present"
            );
            setError({
              ...error,
              showTime: err?.response?.data.message.showTime,
            });
          }
        } catch (err) {
          console.log("Error: ", err);

          // setError({
          //   ...error,
          //   showTime: err?.response?.data.message.showTime,
          // });
          message.error("Show time existed or time must be future or present");
        }
      }
    }
  };

  const handleCloseConfirm = () => {
    setFormConfirm(false);
    setIdDelete(null);
  };

  const handleDeleteShowTime = async () => {
    try {
      const response = await deleteShowTime(idDelete);
      if (response != null) {
        message.success("Delete show time successfully");
        setShowTimes((pre) => {
          return pre.filter((t) => t.id != idDelete);
        });
        setCurrentPage(1);
      }
    } catch (error) {
      message.error("Delete show time error");
    }
    handleCloseConfirm();
  };

  const handleOpenConfirm = (id) => {
    setIdDelete(id);
    setFormConfirm(true);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
    },
    {
      title: "Movie",
      key: "movie",
      render: (_, record) => record.movie.movieName,
    },
    {
      title: "Screen Room",
      key: "screenName",
      render: (_, record) => record.screenRoom.screenName,
    },

    {
      title: "Show Time",
      key: "showTime",
      render: (_, record) => record.showTime,
    },
    {
      title: "Type Movie",
      key: "typeMovie",
      render: (_, record) => record.typeMovie,
    },
    {
      title: "Theater",
      key: "name",
      render: (_, record) => record.theater.name,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <Button type="primary" onClick={() => handelOpenFormUpdate(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleOpenConfirm(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <h1 className="text-4xl font-bold">Show Time Management</h1>
      {isLoading ? <LoadingOutlined /> : <></>}

      <div className="px-[150px] py-[50px]">
        <div className="flex justify-end">
          <Button
            type="primary"
            className=" w-[200px] h-[40px] text-lg"
            onClick={handleOpenForm}
          >
            Create Show Time
          </Button>
        </div>

        <div className="m-10 flex justify-end">
          <Select
            value={search.movieId}
            style={{ width: 200 }}
            onChange={(value) => handleSearchMovie(value)}
          >
            <Option value="">Search Movie</Option>
            {searchMovies.map((movie, index) => (
              <Option key={index} value={movie.id}>
                {movie.movieName}
              </Option>
            ))}
          </Select>

          <Select
            value={search.theaterId}
            style={{ width: 200 }}
            onChange={(value) => {
              const newSearch = {
                ...search,
                theaterId: value,
                screenRoomId: "",
                showTimeId: "",
              };
              return setSearch(newSearch);
            }}
          >
            <Option value="">Search Theater</Option>
            {searchTheaters.map((theater, index) => (
              <Option key={index} value={theater.id}>
                {theater.name}
              </Option>
            ))}
          </Select>

          <Select
            value={search.screenRoomId}
            style={{ width: 200 }}
            onChange={(value) => {
              return setSearch({
                ...search,
                screenRoomId: value,
                showTimeId: "",
              });
            }}
          >
            <Option value="">Search Screen</Option>
            {searchScreenRooms.map((screenRoom, index) => (
              <Option key={index} value={screenRoom.id}>
                {screenRoom.screenName}
              </Option>
            ))}
          </Select>

          {/* <Select
            value={search.showTimeId}
            style={{ width: 200 }}
            onChange={(value) => {
              setSearch({ ...search, showTimeId: value });
            }}
          >
            <Option value="">Search Show Time</Option>
            {searchShowTimes.map((showTime, index) => (
              <Option key={index} value={showTime.id}>
                {showTime.showTime}
              </Option>
            ))}
          </Select> */}
        </div>

        <Table
          dataSource={showTimes}
          columns={columns}
          pagination={{
            current: currentPage, // Trang hiện tại
            pageSize: 5, // Số lượng mục trên mỗi trang
            total: totalPage * 5, // Tổng số mục
            onChange: handleChangePage, // Hàm xử lý khi thay đổi trang
          }}
        />
      </div>

      <div>
        <Modal
          title="Confirm Delete"
          open={formConfirm}
          onOk={handleDeleteShowTime}
          onCancel={handleCloseConfirm}
        >
          <p>Do you want delete this show time ?</p>
        </Modal>
      </div>

      <div>
        <Modal
          title={isUpdate ? "Update Show Time" : "Create Show Time"}
          open={isShowForm}
          footer={null}
          onCancel={() => handleCloseForm()}
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mr-4">Movie Name :</label>
              <select
                value={showTime.movieId}
                name="movieId"
                onChange={checkFormValid}
              >
                <option value={""}>Select Movie</option>
                {movies?.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.movieName}
                  </option>
                ))}
              </select>
              {error.movieId ? (
                <p className="text-red-600">{error.movieId}</p>
              ) : (
                <></>
              )}
            </div>

            <div className="flex">
              <label className="mr-3">Show Time :</label>
              <Input
                type="datetime-local"
                value={showTime.showTime}
                name="showTime"
                onChange={checkFormValid}
              ></Input>

              {error.showTime ? (
                <p className="text-red-600">{error.showTime}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label className="mr-4">Type Movie :</label>
              <select
                value={showTime.typeMovie}
                name="typeMovie"
                onChange={checkFormValid}
              >
                <option value={""}>Select Movie</option>
                <option value={"TYPE_2D"}>TYPE_2D</option>
                <option value={"TYPE_3D"}>TYPE_3D</option>
              </select>
              {error.typeMovie ? (
                <p className="text-red-600">{error.typeMovie}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label className="mr-4">Theater :</label>
              <select
                value={showTime.theaterId}
                name="theaterId"
                onChange={checkFormValid}
              >
                <option value={""}>Select Theater</option>
                {theaters?.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
              {error.theaterId ? (
                <p className="text-red-600">{error.theaterId}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label className="mr-4">Screen Room :</label>
              <select
                value={showTime.screenRoomId}
                name="screenRoomId"
                onChange={checkFormValid}
              >
                <option value={""}>Select Screen Room</option>
                {screenRooms?.map((screenRoom) => (
                  <option key={screenRoom.id} value={screenRoom.id}>
                    {screenRoom.screenName}
                  </option>
                ))}
              </select>
              {error.screenRoomId ? (
                <p className="text-red-600">{error.screenRoomId}</p>
              ) : (
                <></>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="primary"
                className="w-[100px] h-[35px]"
                htmlType="submit"
              >
                {isUpdate ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
