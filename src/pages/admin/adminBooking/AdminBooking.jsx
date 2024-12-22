import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Select } from "antd";
import { LoadingOutlined, RedoOutlined } from "@ant-design/icons";

import {
  fetchAllBookings,
  getBookingSeatById,
} from "../../../services/booking";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  getMovieByMonth,
  getShowTimeByScreenRoom,
} from "../../../services/showTime";
import baseUrl from "../../../apis/instance";
import { getListTheaters } from "../../../services/theaterService";
import { getScreenByTheater } from "../../../services/screenRoom";
import moment from "moment";
import AdminBookingDetail from "./AdminBookingDetail";

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [formDetail, setFormDetail] = useState(false);
  const [bookingSeats, setBookingSeats] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [bookingDetail, setBookingDetail] = useState({});
  const [search, setSearch] = useState({
    movieId: "",
    theaterId: "",
    screenRoomId: "",
    showTimeId: "",
    date: "",
  });
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screenRooms, setScreenRooms] = useState([]);
  const [showTimes, setShowTimes] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await fetchAllBookings(
        currentPage - 1,
        search.date,
        search.movieId,
        search.theaterId,
        search.screenRoomId,
        search.showTimeId
      );
      setBookings(response.bookings.map((t, index) => ({ ...t, index })));
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  const getMovies = async () => {
    try {
      const response = await getMovieByMonth();
      setMovies(response);
    } catch (error) {}
  };

  const getTheaters = async () => {
    try {
      const response = await getListTheaters();
      setTheaters(response);
    } catch (error) {}
  };

  const getScreenRooms = async () => {
    if (search.theaterId) {
      try {
        const response = await getScreenByTheater(search.theaterId);
        setScreenRooms(response);
      } catch (error) {}
    }
  };

  const getShowTimes = async () => {
    if (search.screenRoomId) {
      try {
        const response = await getShowTimeByScreenRoom(search.screenRoomId);
        setShowTimes(response);
      } catch (error) {}
    }
  };

  useEffect(() => {
    getMovies();
    getTheaters();
    getScreenRooms();
    getShowTimes();
    fetchBookings();
  }, [search]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const getBookingDetail = async (bookingId) => {
    try {
      const response = await getBookingSeatById(bookingId);
      setBookingSeats(response);
    } catch (error) {
      console.log(error);
    }
  };

  const useDebounceSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchBookings();

    if (bookingId) {
      getBookingDetail(bookingId);
    }
  }, [currentPage, useDebounceSearch, bookingId, search]);

  const handleCloseDetail = () => {
    setFormDetail(false);
  };

  const handleOpenDetail = (record) => {
    setFormDetail(true);
    setBookingId(record.id);
    setBookingDetail(record);
  };

  const columnBookingDetail = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1, // Lấy chỉ số và cộng thêm 1
    },
    {
      title: "Seat Name",
      key: "seatName",
      render: (_, record) => record.seat.seatName,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => record.quantity,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => record.price,
    },
    {
      title: "Created Date",
      key: "created_date",
      render: (_, record) => record.created_date,
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1, // Lấy chỉ số và cộng thêm 1
    },
    {
      title: "Date Booking",
      key: "dateBookiong",
      render: (_, record) => moment(record.created_at).format("YYYY-MM-DD"),
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => record.user.username,
    },
    {
      title: "Total Seat",
      key: "totalSeat",
      render: (_, record) => record.totalSeat,
    },
    {
      title: "Show Time",
      key: "address",
      render: (_, record) =>
        moment(record.showTime.showTime).format("YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (_, record) =>
        formatCurrency(
          record.totalPriceMovie + record.totalPriceFood - record.discount
        ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (_, record) => (
        <div>
          <p>{formatCurrency(record.discount)}</p>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <Button type="primary" onClick={() => handleOpenDetail(record)}>
            View Detail
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <h1 className="text-4xl font-bold">Bookings Management</h1>
      {isLoading ? <LoadingOutlined /> : <></>}

      <div className="px-[150px] py-[50px]">
        <div className="m-10 flex justify-end">
          <Input
            value={search.date}
            type="date"
            style={{ width: 200 }}
            onChange={(value) => {
              // console.log("date =>> ", value.target.value);
              return setSearch({ ...search, date: value.target.value });
            }} // Bắt sự kiện thay đổi
          ></Input>
          <Select
            value={search.movieId}
            style={{ width: 200 }}
            onChange={(value) => {
              return setSearch({ ...search, movieId: value });
            }} // Bắt sự kiện thay đổi
          >
            <Option value="">Search Movie</Option>
            {movies.map((movie, index) => (
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
            {theaters.map((theater, index) => (
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
            {screenRooms.map((screenRoom, index) => (
              <Option key={index} value={screenRoom.id}>
                {screenRoom.screenName}
              </Option>
            ))}
          </Select>

          <Select
            value={search.showTimeId}
            style={{ width: 200 }}
            onChange={(value) => {
              setSearch({ ...search, showTimeId: value });
            }}
          >
            <Option value="">Search Show Time</Option>
            {showTimes.map((showTime, index) => (
              <Option key={index} value={showTime.id}>
                {showTime.showTime}
              </Option>
            ))}
          </Select>
        </div>

        <Table
          dataSource={bookings}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: totalPage * 5,
            onChange: handleChangePage,
          }}
        />

        <div>
          <Modal open={formDetail} onCancel={handleCloseDetail} footer={false}>
            {bookingDetail ? (
              <AdminBookingDetail
                bookingDetail={bookingDetail}
              ></AdminBookingDetail>
            ) : (
              <></>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
