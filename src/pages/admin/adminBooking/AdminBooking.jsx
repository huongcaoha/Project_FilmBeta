import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Select } from "antd";
import { LoadingOutlined, RedoOutlined } from "@ant-design/icons";

import {
  fetchAllBookings,
  getBookingSeatById,
} from "../../../services/booking";
import { useDebounce } from "../../../hooks/useDebounce";

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [formDetail, setFormDetail] = useState(false);
  const [bookingSeats, setBookingSeats] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [search, setSearch] = useState({
    movieId: "",
    theaterId: "",
    screenRoomId: "",
    showTimeId: "",
  });
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screenRooms, setScreenRooms] = useState([]);
  const [showTimes, setShowTimes] = useState([]);

  const fetchBookings = async () => {
    try {
      let response = null;
      if (search) {
        response = await fetchAllBookings(currentPage - 1, 5, search);
      } else {
        response = await fetchAllBookings(currentPage - 1);
      }
      setBookings(response.bookings.map((t, index) => ({ ...t, index })));
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  const getMovies = async () => {};

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
  }, [currentPage, useDebounceSearch, bookingId]);

  const handleCloseDetail = () => {
    setFormDetail(false);
  };

  const handleOpenDetail = (record) => {
    setFormDetail(true);
    setBookingId(record.id);
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

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1, // Lấy chỉ số và cộng thêm 1
    },
    {
      title: "Show Time",
      key: "address",
      render: (_, record) => record.showTime.showTime,
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
      title: "Total Price Movie",
      key: "totalPriceMovie",
      render: (_, record) => record.totalPriceMovie,
    },
    {
      title: "Total Price Food",
      key: "totalPriceFood",
      render: (_, record) => record.totalPriceFood,
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
          <Select
            defaultValue=""
            style={{ width: 200 }}
            // onChange={handleChange} // Bắt sự kiện thay đổi
          >
            <Option value="">Search Movie</Option>
          </Select>

          <Select
            defaultValue=""
            style={{ width: 200 }}
            // onChange={handleChange} // Bắt sự kiện thay đổi
          >
            <Option value="">Search Theater</Option>
          </Select>

          <Select
            defaultValue=""
            style={{ width: 200 }}
            // onChange={handleChange} // Bắt sự kiện thay đổi
          >
            <Option value="">Search Screen</Option>
          </Select>

          <Select
            defaultValue=""
            style={{ width: 200 }}
            // onChange={handleChange} // Bắt sự kiện thay đổi
          >
            <Option value="">Search Show Time</Option>
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
          <Modal
            title="Booking Detail"
            open={formDetail}
            onCancel={handleCloseDetail}
            footer={false}
          >
            <Table
              dataSource={bookingSeats}
              columns={columnBookingDetail}
              pagination={{
                current: currentPage,
                pageSize: 5,
                total: totalPage * 5,
                onChange: handleChangePage,
              }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
