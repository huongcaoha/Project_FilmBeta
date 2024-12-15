import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Select } from "antd";
import { LoadingOutlined, RedoOutlined } from "@ant-design/icons";

import {
  createTheater,
  deleteTheater,
  fetchAllTheater,
  getCity,
  updateTheater,
} from "../../services/theaterService";
import { useDebounce } from "../../hooks/useDebounce";

export default function AdminTheater() {
  const [theaters, setTheaters] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [citis, setCitis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [formConfirm, setFormConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [search, setSearch] = useState("");
  const [theater, setTheater] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    numberOfScreens: "",
  });
  const [error, setError] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    numberOfScreens: "",
  });

  const fetchTheater = async () => {
    try {
      let response = null;
      if (search) {
        response = await fetchAllTheater(currentPage - 1, 5, search);
      } else {
        response = await fetchAllTheater(currentPage - 1);
      }
      setTheaters(response.data.theaters.map((t, index) => ({ ...t, index })));
      setTotalPage(response.data.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  const useDebounceSearch = useDebounce(search, 300);

  const getAllCity = async () => {
    try {
      const citis = await getCity();
      setCitis(citis);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTheater();
    getAllCity();
  }, [currentPage, useDebounceSearch]);

  const handleOnsubmitSearch = (e) => {
    e.preventDefault();
    fetchTheater(search);
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
      name: "",
      address: "",
      phoneNumber: "",
      numberOfScreens: "",
    });
    setTheater({
      name: "",
      address: "",
      phoneNumber: "",
      numberOfScreens: "",
    });
    setIsUpdate(false);
    setIdUpdate(null);
  };

  const checkFormData = (e) => {
    let checkForm = true;
    if (!theater.name) {
      setError((pre) => {
        return { ...pre, name: "Theater name can not blank" };
      });
      checkForm = false;
    }

    if (!theater.address) {
      setError((pre) => {
        return { ...pre, address: "Address can not blank" };
      });
      checkForm = false;
    }

    if (!theater.phoneNumber) {
      setError((pre) => {
        return { ...pre, phoneNumber: "Phone number can not blank" };
      });
      checkForm = false;
    }

    const pattern = /^0(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])[0-9]{7}$/;
    if (!pattern.test(theater.phoneNumber)) {
      setError((pre) => {
        return { ...pre, phoneNumber: "Phone number invalid" };
      });
      checkForm = false;
    }

    if (!theater.numberOfScreens) {
      setError((pre) => {
        return { ...pre, numberOfScreens: "Number screen can not blank" };
      });
      checkForm = false;
    }
    return checkForm;
  };

  const checkFormValid = (e) => {
    const { name, value } = e.target;
    const newTheater = { ...theater, [name]: value };
    setTheater(newTheater);
    if (!value) {
      const newError = { ...error, [name]: name + " can not blank" };
      setError(newError);
    } else {
      const newError = { ...error, [name]: "" };
      setError(newError);
    }
  };

  const handelOpenFormUpdate = (theater) => {
    setIsUpdate(true);
    setTheater({
      name: theater.name,
      address: theater.address,
      phoneNumber: theater.phoneNumber,
      numberOfScreens: theater.numberOfScreens,
    });
    setIsShowForm(true);
    setIdUpdate(theater.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = checkFormData();

    if (!isFormValid) {
      message.error("Create error");
    } else {
      const theater = {
        name: e.target.name.value.trim(),
        address: e.target.address.value,
        phoneNumber: e.target.phoneNumber.value,
        numberOfScreens: e.target.numberOfScreens.value,
      };
      if (isUpdate) {
        try {
          const response = await updateTheater(theater, idUpdate);
          if (response) {
            message.success("Update theater success");
            handleCloseForm();
            fetchTheater();
          } else {
            message.error("theater name existed");
          }
        } catch (err) {
          setError({ ...error, name: "theater name existed" });
          message.error("Create error");
        }
      } else {
        try {
          const response = await createTheater(theater);
          if (response) {
            message.success("create theater success");
            handleCloseForm();
            fetchTheater();
          } else {
            message.error("theater name existed");
          }
        } catch (err) {
          setError({ ...error, name: err.response.data.message.name });
          message.error("Create error");
        }
      }
    }
  };

  const handleCloseConfirm = () => {
    setFormConfirm(false);
    setIdDelete(null);
  };

  const handleDeleteTheater = async () => {
    try {
      const response = await deleteTheater(idDelete);
      if (response != null) {
        message.success("Delete theater successfully");
        setTheaters((pre) => {
          return pre.filter((t) => t.id != idDelete);
        });
        setCurrentPage(1);
      }
    } catch (error) {
      message.error("Delete theater error");
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
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1, // Lấy chỉ số và cộng thêm 1
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Theater Name",
      dataIndex: "name",
      key: "theaterName",
    },
    {
      title: "Number Screen Room",
      dataIndex: "numberOfScreens",
      key: "numberScreenRoom",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
      <h1 className="text-4xl font-bold">Theater Management</h1>
      {isLoading ? <LoadingOutlined /> : <></>}

      <div className="px-[150px] py-[50px]">
        <div className="flex justify-end">
          <Button
            type="primary"
            className=" w-[150px] h-[40px] text-lg"
            onClick={handleOpenForm}
          >
            Create Theater
          </Button>
        </div>

        <div>
          <form
            className="flex gap-4 justify-end m-6"
            onSubmit={handleOnsubmitSearch}
          >
            <Input
              className="w-[300px] "
              placeholder="Search theater name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <Button htmlType="submit">
              <RedoOutlined />
            </Button>
          </form>
        </div>

        <Table
          dataSource={theaters}
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
          onOk={handleDeleteTheater}
          onCancel={handleCloseConfirm}
        >
          <p>Do you want delete this theater ?</p>
        </Modal>
      </div>

      <div>
        <Modal
          title={isUpdate ? "Update Theater" : "Create Theater"}
          open={isShowForm}
          footer={null}
          onCancel={() => handleCloseForm()}
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label>Theater Name :</label>
              <Input
                value={theater.name}
                name="name"
                onChange={checkFormValid}
              ></Input>
              {error.name ? (
                <p className="text-red-600">{error.name}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label className="mr-5">Address :</label>
              <select
                value={theater.address}
                name="address"
                onChange={checkFormValid}
              >
                <option value={""}>Select address</option>
                {citis?.map((city) => (
                  <option key={city.id} value={city.cityName}>
                    {city.cityName}
                  </option>
                ))}
              </select>

              {error.address ? (
                <p className="text-red-600">{error.address}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Phone Number :</label>
              <Input
                value={theater.phoneNumber}
                name="phoneNumber"
                onChange={checkFormValid}
              ></Input>
              {error.phoneNumber ? (
                <p className="text-red-600">{error.phoneNumber}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Number Of Screens :</label>
              <Input
                value={theater.numberOfScreens}
                type="number"
                name="numberOfScreens"
                onChange={checkFormValid}
              ></Input>
              {error.numberOfScreens ? (
                <p className="text-red-600">{error.numberOfScreens}</p>
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
