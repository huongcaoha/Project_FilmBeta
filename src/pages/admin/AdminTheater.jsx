import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message } from "antd";
import { RedoOutlined } from "@ant-design/icons";

import { createTheater, fetchAllTheater } from "../../services/theaterService";

export default function AdminTheater() {
  const [theaters, setTheaters] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [error, setError] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    numberOfScreens: "",
  });

  const fetchTheater = async () => {
    try {
      const response = await fetchAllTheater();
      setTheaters(response.data.theaters.map((t, index) => ({ ...t, index })));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTheater();
  }, []);

  const handleAction = (key) => {
    console.log("Action clicked for:", key);
  };

  const handleOnsubmit = (e) => {
    e.preventDefault();
  };

  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
    setError({
      name: "",
      address: "",
      phoneNumber: "",
      numberOfScreens: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let checkForm = true;
    if (!e.target.name.value) {
      setError((pre) => {
        return { ...pre, name: "Theater name can not blank" };
      });
      checkForm = false;
    }

    if (!e.target.address.value) {
      setError((pre) => {
        return { ...pre, address: "Address can not blank" };
      });
      checkForm = false;
    }

    if (!e.target.phoneNumber.value) {
      setError((pre) => {
        return { ...pre, phoneNumber: "Phone number can not blank" };
      });
      checkForm = false;
    }
    const pattern = /^0(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])[0-9]{7}$/;
    if (!pattern.test(e.target.phoneNumber.value)) {
      setError((pre) => {
        return { ...pre, phoneNumber: "Phone number invalid" };
      });
      checkForm = false;
    }

    if (!e.target.numberOfScreens.value) {
      setError((pre) => {
        return { ...pre, numberOfScreens: "Number screen can not blank" };
      });
      checkForm = false;
    }

    if (!checkForm) {
      message.error("Create error");
    } else {
      const theater = {
        name: e.target.name.value,
        address: e.target.address.value,
        phoneNumber: e.target.phoneNumber.value,
        numberOfScreens: e.target.numberOfScreens.value,
      };
      try {
        const response = await createTheater(theater);
        if (response) {
          message.success("create theater success");
          setIsShowForm(false);
          fetchTheater();
        } else {
          message.error("theater name existed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1, // Lấy chỉ số và cộng thêm 1
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
          <Button type="primary" onClick={() => handleAction(record.key)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleAction(record.key)}
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
            onSubmit={handleOnsubmit}
          >
            <Input
              className="w-[300px] "
              placeholder="Search theater name"
            ></Input>
            <Button htmlType="submit">
              <RedoOutlined />
            </Button>
          </form>
        </div>

        <Table dataSource={theaters} columns={columns} />
      </div>

      <div>
        <Modal
          title="Create Theater"
          open={isShowForm}
          footer={null}
          onCancel={() => handleCloseForm()}
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label>Theater Name :</label>
              <Input name="name"></Input>
              {error.name ? (
                <p className="text-red-600">{error.name}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Address :</label>
              <Input name="address"></Input>
              {error.address ? (
                <p className="text-red-600">{error.address}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Phone Number :</label>
              <Input name="phoneNumber"></Input>
              {error.phoneNumber ? (
                <p className="text-red-600">{error.phoneNumber}</p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <label>Number Of Screens :</label>
              <Input type="number" name="numberOfScreens"></Input>
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
                Create
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
