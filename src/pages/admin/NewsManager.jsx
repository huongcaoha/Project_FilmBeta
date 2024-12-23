import React, { useEffect, useState } from "react";
import {
  createNews,
  deleteNews,
  fetchAllNews,
  updateNews,
} from "../../services/newsService";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
} from "antd";
import { useDebounce } from "../../hooks/useDebounce";

import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

export default function NewsManager() {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [listNews, setListNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [idNews, setIdNews] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const debouceSearch = useDebounce(searchValue, 300);

  const [oldImage, setOldImage] = useState(null); // State để lưu ảnh cũ
  const [sortOrder, setSortOrder] = useState(null); //Sắp xếp theo tên

  //Cập nhật
  const handleEdit = (id) => {
    const news = listNews.find((news) => news.id === id);

    // Lưu poster cũ vào state
    setOldImage(news.image);

    setIdNews(id);
    form.setFieldsValue({
      title: news.title,
      content: news.content,
      image: news.image,
      start_time: moment(news.start_time),
      end_time: moment(news.end_time),
    });

    // Gán URL ảnh cũ vào preview
    setPreview(news.image);
    setIsShowModal(true);
    setIsEditMode(true);
  };

  //Upfile ảnh
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui long chon file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        formData
      );
      const secureUrl = response.data.secure_url;
      setImageUrl(secureUrl); // Cập nhật state với URL trả về
      setPreview(null);
      return secureUrl;
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Xóa
  const handleDelete = (id) => {
    setIdNews(id);
    setIsShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Xóa tin tức
      await deleteNews(idNews);
      message.success("Tin tức đã được xóa thành công.");
      // setListNews((prev) => prev.filter((news) => news.id !== idNews));

      // Đóng modal và đặt lại trang hiện tại
      setIsShowModalDelete(false);
      setCurrentPage(0);
    } catch (err) {
      console.error("Lỗi khi xóa tin tức:", err);
    }
  };

  const handleCancelDelete = () => {
    setIsShowModalDelete(false);
  };

  //Hiển thị all
  const getAllNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllNews(pageSize, currentPage, debouceSearch);
      setListNews(response.content);
      setTotalElements(response.totalElements);
      setIsLoading(false);
    } catch (error) {}
  };

  //Lưu dữ liệu
  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
    getAllNews();
  }, [pageSize, currentPage, debouceSearch, file]);

  const handleChangePage = (page) => {
    setCurrentPage(page - 1);
  };

  //Đại diện cho dữ liệu
  const dataSource = (Array.isArray(listNews) ? listNews : []).map(
    (news, index) => {
      return {
        id: news.id,
        key: news.id,
        index: index + 1,
        title: news.title,
        image: news.image,
        start_time: news.start_time,
        end_time: news.end_time,
      };
    }
  );

  //Đại diện các hàng ở trên bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Image"
          style={{ width: "50px", height: "auto", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "N/A"),
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

  //Thêm hoặc sửa
  const onFinish = async (news) => {
    //Gọi API thêm mới sản phẩm
    const newNews = {
      ...news,
      start_time: news.start_time ? news.start_time.format("YYYY-MM-DD") : "", // Đảm bảo format ngày
      end_time: news.end_time ? news.end_time.format("YYYY-MM-DD") : "", // Đảm bảo format ngày
    };
    try {
      // Nếu là chế độ sửa mà không chọn ảnh mới, giữ ảnh cũ
      if (!file && isEditMode) {
        newNews.image = oldImage; // Giữ ảnh cũ khi chỉnh sửa
      }

      // Nếu có chọn ảnh mới, upload ảnh
      if (file) {
        const uploadedImageUrl = await handleUpload();
        if (uploadedImageUrl) {
          newNews.image = uploadedImageUrl; // Gán URL ảnh mới vào movie
        }
      }

      let response;
      if (isEditMode) {
        // Cập nhật danh mục
        response = await updateNews(idNews, newNews);
      } else {
        //Thêm mới
        response = await createNews(newNews);
      }

      if (response.status === 201) {
        // Hiển thị thông báo
        message.success("Thêm tin tức thành công.");
      } else if (response.status === 200) {
        // Cập nhật thành công
        message.success("Cập nhật tin tức thành công.");
      }
      // Reset form
      form.resetFields();
      //Đóng modal
      handleCloseModal();
      setPreview(null);
      getAllNews();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        form.setFields([
          {
            name: "title",
            errors: ["Tiêu đề đã tồn tại."],
          },
        ]);
      } else if (error.response && error.response.status === 401) {
        form.setFields([
          {
            name: "start_time",
            errors: ["Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại!"],
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
    const sortedData = [...listNews].sort((a, b) => {
      if (value === "asc") {
        return new Date(a.start_time) - new Date(b.start_time);
      } else {
        return new Date(b.end_time) - new Date(a.end_time);
      }
    });
    setListNews(sortedData);
  };

  //Tìm kiếm
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(0);
    getAllNews(value, 0);
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
            <h3>{isEditMode ? "Update News" : "Create News"}</h3>
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[
              {
                required: true,
                message: "Start Time is required!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="end_time"
            dependencies={["start_time"]}
            rules={[
              {
                required: true,
                message: "End Time is required!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue("start_time");

                  // Kiểm tra nếu có giá trị start_time và end_time
                  if (!value || !startTime) {
                    return Promise.resolve();
                  }

                  // So sánh ngày kết thúc với ngày bắt đầu
                  if (value.isAfter(startTime, "day")) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: "Image is required!",
              },
            ]}
          >
            <div className="flex items-center gap-3">
              <Input type="file" onChange={handleChangeFile} />
            </div>
          </Form.Item>

          <div>
            {preview ? <img width={100} src={preview} alt="" /> : <></>}
            {isLoadingFile && <div>Loading...</div>}
          </div>

          <Form.Item
            label="Content"
            name="content"
            rules={[
              {
                required: true,
                message: "Content is required!",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter movie description" />
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
          <p className="text-[32px] pb-6 font-medium">News Manager</p>
          <Button type="primary" onClick={handleShowModal}>
            Add News
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
