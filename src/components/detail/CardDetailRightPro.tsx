import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../service/AuthContext"; // Use hook to get user info
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryFull, faFilm } from "@fortawesome/free-solid-svg-icons";
import CardMedia from "@mui/material/CardMedia";
import { Modal, Box } from "@mui/material";

interface CardDetailRightProps {
  totalLessons: number;
  courseId: number;
  coursePrice: number;
  videoUrl: string;
  onOpenLoginModal: () => void;
}

export default function CardDetailRightPro({
  totalLessons,
  courseId,
  coursePrice,
  videoUrl,
  onOpenLoginModal,
}: CardDetailRightProps ) {
  console.log("Course Price in CardDetailRightPro:", coursePrice); // Kiểm tra giá trị coursePrice

  const navigate = useNavigate();
  const { userId, isLoggedIn } = useAuth();
  const [openVideoModal, setOpenVideoModal] = useState(false); // Trạng thái modal video
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null); // URL video để xem trước

  const handleVideoClick = () => {
    setPreviewVideoUrl(videoUrl); // Cập nhật URL video
    setOpenVideoModal(true); // Mở modal
  };

  const handleCloseModal = () => {
    setOpenVideoModal(false); // Đóng modal
    setPreviewVideoUrl(null); // Reset URL video
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      onOpenLoginModal(); // Open login modal if not logged in
      return;
    }
    try {
      const orderData = {
        userId: userId,
        courseId: courseId,
        totalPrice: coursePrice,
      };
      console.log("Order data:", orderData);

      const response = await axiosInstance.post("/api/v1/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const newOrder = response.data;
      const orderId = newOrder.id;
      console.log("Order ID:", orderId);

      localStorage.setItem("orderId", orderId.toString());
      navigate("/checkout");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-center mt-4">
        <div
          onClick={handleVideoClick}
          style={{
            cursor: "pointer",
            width: "100%",
            maxHeight: "300px",
            overflow: "hidden", // Ẩn phần video vượt quá khung
            borderRadius: "15px",
            position: "relative",
          }}
        >
          <CardMedia
            component="video"
            controls
            src={videoUrl}
            style={{
              width: "100%",
              height: "100%", // Đặt chiều cao 100% để video chiếm toàn bộ khung
              objectFit: "cover", // Đảm bảo video không bị biến dạng
            }}
          />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center mt-2">
        <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
          Xem giới thiệu khóa học
        </p>
      </div>
      <div className="col-12 d-flex justify-content-center mt-4">
        <ul>
          <li className="list-group-item">
            <FontAwesomeIcon icon={faFilm} />
            <span className="mx-2">
              Tổng Số <strong>{totalLessons}</strong> Bài học
            </span>
          </li>
          <li className="list-group-item">
            <FontAwesomeIcon icon={faBatteryFull} />
            <span className="mx-2">Học mọi lúc mọi nơi</span>
          </li>
          <li className="list-group-item">
            <strong>Giá:</strong> {coursePrice} VND
          </li>
        </ul>
      </div>
      <div className="col-12 d-flex justify-content-center mx-3 mt-2">
        <button
          onClick={handleBuyNow}
          style={{
            color: "white",
            backgroundColor: "#3366cc",
            borderRadius: "20px",
            width: "180px",
            height: "40px",
            fontSize: "15px",
          }}
          className="btn fw-bold mx-3"
        >
          MUA NGAY
        </button>
      </div>
       {/* Modal xem video */}
       <Modal open={openVideoModal} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 4,
            maxWidth: 1500,
            width: 1200,
            height: 700,
            margin: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0", // Màu nền tổng thể của khung ngoài video
            marginTop: "2%",
          }}
        >
          {previewVideoUrl ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#e0e0e0", // Màu xám cho phần ngoài khung video
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <video
                src={previewVideoUrl}
                controls
                preload="metadata"
                style={{
                  width: "90%", // Giảm kích thước video để tạo phần viền bao quanh
                  height: "90%",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Bóng đổ cho video để làm nổi bật
                }}
              />
            </div>
          ) : (
            <p>Không thể tải video</p>
          )}
        </Box>
      </Modal>
    </div>
  );
}
