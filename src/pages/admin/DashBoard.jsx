import React, { useEffect, useState } from "react";
import {
  fetchAllMovieComingSoon,
  fetchAllNewUserRegister,
  fetchAllRevenuByYear,
  fetchAllScreenRoom,
  fetchTop1UserBooking,
  fetchTotalPrice,
} from "../../services/dashboard";
import {
  DollarOutlined,
  ForwardOutlined,
  MenuUnfoldOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Select, Table } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  Legend,
} from "recharts";

export default function DashBoard() {
  const [listNewUserRegister, setListNewUserRegister] = useState([]);
  const [listScreenRoom, setListScreenRoom] = useState([]);
  const [listMovieComingSoon, setListMovieComingSoon] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceTopUser, setTotalPriceTopUser] = useState(0);
  const [listBookingTopUser, setListBookingTopUser] = useState([]);
  const [topUser, setTopUser] = useState(null);

  const { Option } = Select;
  //Thống kê doanh thu theo năm
  const [revenueData, setRevenueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatData = (revenueData) => {
    return Object.keys(revenueData).map((month) => ({
      month: monthNames[month - 1], // Chuyển số tháng thành tên tháng
      revenue: revenueData[month],
    }));
  };

  const formattedData = formatData(revenueData);

  //Lấy doanh thu theo năm
  const getRevenueData = async (year) => {
    try {
      const response = await fetchAllRevenuByYear(year);
      setRevenueData(response);
    } catch (error) {}
  };

  // Lấy dữ liệu khi người dùng chọn năm
  useEffect(() => {
    getRevenueData(selectedYear);
  }, [selectedYear]);

  // Tạo danh sách năm (Ví dụ từ 2020 đến năm hiện tại)
  const yearOptions = [];
  for (let year = 2020; year <= new Date().getFullYear(); year++) {
    yearOptions.push(year);
  }

  const getAllBookingTopUser = async () => {
    try {
      const response = await fetchTop1UserBooking();

      setListBookingTopUser(response);
      if (response.length > 0) {
        const user = response[0].user; // Giả sử thông tin user có trong mỗi phần tử
        setTopUser(user);
      }
      const totalPrice = response.reduce(
        (acc, item) =>
          acc + (item.totalPriceMovie || 0) + (item.totalPriceFood || 0),
        0
      );
      setTotalPriceTopUser(totalPrice);
    } catch (error) {}
  };
  const getAllListMovieComingSoon = async () => {
    try {
      const response = await fetchAllMovieComingSoon();
      setListMovieComingSoon(response);
    } catch (error) {}
  };

  const getAllNewUserRegister = async () => {
    try {
      const response = await fetchAllNewUserRegister();
      setListNewUserRegister(response);
    } catch (error) {}
  };

  const getAllListScreenRoom = async () => {
    try {
      const response = await fetchAllScreenRoom();
      setListScreenRoom(response);
    } catch (error) {}
  };

  const getTotalPrice = async () => {
    const response = await fetchTotalPrice();
    setTotalPrice(response);
  };

  useEffect(() => {
    getAllListMovieComingSoon();
    getAllNewUserRegister();
    getAllListScreenRoom();
    getTotalPrice();
    getAllBookingTopUser();
  }, []);

  const dataSource = topUser
    ? [
        {
          key: "1",
          username: topUser.username,
          phone: topUser.phone,
          email: topUser.email,
          address: topUser.address,
          totalPrice: `${totalPriceTopUser.toLocaleString()} VND`,
        },
      ]
    : [];

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  const dataNewUser = listNewUserRegister
    ? listNewUserRegister.map((newUser, index) => {
        return {
          id: newUser.id,
          key: newUser.id,
          index: index + 1,
          username: newUser.username,
          phone: newUser.phone,
        };
      })
    : [];

  const columnsNewUser = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <div>
      <p className="text-[32px] pb-6">DashBoard</p>

      {/* Phần thống kê newUsers,total... */}
      <div className="flex justify-between gap-2 text-white pb-6">
        <div className="relative w-[24%] h-[150px] rounded-lg bg-cyan-600 flex flex-col justify-between">
          {/* Khối hiển thị số lượng New Users */}
          <div className="flex justify-between items-center gap-1 px-3 pt-2">
            <div>
              <p className="font-bold text-[42px] text-white">
                {listNewUserRegister?.length || 0}
              </p>
              <p className="text-[16px] pt-2 text-white">New Users</p>
            </div>
            <div>
              <UsergroupAddOutlined
                style={{ fontSize: "66px", color: "white", opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Khối More Info */}
          <div className="absolute bottom-0 left-0 w-full text-center bg-[rgba(255,255,255,0.2)] py-1 rounded-b-lg">
            <p className="text-white">
              More Info <ForwardOutlined />
            </p>
          </div>
        </div>

        <div className="relative w-[24%] h-[150px] rounded-lg bg-green-600 flex flex-col justify-between">
          {/* Khối hiển thị số lượng New Users */}
          <div className="flex justify-between items-center gap-1 px-3 pt-2">
            <div>
              <p className="font-bold text-[42px] text-white">
                {listScreenRoom?.length || 0}
              </p>
              <p className="text-[16px] pt-2 text-white">Screen Rooms</p>
            </div>
            <div>
              <MenuUnfoldOutlined
                style={{ fontSize: "66px", color: "white", opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Khối More Info */}
          <div className="absolute bottom-0 left-0 w-full text-center bg-[rgba(255,255,255,0.2)] py-1 rounded-b-lg">
            <p className="text-white">
              More Info <ForwardOutlined />
            </p>
          </div>
        </div>

        <div className="relative w-[24%] h-[150px] rounded-lg bg-orange-400 flex flex-col justify-between">
          {/* Khối hiển thị số lượng New Users */}
          <div className="flex justify-between items-center gap-1 px-3 pt-2">
            <div>
              <p className="font-bold text-[42px] text-white">
                {listMovieComingSoon?.length || 0}
              </p>
              <p className="text-[16px] pt-2 text-white">New Movies</p>
            </div>
            <div>
              <PictureOutlined
                style={{ fontSize: "66px", color: "white", opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Khối More Info */}
          <div className="absolute bottom-0 left-0 w-full text-center bg-[rgba(255,255,255,0.2)] py-1 rounded-b-lg">
            <p className="text-white">
              More Info <ForwardOutlined />
            </p>
          </div>
        </div>

        <div className="relative w-[24%] h-[150px] rounded-lg bg-red-600 flex flex-col justify-between">
          {/* Khối hiển thị số lượng New Users */}
          <div className="flex justify-between items-center gap-1 px-3 pt-2">
            <div>
              <p className="font-bold text-[42px] text-white">
                {(totalPrice || 0).toLocaleString("vi-VN")}
                <span
                  className="text-[16px] ml-1"
                  style={{ verticalAlign: "baseline" }}
                >
                  VND
                </span>
              </p>
              <p className="text-[16px] pt-2 text-white">Total Price</p>
            </div>
            <div>
              <DollarOutlined
                style={{ fontSize: "66px", color: "white", opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Khối More Info */}
          <div className="absolute bottom-0 left-0 w-full text-center bg-[rgba(255,255,255,0.2)] py-1 rounded-b-lg">
            <p className="text-white">
              More Info <ForwardOutlined />
            </p>
          </div>
        </div>
      </div>

      {/* Phần thông tin người dùng mua nhiều nhất */}
      <div className="border-t border-b border-gray-300 pt-2">
        <p className="text-[24px] font-normal pb-2">Top 1 User Booking</p>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          loading={!topUser}
        />
      </div>

      {/* Phần biểu đồ và listUser */}
      <div className="flex justify-between gap-6 pt-4">
        <div className="flex-1">
          <div>
            <h2 className="text-[20px] font-normal">Doanh thu theo năm</h2>
            <div className="flex justify-end">
              <Select
                className="py-1 my-2"
                defaultValue={selectedYear}
                style={{ width: 100 }}
                onChange={(value) => setSelectedYear(value)}
              >
                {yearOptions.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={formattedData}>
                {/* Lưới biểu đồ */}
                <CartesianGrid strokeDasharray="3 3" />

                {/* Trục X và trục Y */}
                <XAxis dataKey="month" />
                <YAxis
                // tickFormatter={(value) => `${value.toLocaleString()} VND`}
                />

                {/* Chú thích */}
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} VND`}
                />
                <Legend />

                {/* Biểu đồ cột với màu xanh dương */}
                <Bar dataKey="revenue" fill="#1E90FF" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-[400px]">
          <p className="text-[20px] font-normal pb-2">New Users</p>
          <Table
            dataSource={dataNewUser}
            columns={columnsNewUser}
            pagination={false}
            loading={!topUser}
            bordered
          />
        </div>
      </div>
    </div>
  );
}
