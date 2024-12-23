import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Upload } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createFood,
  deleteFood,
  getAllComboFood,
  updateFood,
  updateImage,
} from "../../../services/comboFood";
import axios from "axios";

export default function ComboFood() {
  const [comboFoods, setComboFoods] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formConfirm, setFormConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [totalPage, setTotalPage] = useState(1);

  const [comboFood, setComboFood] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
  });
  const [error, setError] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
  });

  const getAllComboFoods = async () => {
    setIsLoading(true);
    try {
      const response = await getAllComboFood(currentPage - 1);
      setComboFoods(response.comboFoods);
      setTotalPage(response.totalPage);
    } catch (error) {
      message.error("Failed to fetch combo foods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllComboFoods();
  }, [currentPage]);

  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
    setComboFood({ name: "", description: "", image: "", price: "" });
    setError({ name: "", description: "", image: "", price: "" });
    setIsUpdate(false);
    setIdUpdate(null);
    setFile(null);
    setPreview(null);
  };

  const checkFormData = () => {
    let checkForm = true;
    if (!comboFood.name) {
      setError((prev) => ({
        ...prev,
        name: "Combo food name cannot be blank",
      }));
      checkForm = false;
    }
    if (!comboFood.description) {
      setError((prev) => ({
        ...prev,
        description: "Description cannot be blank",
      }));
      checkForm = false;
    }
    if (!comboFood.image) {
      setError((prev) => ({ ...prev, image: "Image cannot be blank" }));
      checkForm = false;
    }
    if (!comboFood.price) {
      setError((prev) => ({ ...prev, price: "Price cannot be blank" }));
      checkForm = false;
    }
    return checkForm;
  };

  const checkFormValid = (e) => {
    const { name, value } = e.target;
    const newComboFood = { ...comboFood, [name]: value };
    setComboFood(newComboFood);
    if (!value) {
      setError((prev) => ({ ...prev, [name]: `${name} cannot be blank` }));
    } else {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[0].originFileObj);
      setComboFood((prev) => ({ ...prev, image: "image" }));
      setPreview(URL.createObjectURL(info.fileList[0].originFileObj));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select file image");
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
      setPreview(null); // Dọn dẹp preview nếu tải lên thành công
      return secureUrl;
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = checkFormData();

    if (!isFormValid) {
      message.error("Form validation failed");
      return;
    }

    const food = {
      name: comboFood.name.trim(),
      description: comboFood.description,
      image: comboFood.image,
      price: comboFood.price,
    };

    try {
      let response;
      if (isUpdate) {
        const response = await updateFood(idUpdate, food);
        if (file !== null) {
          const urlImage = await handleUpload(file);
          const newFood = { ...response, image: urlImage };
          await updateImage(newFood);
        }
        message.success("Update combo food success");
      } else {
        response = await createFood(food);
        if (response !== null && file !== null) {
          const urlImage = await handleUpload(file);
          const newFood = { ...response, image: urlImage };
          await updateImage(newFood);
          message.success("Create combo food successfully");
        }
      }

      handleCloseForm();
      getAllComboFoods();
    } catch (err) {
      message.error("Error processing request");
    }
  };

  const handleOpenConfirm = (id) => {
    setIdDelete(id);
    setFormConfirm(true);
  };

  const handelOpenFormUpdate = (comboFood) => {
    setIsUpdate(true);
    setComboFood({
      name: comboFood.name,
      description: comboFood.description,
      image: comboFood.image,
      price: comboFood.price,
    });
    setPreview(comboFood.image);
    setIsShowForm(true);
    setIdUpdate(comboFood.id);
  };

  const handleDeleteFood = async () => {
    try {
      await deleteFood(idDelete);
      message.success("Delete combo food successfully");
      setComboFoods((prev) => prev.filter((f) => f.id !== idDelete));
    } catch (error) {
      message.error("Delete combo food error");
    }
    setFormConfirm(false);
    setIdDelete(null);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
    },
    {
      title: "Combo Food Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt={text} style={{ width: 50 }} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
      <h1 className="text-[32px] pb-6 font-medium">Combo Food Management</h1>
      {isLoading && <LoadingOutlined />}

      <div>
        <div className="flex justify-end pb-4">
          <Button
            type="primary"
            className="w-[200px] h-[40px] text-lg"
            onClick={handleOpenForm}
          >
            Create Combo Food
          </Button>
        </div>

        <Table
          dataSource={comboFoods?.map((food) => ({ ...food, key: food.id }))}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: totalPage * 5,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>

      <Modal
        title="Confirm Delete"
        open={formConfirm}
        onOk={handleDeleteFood}
        onCancel={() => setFormConfirm(false)}
      >
        <p>Do you want to delete this combo?</p>
      </Modal>

      <Modal
        title={isUpdate ? "Update Combo" : "Create Combo"}
        open={isShowForm}
        footer={null}
        onCancel={handleCloseForm}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label>Combo Food Name:</label>
            <Input
              value={comboFood.name}
              name="name"
              onChange={checkFormValid}
            />
            {error.name && <p className="text-red-600">{error.name}</p>}
          </div>

          <div>
            <label>Description:</label>
            <Input
              value={comboFood.description}
              name="description"
              onChange={checkFormValid}
            />
            {error.description && (
              <p className="text-red-600">{error.description}</p>
            )}
          </div>

          <div>
            <label>Image:</label>
            <Upload onChange={handleFileChange} accept="image/*" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ width: 100, marginTop: 10 }}
              />
            )}

            {error.image && <p className="text-red-600">{error.image}</p>}
          </div>

          <div>
            <label>Price:</label>
            <Input
              value={comboFood.price}
              type="number"
              name="price"
              onChange={checkFormValid}
            />
            {error.price && <p className="text-red-600">{error.price}</p>}
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
  );
}
