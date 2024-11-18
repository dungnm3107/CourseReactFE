import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import "../../assets/css/dashboard.css";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Hls from "hls.js";
interface Lesson {
  id: number;
  idChapter: number;
  title: string;
  lessonSequence: number;
  content: string;
  videoUrl: string;
}


const Dashboard: React.FC = () => {
  const { avatar, role } = useAuth();
  const [userCount, setUserCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [courseStatistics, setCourseStatistics] = useState<{
    totalCourses: number;
    totalChapters: number;
    totalLessons: number;
  }>({
    totalCourses: 0,
    totalChapters: 0,
    totalLessons: 0,
  });
  const [favoriteLessons, setFavoriteLessons] = useState<Lesson[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<Date | null>(
    new Date(2024, 0, 1)
  );
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [accessUser, setAccessUser] = useState<number[]>([]);

  const [hlsInstances, setHlsInstances] = useState<Map<number, Hls>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement | null>>(new Map());

   // Sử dụng HLS để phát video từ URL có chữ ký
   useEffect(() => {
    favoriteLessons.forEach((favoriteLesson) => {
      const videoRef = videoRefs.current.get(favoriteLesson.id);
      if (videoRef && Hls.isSupported()) {
        const hls = new Hls();
        const fetchSignedUrl = async () => {
          try {
            const signedUrlResponse = await axiosInstance.get(
              `/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(
                favoriteLesson.videoUrl
              )}`
            );
            const signedUrl = signedUrlResponse.data;
            hls.loadSource(signedUrl);
            hls.attachMedia(videoRef);
          } catch (error) {
            console.error("Error fetching signed video URL:", error);
          }
        };
        fetchSignedUrl();
        setHlsInstances((prev) => new Map(prev.set(favoriteLesson.id, hls)));
      }
    });

    // Cleanup HLS instances
    return () => {
      hlsInstances.forEach((hls) => hls.destroy());
    };
  }, [favoriteLessons]);
  

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/user/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserCount(response.data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchCourseStatistics = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/course/statistics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourseStatistics(response.data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    const fetchRegistrationStatistics = async () => {
      if (selectedYear) {
        const year = selectedYear.getFullYear();
        try {
          const response = await axiosInstance.get(
            `/api/v1/user/registration-statistics?year=${year}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = response.data;

          // Prepare data for all 12 months, setting to 0 if no data
          const months = Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(0, i).toLocaleString("default", {
              month: "long",
            });
            const monthData = data.find((item: any) => item.month === i + 1);
            return {
              month: monthName,
              registrations: monthData ? monthData.totalUsers : 0,
            };
          });

          setRegistrationData(months);
        } catch (error) {
          console.error("Error fetching registration statistics:", error);
        }
      }
    };

    const fetchRevenueStatistics = async () => {
      if (selectedYear) {
        const year = selectedYear.getFullYear();
        try {
          const response = await axiosInstance.get(
            `/api/v1/orders/revenue?year=${year}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = response.data;

          const months = Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(0, i).toLocaleString("default", {
              month: "long",
            });
            const monthData = data.find((item: any) => item.month === i + 1);
            return {
              month: monthName,
              revenue: monthData ? monthData.totalRevenue : 0,
            };
          });

          setRevenueData(months);
        } catch (error) {
          console.error("Error fetching revenue statistics:", error);
        }
      }
    };

    const fetchFavoriteLessons = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/favorite-lessons/top4",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavoriteLessons(response.data);
      } catch (error) {
        console.error("Error fetching favorite lessons:", error);
      }
    };
    const fetchTotalRevenue = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/orders/total-revenue",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTotalRevenue(response.data);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    const fetchAccessUser = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/google-analytics/user-access",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAccessUser(response.data);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchUserCount();
    fetchCourseStatistics();
    fetchRegistrationStatistics();
    fetchRevenueStatistics();
    fetchFavoriteLessons();
    fetchTotalRevenue();
    fetchAccessUser();
  }, [selectedYear]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <AdminLayout avatar={avatar} role={role}>
      <div className="db-container-content">
        <div className="content">
          <h1>TRANG QUẢN TRỊ</h1>

          {/* Additional dashboard content can go here */}
          <div className="dashboard-cards">
            <div className="admin-card" style={{ backgroundColor: "#4CAF50" }}>
              <h2>Số lượng truy cập</h2>
              <p>{accessUser} lượt</p>
            </div>
            <div className="admin-card" style={{ backgroundColor: "#2196F3" }}>
              <h2>Số lượng người dùng</h2>
              <p>{userCount} users</p>
            </div>
            <div className="admin-card" style={{ backgroundColor: "#FF9800" }}>
              <h2>Số lượng khóa học</h2>
              <p>{courseStatistics.totalCourses} khóa học</p>
              <p>
                Gồm {courseStatistics.totalChapters} chương và{" "}
                {courseStatistics.totalLessons} bài học
              </p>
            </div>
            <div className="admin-card" style={{ backgroundColor: "#F44336" }}>
              <h2>Doanh thu</h2>

              <p>{formatCurrency(totalRevenue)} VND</p>
            </div>
          </div>

          <div className="chart-container">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedYear}
                onChange={(date) => setSelectedYear(date)}
                showYearPicker
                dateFormat="yyyy"
                placeholderText="Chọn năm"
              />
            </div>

            <h2>Số lượng users đăng ký hàng tháng</h2>
            <br />
            <LineChart width={1300} height={380} data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 20]} />
              <Tooltip formatter={(value) => [`Đăng ký: ${value} người`, ""]} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#8884d8" }}>Đăng ký</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#8884d8"
                connectNulls
              />
            </LineChart>
          </div>
          <div className="chart-container">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedYear}
                onChange={(date) => setSelectedYear(date)}
                showYearPicker
                dateFormat="yyyy"
                placeholderText="Chọn năm"
              />
            </div>

            <h2>Doanh thu hàng tháng</h2>
            <br />

            <BarChart width={1300} height={380} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 500000]} style={{ marginLeft: 50 }} />
              <Tooltip formatter={(value) => [`Doanh thu: ${value} VND`, ""]} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#8884d8" }}>Doanh thu</span>
                )}
              />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="chart-container">
            <h2>Top 4 bài học yêu thích nhiều nhất</h2>
            <div className="favorite-lessons-grid">
              {favoriteLessons.map((favoriteLesson) => (
                <div key={favoriteLesson.id} className="favorite-lesson-card">
                  <video
                    controls
                    preload="metadata"
                    className="video-thumbnail"
                    ref={(el) => {
                      videoRefs.current.set(favoriteLesson.id, el);
                    }}
                    muted
                  />
                  <h3 className="video-title">{favoriteLesson.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
