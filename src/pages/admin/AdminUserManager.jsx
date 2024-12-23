import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Modal,
  Form,
  Spin,
  message,
} from "antd";
import { fetchUsers, changePage } from "../../redux/slices/userSlice";

const AdminUserManager = () => {
  const dispatch = useDispatch();
  const { users, size, totalElement, currentPage, loading, error } =
    useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, size: size }));
  }, [dispatch, currentPage]);

  const handleSearch = () => {
    // Thêm tham số API tìm kiếm
    dispatch(fetchUsers({ search: searchText }));
  };

  const handleChangePage = (page) => {
    dispatch(changePage(page - 1));
  };

  const handleBlock = (id) => {
    dispatch(blockUser(id))
      .unwrap()
      .then(() => {
        message.success("Khóa tài khoản thành công!");
        dispatch(fetchUsers({ page: currentPage, size: size }));
      })
      .catch((err) => message.error(err || "Có lỗi xảy ra!"));
  };

  const handleRestore = (id) => {
    dispatch(restoreUser(id))
      .unwrap()
      .then(() => {
        message.success("Mở tài khoản thành công!");
        dispatch(fetchUsers({ page: currentPage, size: size }));
      })
      .catch((err) => message.error(err || "Có lỗi xảy ra!"));
  };

  // const handleUpdate = (values) => {
  //   dispatch(updateUser({ id: editingUser.id, data: values }))
  //     .unwrap()
  //     .then(() => {
  //       message.success("Cập nhật thông tin người dùng thành công!");
  //       setIsModalOpen(false);
  //       setEditingUser(null);
  //     })
  //     .catch((err) => message.error(err || "Có lỗi xảy ra!"));
  // };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          {record.isBlocked ? (
            // <Button
            //   type="primary"
            //   onClick={() => handleToggleStatus(record.id, record.isBlocked)}

            // >
            //   Active
            // </Button>
            console.log(record)
          ) : (
            <Button
              type="default"
              danger
              onClick={() => handleToggleStatus(record.id, record.isBlocked)}
            >
              Block
            </Button>
          )}
        </div>
      ),
    },
  ];
  console.log("user", users);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-[32px] pb-6 font-medium">Combo Food Management</h1>
      <div className="flex justify-between mb-4">
        <Input.Search
          placeholder="Tìm kiếm người dùng..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          enterButton
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: currentPage + 1, // Trang hiện tại
            pageSize: size, // Số lượng mục trên mỗi trang
            total: totalElement, // Tổng số mục
            onChange: handleChangePage, // Hàm xử lý khi thay đổi trang
          }}
        />
      )}

      {error && <div className="text-red-500 mt-2">Có lỗi xảy ra: {error}</div>}
    </div>
  );
};

export default AdminUserManager;
