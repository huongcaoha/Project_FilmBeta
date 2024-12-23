import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Upload } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

import axios from "axios";
import {
  createGift,
  deleteGiftById,
  findAllGift,
  updateGift,
  uploadImageGift,
} from "../../services/giftService";

export default function AdminGift() {
  const [gifts, setGifts] = useState([]);
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

  const [gift, setGift] = useState({
    giftName: "",
    description: "",
    image: "",
    expiredDate: "",
  });
  const [error, setError] = useState({
    giftName: "",
    description: "",
    image: "",
    expiredDate: "",
  });

  const fetchAllGifts = async () => {
    setIsLoading(true);
    try {
      const response = await findAllGift(currentPage - 1);
      setGifts(response.gifts);
      setTotalPage(response.totalPage);
    } catch (error) {
      message.error("Failed to fetch gifts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGifts();
  }, [currentPage]);

  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
    setGift({
      giftName: "",
      description: "",
      image: "",
      expiredDate: "",
    });
    setError({
      giftName: "",
      description: "",
      image: "",
      expiredDate: "",
    });
    setIsUpdate(false);
    setIdUpdate(null);
    setFile(null);
    setPreview(null);
  };

  const checkFormData = () => {
    let checkForm = true;
    if (!gift.giftName) {
      setError((prev) => ({
        ...prev,
        giftName: "Gift name cannot be blank",
      }));
      checkForm = false;
    }
    if (!gift.description) {
      setError((prev) => ({
        ...prev,
        description: "Description cannot be blank",
      }));
      checkForm = false;
    }
    if (!gift.image) {
      setError((prev) => ({ ...prev, image: "Image cannot be blank" }));
      checkForm = false;
    }
    if (!gift.expiredDate) {
      setError((prev) => ({
        ...prev,
        expiredDate: "ExpiredDate cannot be blank",
      }));
      checkForm = false;
    }
    return checkForm;
  };

  const checkFormValid = (e) => {
    const { name, value } = e.target;
    const newGift = { ...gift, [name]: value };
    setGift(newGift);
    if (!value) {
      setError((prev) => ({ ...prev, [name]: `${name} cannot be blank` }));
    } else {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[0].originFileObj);
      setGift((prev) => ({ ...prev, image: "image" }));
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

    const newGift = {
      giftName: gift.giftName.trim(),
      description: gift.description,
      image: gift.image,
      expiredDate: gift.expiredDate,
    };

    try {
      let response;
      if (isUpdate) {
        response = await updateGift(idUpdate, newGift);
        if (file !== null) {
          const urlImage = await handleUpload();
          const giftNew = { ...response, image: urlImage };
          await uploadImageGift(giftNew);
        }
        message.success("Update gift successfully");
      } else {
        response = await createGift(newGift);
        if (response !== null && file !== null) {
          const urlImage = await handleUpload();
          const giftNew = { ...response, image: urlImage };
          await uploadImageGift(giftNew);
          message.success("Create gift successfully");
        }
      }

      handleCloseForm();
      fetchAllGifts();
    } catch (err) {
      console.error("Error processing request:", err);
      message.error(err.response?.data?.message || "Error processing request");
    }
  };

  const handleOpenConfirm = (id) => {
    setIdDelete(id);
    setFormConfirm(true);
  };

  const handelOpenFormUpdate = (gift) => {
    setIsUpdate(true);
    setGift({
      giftName: gift.giftName,
      description: gift.description,
      image: gift.image,
      expiredDate: gift.expiredDate,
    });
    setPreview(gift.image);
    setIsShowForm(true);
    setIdUpdate(gift.id);
  };

  const handleDeleteGift = async () => {
    try {
      await deleteGiftById(idDelete);
      message.success("Delete gift successfully");
      setGifts((prev) => prev.filter((g) => g.id !== idDelete));
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
      title: "Gift Name",
      dataIndex: "giftName",
      key: "giftName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt={text} style={{ width: 70, height: 70 }} />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ExpiredDate",
      dataIndex: "expiredDate",
      key: "expiredDate",
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
      <h1 className="text-[32px] pb-6 font-medium">Gift Management</h1>
      {isLoading && <LoadingOutlined />}

      <div>
        <div className="flex justify-end pb-4">
          <Button
            type="primary"
            className="w-[200px] h-[40px] text-lg"
            onClick={handleOpenForm}
          >
            Create Gift
          </Button>
        </div>

        <Table
          dataSource={gifts?.map((gift) => ({ ...gift, key: gift.id }))}
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
        onOk={handleDeleteGift}
        onCancel={() => setFormConfirm(false)}
      >
        <p>Do you want to delete this gift ?</p>
      </Modal>

      <Modal
        title={isUpdate ? "Update Gift" : "Create Gift"}
        open={isShowForm}
        footer={null}
        onCancel={handleCloseForm}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label>Gift Name:</label>
            <Input
              value={gift.giftName}
              name="giftName"
              onChange={checkFormValid}
            />
            {error.giftName && <p className="text-red-600">{error.giftName}</p>}
          </div>

          <div>
            <label>Description:</label>
            <Input
              value={gift.description}
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
            <label>ExpiredDate :</label>
            <Input
              htmlType="date"
              value={gift.expiredDate}
              type="date"
              name="expiredDate"
              onChange={checkFormValid}
            />
            {error.expiredDate && (
              <p className="text-red-600">{error.expiredDate}</p>
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
  );
}
