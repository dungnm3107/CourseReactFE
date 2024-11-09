import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import axiosInstance from "../../config/axios";
import { useAuth } from "../../service/AuthContext";
import "../../assets/css/checkout.css";

interface Order {
  id: number;
  courseId: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
}

interface Course {
  id: number;
  title: string;
  coursePrice: number;
  description: string;
}

export default function Checkout() {
  const orderId = localStorage.getItem("orderId");
  console.log("Order ID from URL nmd:", orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const { userId, name, email } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/api/v1/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(response.data);

        const courseId = response.data.courseId;
        const courseResponse = await axiosInstance.get(
          `/api/v1/course/get/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourse(courseResponse.data.result);
      } catch (error) {
        console.error("Error fetching order or course:", error);
        setError("Unable to fetch order or course details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handlePayment = async () => {
    if (order) {
      try {
        // Construct the query parameters
        const params = new URLSearchParams({
          orderId: `${order.id}`,
          description: `Thanh toan khoa hoc ${course?.title}`,
          amount: `${order.totalPrice}`,
          bankCode: "NCB",
        }).toString();

        // Send GET request with query parameters
        const response = await axiosInstance.get(
          `/api/v1/payment/vn-pay?${params}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Data URL:", response.data);
        if (response.data.code === 200 && response.data.data) {
          const paymentUrl = response.data.data.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            console.error("Payment URL is not defined.");
            setError("Could not retrieve payment URL.");
          }
        } else {
          console.error(
            "Failed to create payment order:",
            response.data.message
          );
          setError("Could not create payment order.");
        }
      } catch (error) {
        console.error("Error creating payment order:", error);
        setError("Could not create payment order.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="checkout-container">
      <h2>THANH TOÁN</h2>
      <div className="checkout-details">
        <div className="course-details">
          <h3>Thông tin khóa học</h3>
          <p>Tên khóa học: {course?.title}</p>
          <p>Giá: {course?.coursePrice} VND</p>
          <p>Mô tả: {course?.description}</p>
        </div>
        <div className="user-details">
          <h3>Thông tin người mua</h3>
          <p>Họ và tên: {name}</p>
          <p>Email: {email}</p>
        </div>
        <div className="order-summary">
          <h3>Thông tin hóa đơn</h3>
          <p>Order ID: {order?.id}</p>
          <p>Tổng tiền: {order?.totalPrice} VND</p>
        </div>
        <button className="btn btn-primary" onClick={handlePayment}>
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
}
