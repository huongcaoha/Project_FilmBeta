import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchAllCategory,
  updateCategory,
} from "../../services/categoryService";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
} from "antd";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDebounce } from "../../hooks/useDebounce";

export default function CategoryManager() {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [idCate, setIdCate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const debouceSearch = useDebounce(searchValue, 300);
  const [sortOrder, setSortOrder] = useState(null); //Sắp xếp theo tên

  //Cập nhật
  const handleEdit = (id) => {
    const category = categories.find((cate) => cate.id === id);
    setIdCate(id);
    form.setFieldsValue({
      categoryName: category.categoryName,
      description: category.description,
    }); // Chuyển dữ liệu vào form
    setIsShowModal(true);
    setIsEditMode(true);
  };

  //Xóa
  const handleDelete = (id) => {
    setIdCate(id);
    setIsShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteCategory(idCate)
      .then(() => {
        message.success("Danh mục đã được xóa thành công.");
        setCategories((prev) => prev.filter((cate) => cate.id !== idCate));
        setIsShowModalDelete(false);
        setCurrentPage(0); //load về trang đầu tiên
      })
      .catch((err) => {
        message.error(err.response.data.message.message);
      });
  };

  const handleCancelDelete = () => {
    setIsShowModalDelete(false);
  };

  const getAllCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllCategory(
        pageSize,
        currentPage,
        debouceSearch
      );
      setCategories(response.content);
      setTotalElements(response.totalElements);
      setIsLoading(false);
    } catch (error) {}
  };

  //Lưu dữ liệu
  useEffect(() => {
    getAllCategory();
  }, [pageSize, currentPage, debouceSearch]);

  const handleChangePage = (page) => {
    setCurrentPage(page - 1);
  };

  //Đại diện cho dữ liệu
  const dataSource = categories.map((cate, index) => {
    return {
      id: cate.id,
      key: cate.id,
      index: index + 1,
      categoryName: cate.categoryName,
      description: cate.description,
      status: cate.status,
    };
  });

  //Đại diện các hàng ở trên bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div className="flex items-center gap-2">
          {/* Văn bản hiển thị trạng thái */}
          <span>{status ? "Active" : "Inactive"}</span>
          {/* Nút tròn hiển thị trạng thái */}
          <div
            className={`w-2 h-2 rounded-full ${
              status ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <Button
            className="bg-blue-500 text-white"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            className="bg-red-500 text-white"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleShowModal = () => {
    setIsShowModal(true);
  };
  const handleCloseModal = () => {
    setIsShowModal(false);
    setIsEditMode(false);
    // Reset form
    form.resetFields();
  };

  const onFinish = async (category) => {
    //Gọi API thêm mới sản phẩm
    const newCategory = { ...category, status: true };
    try {
      let response;
      if (isEditMode) {
        // Cập nhật danh mục
        response = await updateCategory(idCate, newCategory);
      } else {
        response = await createCategory(newCategory);
      }

      if (response.status === 201) {
        // Hiển thị thông báo
        message.success("Thêm danh mục thành công.");
      } else if (response.status === 200) {
        // Cập nhật thành công
        message.success("Cập nhật danh mục thành công.");
      }
      // Reset form
      form.resetFields();
      //Đóng modal
      handleCloseModal();
      await getAllCategory();
      setCurrentPage(0);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Hiển thị thông báo lỗi dưới trường categoryName
        form.setFields([
          {
            name: "categoryName",
            errors: ["Tên danh mục đã tồn tại."],
          },
        ]);
      } else {
        // Hiển thị thông báo lỗi nếu có lỗi khác
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleResetSearch = () => {
    setSearchValue("");
  };

  //Sắp xếp
  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedData = [...categories].sort((a, b) => {
      if (value === "asc") {
        return a.categoryName.localeCompare(b.categoryName);
      } else {
        return b.categoryName.localeCompare(a.categoryName);
      }
    });
    setCategories(sortedData);
  };

  //Tìm kiếm
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(0);
    getAllCategory(value, 0);
  };
  return (
    <div>
      {/* Modal xóa */}
      <Modal
        title="Xác nhận"
        open={isShowModalDelete}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa danh mục này?
      </Modal>

      {/* Modal thêm mới hoặc sửa */}
      <Modal
        title={
          <div className="flex justify-between mb-4">
            <h3>{isEditMode ? "Update Category" : "Add Category"}</h3>
            <CloseOutlined onClick={handleCloseModal} />
          </div>
        }
        closeIcon={false}
        footer={false}
        open={isShowModal}
      >
        <Form
          form={form}
          layout="vertical" //Chuyển label từ ngang thành dọc
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[
              {
                required: true,
                message: "Category name is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleCloseModal}
                type="default"
                htmlType="button"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <main>
        <div className="flex justify-between mb-4">
          <h3>Category Manager</h3>
          <Button type="primary" onClick={handleShowModal}>
            Add category
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <Select
              placeholder="Sắp xếp"
              style={{ width: 200 }}
              onChange={handleSortChange}
            >
              <Select.Option value="asc">Tăng dần</Select.Option>
              <Select.Option value="desc">Giảm dần</Select.Option>
            </Select>
          </div>
          <div className="flex justify-end gap-4 mb-4">
            <Input.Search
              onChange={(e) => handleSearch(e.target.value)}
              value={searchValue}
              className="w-[400px] "
            />
            <ReloadOutlined onClick={handleResetSearch} />
          </div>
        </div>
        <div className="mb-4">
          <Table
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Pagination
            onChange={handleChangePage}
            total={totalElements}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSize={pageSize}
            current={currentPage + 1}
          />
        </div>
      </main>
    </div>
  );
}
