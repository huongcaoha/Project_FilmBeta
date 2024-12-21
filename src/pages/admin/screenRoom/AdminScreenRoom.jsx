import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Select, Checkbox } from "antd";
import { LoadingOutlined, RedoOutlined } from "@ant-design/icons";
import {
  createScreenRoom,
  deleteScreenRoom,
  getAllScreenRoom,
  updateScreenRoom,
} from "../../../services/screenRoom";
import { fetchAllTheater } from "../../../services/theaterService";
import { useDebounce } from "../../../hooks/useDebounce";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveScreenRoom } from "../../../redux/slices/screenRoomData";
import { useCookies } from "react-cookie";

export default function AdminScreenRoom() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "adminShowRoomDetail",
  ]);
  const [screenRooms, setScreenRooms] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [formConfirm, setFormConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [search, setSearch] = useState("");
  const [theaters, setTheaters] = useState([]);
  const dispath = useDispatch();
  const [screenRoom, setScreenRoom] = useState({
    theaterId: "",
    screenName: "",
    numberColSeat: "",
    numberRowSeat: "",
    isDoubleSeat: true,
  });
  const [error, setError] = useState({
    theaterId: "",
    screenName: "",
    numberColSeat: "",
    numberRowSeat: "",
    isDoubleSeat: "",
  });

  const fetchTheater = async () => {
    try {
      let response = null;
      if (search) {
        response = await fetchAllTheater(currentPage - 1, 5, search);
      } else {
        response = await fetchAllTheater(currentPage - 1);
      }
      setTheaters(response.data.theaters);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchScreenRooms = async () => {
    try {
      let response = null;
      if (search) {
        response = await getAllScreenRoom(currentPage - 1, 5, search);
      } else {
        response = await getAllScreenRoom(currentPage - 1);
      }
      setScreenRooms(
        response.data.screenRooms.map((t, index) => ({ ...t, index }))
      );
      setTotalPage(response.data.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  const useDebounceSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchScreenRooms();
    fetchTheater();
  }, [currentPage, useDebounceSearch]);

  const handleOnsubmitSearch = (e) => {
    e.preventDefault();
    fetchScreenRooms(search);
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
      theaterId: "",
      screenName: "",
      numberColSeat: "",
      numberRowSeat: "",
      isDoubleSeat: "",
    });
    setScreenRoom({
      theaterId: "",
      screenName: "",
      numberColSeat: "",
      numberRowSeat: "",
      isDoubleSeat: true,
    });
    setIsUpdate(false);
    setIdUpdate(null);
  };

  const checkFormData = (e) => {
    let checkForm = true;
    if (!screenRoom.theaterId) {
      setError((pre) => {
        return { ...pre, theaterId: "Theater id can not blank" };
      });
      checkForm = false;
    }

    if (!screenRoom.screenName) {
      setError((pre) => {
        return { ...pre, screenName: "ScreenName can not blank" };
      });
      checkForm = false;
    }

    if (!screenRoom.numberColSeat) {
      setError((pre) => {
        return { ...pre, numberColSeat: "Number col seat can not blank" };
      });
      checkForm = false;
    } else if (screenRoom.numberColSeat % 2 !== 0) {
      setError((pre) => {
        return {
          ...pre,
          numberColSeat: "Number col seat must be an even number",
        };
      });
      checkForm = false;
    }

    if (!screenRoom.numberRowSeat) {
      setError((pre) => {
        return { ...pre, numberRowSeat: "Number row seat can not blank" };
      });
      checkForm = false;
    }

    if (!screenRoom.isDoubleSeat) {
      setError((pre) => {
        return { ...pre, isDoubleSeat: "Double seat can not blank" };
      });
      checkForm = false;
    }

    return checkForm;
  };

  const checkFormValid = (e) => {
    const { name, value } = e.target;
    const newScreenRoom = { ...screenRoom, [name]: value };
    setScreenRoom(newScreenRoom);
    if (!value) {
      const newError = { ...error, [name]: name + " can not blank" };
      setError(newError);
    } else {
      const newError = { ...error, [name]: "" };
      setError(newError);
    }
  };

  const handelOpenFormUpdate = (screenRoom) => {
    setIsUpdate(true);
    setScreenRoom({
      theaterId: screenRoom.theater.id,
      screenName: screenRoom.screenName,
      numberColSeat: screenRoom.numberColSeat,
      numberRowSeat: screenRoom.numberRowSeat,
      isDoubleSeat: screenRoom.doubleSeat,
    });
    setIsShowForm(true);
    setIdUpdate(screenRoom.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = checkFormData();

    if (!isFormValid) {
      message.error("Create error");
    } else {
      const newScreenRoom = {
        theaterId: screenRoom.theaterId,
        screenName: screenRoom.screenName,
        numberColSeat: screenRoom.numberColSeat,
        numberRowSeat: screenRoom.numberRowSeat,
        isDoubleSeat: screenRoom.isDoubleSeat,
      };
      if (isUpdate) {
        try {
          const response = await updateScreenRoom(newScreenRoom, idUpdate);

          message.success("Update screen room success");
          handleCloseForm();
          fetchScreenRooms();
        } catch (err) {
          setError({
            ...error,
            screenName: "Screen room name existed or is being used",
          });
          message.error("Create error");
        }
      } else {
        try {
          const response = await createScreenRoom(newScreenRoom);

          message.success("Create screen room success");
          handleCloseForm();
          fetchScreenRooms();
        } catch (err) {
          setError({ ...error, screenName: "Screen room name existed" });
          console.log(err);
          message.error("Create error");
        }
      }
    }
  };

  const handleCloseConfirm = () => {
    setFormConfirm(false);
    setIdDelete(null);
  };

  const handleViewDetail = (screenRoom) => {
    setCookie("adminShowRoomDetail", screenRoom, { path: "/" });
  };

  const handleDeleteScreen = async () => {
    try {
      const response = await deleteScreenRoom(idDelete);
      if (response != null) {
        message.success("Delete screen room successfully");
        setScreenRooms((pre) => {
          return pre.filter((s) => s.id != idDelete);
        });
        setCurrentPage(1);
      }
    } catch (error) {
      message.error("Cannot delete , because this theater is already in use");
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
      title: "Theater Name",
      key: "name",
      render: (_, record) => record.theater.name,
    },
    {
      title: "Screen Name",
      dataIndex: "screenName",
      key: "screenName",
    },

    {
      title: "Number Col Seat",
      dataIndex: "numberColSeat",
      key: "numberColSeat",
    },

    {
      title: "Number Row Seat",
      dataIndex: "numberRowSeat",
      key: "numberRowSeat",
    },
    {
      title: "Double Seat",
      key: "doubleSeat",
      render: (_, record) => (record.doubleSeat ? "Yes" : "No"),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <Link to={"/admin/screenRoomDetail"}>
            <Button type="primary" onClick={() => handleViewDetail(record)}>
              Detail
            </Button>
          </Link>
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
      <h1 className="text-4xl font-bold">ScreenRoom Management</h1>
      {isLoading ? <LoadingOutlined /> : <></>}

      <div className="px-[150px] py-[50px]">
        <div className="flex justify-end">
          <Button
            type="primary"
            className=" w-[200px] h-[40px] text-lg"
            onClick={handleOpenForm}
          >
            Create ScreenRoom
          </Button>
        </div>

        <div>
          <form
            className="flex gap-4 justify-end m-6"
            onSubmit={handleOnsubmitSearch}
          >
            <Input
              className="w-[300px] "
              placeholder="Search screen room name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <Button htmlType="submit">
              <RedoOutlined />
            </Button>
          </form>
        </div>

        <Table
          dataSource={screenRooms}
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
          onOk={handleDeleteScreen}
          onCancel={handleCloseConfirm}
        >
          <p>Do you want delete this screen room ?</p>
        </Modal>
      </div>

      <div>
        <Modal
          title={isUpdate ? "Update ScreenRoom" : "Create ScreenRoom"}
          open={isShowForm}
          footer={null}
          onCancel={() => handleCloseForm()}
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mr-5">Theater :</label>
              <select
                value={screenRoom.theaterId}
                name="theaterId"
                onChange={checkFormValid}
              >
                <option value={""}>Select Theater</option>
                {theaters?.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>

              {error.theaterId ? (
                <p className="text-red-600">{error.theaterId}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Screen Name :</label>
              <Input
                value={screenRoom.screenName}
                name="screenName"
                onChange={checkFormValid}
              ></Input>
              {error.screenName ? (
                <p className="text-red-600">{error.screenName}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Number Col Seat :</label>
              <Input
                type="number"
                value={screenRoom.numberColSeat}
                name="numberColSeat"
                onChange={checkFormValid}
              ></Input>
              {error.numberColSeat ? (
                <p className="text-red-600">{error.numberColSeat}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Number Row Seat :</label>
              <Input
                type="number"
                value={screenRoom.numberRowSeat}
                name="numberRowSeat"
                onChange={checkFormValid}
              ></Input>
              {error.numberRowSeat ? (
                <p className="text-red-600">{error.numberRowSeat}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label className="mr-5">Double Seat :</label>
              <Checkbox
                name="isDoubleSeat"
                value={screenRoom.isDoubleSeat}
                checked={screenRoom.isDoubleSeat ? true : false}
                onChange={checkFormValid}
              >
                Yes
              </Checkbox>
              <Checkbox
                name="isDoubleSeat"
                value={screenRoom.isDoubleSeat}
                checked={!screenRoom.isDoubleSeat ? true : false}
                onChange={checkFormValid}
              >
                No
              </Checkbox>
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
