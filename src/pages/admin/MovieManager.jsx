import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  createMovie,
  deleteMovie,
  fetchAllCategory,
  fetchAllMovie,
  updateMovie,
} from "../../services/movieService";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import moment from "moment";
import { Option } from "antd/es/mentions";

export default function MovieManager() {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [searchValue, setSearchValue] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [idMovie, setIdMovie] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]); //mảng chứa các ID của các danh mục được chọn

  const [oldPoster, setOldPoster] = useState(null); // State để lưu ảnh cũ
  const [sortOrder, setSortOrder] = useState(null); //Sắp xếp theo tên

  //Gọi modal update
  const handleEdit = (id) => {
    const movie = movies.find((movie) => movie.id === id);

    // Lưu poster cũ vào state
    setOldPoster(movie.poster);

    // Lấy các categoryId của movie và gán vào selectedCategories
    const categoryIds = movie.categories.map((category) => category.id);
    setSelectedCategories(categoryIds);

    setIdMovie(id);
    form.setFieldsValue({
      movieName: movie.movieName,
      duration: movie.duration,
      director: movie.director,
      releaseDate: moment(movie.releaseDate),
      cast: movie.cast,
      description: movie.description,
      language: movie.language,
      poster: movie.poster,
      categoryIds: categoryIds,
    });

    // Gán URL ảnh cũ vào preview
    setPreview(movie.poster);
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
      setPreview(null); // Dọn dẹp preview nếu tải lên thành công
      return secureUrl;
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouceSearch = useDebounce(searchValue, 300);

  const getAllMovie = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllMovie(
        pageSize,
        currentPage,
        debouceSearch
      );
      setMovies(response.content);
      setTotalElements(response.totalElements);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
    const getAllCategory = async () => {
      try {
        const response = await fetchAllCategory();
        setCategories(response);
      } catch (error) {}
    };

    getAllCategory();

    getAllMovie();
  }, [pageSize, currentPage, debouceSearch, file]);

  //Đại diện cho dữ liệu
  const dataSource = movies
    ? movies.map((movie, index) => {
        return {
          id: movie.id,
          key: movie.id,
          index: index + 1,
          movieName: movie.movieName,
          categoryNames: movie.categories
            .map((cate) => cate.categoryName)
            .join(", "),
          duration: movie.duration,
          releaseDate: movie.releaseDate,
          director: movie.director,
          poster: movie.poster,
          trailer: movie.trailer,
        };
      })
    : [];

  const handleChangePage = (page) => {
    setCurrentPage(page - 1);
  };

  //Đại diện các hàng ở trên bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Movie name",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Category",
      dataIndex: "categoryNames",
      key: "movieName",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (poster) => (
        <img
          src={poster}
          alt="Poster"
          style={{ width: "50px", height: "auto", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} phút`,
    },
    {
      title: "ReleaseDate",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
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

  const handleResetSearch = () => {
    setSearchValue("");
  };

  //Xóa
  const handleDelete = (id) => {
    setIdMovie(id);
    setIsShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteMovie(idMovie)
      .then(() => {
        message.success("Phim đã xóa thành công");
        setIsShowModalDelete(false);
        setCurrentPage(0);
        getAllMovie();
      })
      .catch((err) => {});
  };

  const handleCancelDelete = () => {
    setIsShowModalDelete(false);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues); // Cập nhật state với giá trị được chọn
  };

  //Thêm mới hoặc sửa
  const onFinish = async (movie) => {
    //Gọi API thêm mới sản phẩm
    const newMovie = {
      ...movie,
      releaseDate: movie.releaseDate
        ? movie.releaseDate.format("YYYY-MM-DD")
        : "",
    };

    try {
      // Nếu là chế độ sửa mà không chọn ảnh mới, giữ ảnh cũ
      if (!file && isEditMode) {
        newMovie.poster = oldPoster; // Giữ ảnh cũ khi chỉnh sửa
      }

      // Nếu có chọn ảnh mới, upload ảnh
      if (file) {
        const uploadedImageUrl = await handleUpload();
        if (uploadedImageUrl) {
          newMovie.poster = uploadedImageUrl; // Gán URL ảnh mới vào movie
        }
      }

      let response;

      if (isEditMode) {
        // Cập nhật danh mục
        response = await updateMovie(idMovie, newMovie);
      } else {
        response = await createMovie(newMovie);
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
      setPreview(null);
      getAllMovie();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Hiển thị thông báo lỗi dưới trường categoryName
        form.setFields([
          {
            name: "movieName",
            errors: ["Tên phim đã tồn tại."],
          },
        ]);
      } else if (error.response && error.response.status === 401) {
        form.setFields([
          {
            name: "releaseDate",
            errors: ["Ngày phát hành phải lớn hơn hoặc bằng ngày hiện tại."],
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

  //Sắp xếp
  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedData = [...movies].sort((a, b) => {
      if (value === "asc") {
        return a.movieName.localeCompare(b.movieName);
        // return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else {
        return b.movieName.localeCompare(a.movieName);
        // return new Date(b.releaseDate) - new Date(a.releaseDate);
      }
    });
    setMovies(sortedData);
  };

  //Tìm kiếm
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(0);
    getAllMovie(value, 0);
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
            <h3>{isEditMode ? "Update Movie" : "Add Movie"}</h3>
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
            label="Movie Name"
            name="movieName"
            rules={[
              {
                required: true,
                message: "Movie name is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Duration"
            name="duration"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "Duration is required!",
              },
              {
                validator: (_, value) => {
                  if (!value || value > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Duration must be greater than 0!")
                  );
                },
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Release Date"
            name="releaseDate"
            rules={[
              {
                required: true,
                message: "Release date is required!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label="Director"
            name="director"
            rules={[
              {
                required: true,
                message: "Director is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cast"
            name="cast"
            rules={[
              {
                required: true,
                message: "Cast is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
            rules={[
              {
                required: true,
                message: "Language is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Poster"
            name="poster"
            rules={[
              {
                required: true,
                message: "Poster is required!",
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
            label="Category"
            name="categoryIds"
            rules={[
              {
                required: true,
                message: "Category is required!",
              },
            ]}
          >
            <Checkbox.Group
              options={categories.map((cat) => ({
                label: cat.categoryName, // Hiển thị tên danh mục
                value: cat.id, // Lưu giá trị ID danh mục
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
            />
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
          <h3>Movie Manager</h3>
          <Button type="primary" onClick={handleShowModal}>
            Add movie
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
