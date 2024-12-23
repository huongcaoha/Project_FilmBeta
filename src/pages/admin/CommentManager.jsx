import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Pagination, Table } from "antd";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  fetchAllComments,
  replyComment,
  updateStatusComment,
} from "../../services/adminComment";

export default function CommentManager() {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [idComment, setIdComment] = useState(null);
  const [isShowModalUpdateStatus, setIsShowModalUpdateStatus] = useState(false);

  const getAllComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllComments(pageSize, currentPage);
      setListComment(response.content);
      setTotalElements(response.totalElements);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getAllComments();
  }, [pageSize, currentPage]);

  const handleChangePage = (page) => {
    setCurrentPage(page - 1);
  };

  //Đại diện cho dữ liệu
  const dataSource = listComment
    ? listComment.map((comment, index) => {
        return {
          id: comment.id,
          key: comment.id,
          index: index + 1,
          comment: comment.comment,
          userName: comment.user?.username || "", // Kiểm tra null/undefined
          movieName: comment.movie?.movieName || "", // Kiểm tra null
          parent_id: comment.parentComment?.id,
          parentComment: comment.parentComment
            ? `${comment.parentComment.user?.username || ""} - ${
                comment.parentComment.movie?.movieName || ""
              }`
            : "", // Xử lý nếu không có parentComment
          status: comment.status,
        };
      })
    : [];

  //Đại diện các hàng ở trên bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Movie Name",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Reply To User/Movie",
      dataIndex: "parentComment",
      key: "parentComment",
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
      render: (_, record) => {
        // Nếu movieName trống, hiển thị nút actions
        if (!record.parent_id) {
          return (
            <div className="flex gap-4">
              {record.status ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => handleUnblock(record.id)}
                >
                  Block
                </Button>
              ) : (
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => handleBlock(record.id)}
                >
                  UnBlock
                </Button>
              )}
              <Button
                className="bg-green-500 text-white"
                onClick={() => handleReply(record.id)}
              >
                Reply
              </Button>
            </div>
          );
        }

        // Nếu không có điều kiện trên, không làm gì cả (hoặc trả về null)
        return null;
      },
    },
  ];

  //Thay đổi trạng thái comment
  const handleBlock = (id) => {
    setIdComment(id);
    setIsShowModalUpdateStatus(true);
  };

  const handleUnblock = (id) => {
    setIdComment(id);
    setIsShowModalUpdateStatus(true);
  };

  // Tìm comment theo ID
  const selectedComment = listComment.find((com) => com.id === idComment);

  const handleConfirmUpdateStatus = async () => {
    try {
      await updateStatusComment(idComment);
      message.success("Cập nhật trạng thái thành công.");

      // Cập nhật lại trạng thái của comment trong danh sách
      const updatedListComment = listComment.map((comment) => {
        if (comment.id === idComment) {
          // Thay đổi trạng thái của comment đã được chọn
          return {
            ...comment,
            status: !comment.status, // Đảo trạng thái (nếu cần)
          };
        }
        return comment;
      });

      // Cập nhật lại danh sách comment sau khi thay đổi trạng thái
      setListComment(updatedListComment);
      setIsShowModalUpdateStatus(false);
      setCurrentPage(0);
    } catch (error) {}
  };

  const handleCancelUpdateStatus = () => {
    setIsShowModalUpdateStatus(false);
  };

  //Trả lời Comment
  const handleReply = (id) => {
    setIdComment(id);

    setIsShowModal(true);
  };

  const onFinish = async (values) => {
    try {
      const response = await replyComment(values, idComment);
      console.log(response);

      if (response.status === 201) {
        message.success("Trả lời comment thành công.");
        setIsShowModal(false);
        // Reset form
        form.resetFields();
        await getAllComments();
      } else {
        message.error("Trả lời comment thất bại.");
      }
    } catch (error) {}
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
    // Reset form
    form.resetFields();
  };

  return (
    <div>
      {/* Modal xác nhận block hoặc unblock */}
      <Modal
        title="Xác nhận"
        open={isShowModalUpdateStatus}
        onOk={handleConfirmUpdateStatus}
        onCancel={handleCancelUpdateStatus}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        {
          // Kiểm tra sự tồn tại của selectedComment trước khi truy cập status
          selectedComment
            ? selectedComment.status
              ? "Bạn có chắc chắn muốn chặn comment này?"
              : "Bạn có chắc chắn muốn bỏ chặn comment này?"
            : "Không tìm thấy comment."
        }
      </Modal>

      {/* Modal reply comment */}
      <Modal
        title={
          <div className="flex justify-between mb-4">
            <p className="text-[32px] pb-6 font-medium">Reply Comment</p>
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
            label="Reply Content"
            name="replyComment"
            rules={[
              {
                required: true,
                message: "Reply Content is required!",
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
                Reply
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <main>
        <h3 className="mb-4">Comment Manager</h3>
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
