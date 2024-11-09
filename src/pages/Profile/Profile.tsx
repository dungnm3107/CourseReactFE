import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Avatar } from "@mui/material";
import "../../assets/css/profile.css";
import imgbg from "../../assets/images/profile.jpg";
import axiosInstance from "../../config/axios";
import { isToken } from "../../service/JwtService";
import { useAuth } from "../../service/AuthContext";
import { BASE_API_URL } from "../../constants/Constants";
interface WatchedCourse {
  id: number;
  title: string;
  description: string;
  cover: string;
}
const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    avatar: "",
    role: "",
  });
  const [watchedCourses, setWatchedCourses] = useState<WatchedCourse[]>([]);
  const { isLoggedIn, checkLoginStatus, userId, createdDate } = useAuth();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData({
        fullName: response.data.fullName,
        avatar: response.data.avatar,
        role: response.data.listRoles[0].roleName,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formattedDate = createdDate 
  ? new Intl.DateTimeFormat("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(createdDate))
  : "";

  const fetchWatchedCourses = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/lesson-watch-history/watched?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWatchedCourses(response.data);
    } catch (error) {
      console.error("Error fetching watched courses:", error);
    }
  };
  useEffect(() => {
    checkLoginStatus();
    if (isToken()) {
      fetchUserData();
      fetchWatchedCourses();
    } else {
      navigate("/login");
    }
  }, [navigate, checkLoginStatus, userId]);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }
  return (
    <MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}}>
      <Container fluid className="p-0">
        <div className="profile-cover position-relative">
          <img
            src={imgbg}
            alt="Cover"
            className="img-fluid w-100"
            style={{ height: "350px", objectFit: "cover" }}
          />
          <div
            className="position-absolute d-flex align-items-center"
            style={{ left: "20px", bottom: "10px" }}
          >
            <Avatar
              src={userData.avatar || "/path/to/default/avatar.jpg"}
              sx={{ width: 80, height: 80, border: "3px solid white" }}
            />
            <h2
              className="ms-3 mb-0"
              style={{ color: "black", marginTop: "40px" }}
            >
              {userData.fullName}
            </h2>
          </div>
        </div>
        <Container>
          <Row>
            <Col md={4}>
              <Card
                className="mb-3 "
                style={{
                  borderRadius: "15px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Card.Body>
                  <h5 className="fw-bold">Giới thiệu</h5>
                  <p>
                    <i className="fas fa-user-friends me-2"></i>
                    Thành viên của COURSE IT từ {formattedDate}
                  </p>
                </Card.Body>
              </Card>
              <Card
                style={{
                  borderRadius: "15px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Card.Body>
                  <h5 className="fw-bold">Hoạt động gần đây</h5>
                  <p>Chưa có hoạt động gần đây</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <Card
                style={{
                  borderRadius: "15px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Card.Body>
                  <h5 className="fw-bold">Các khóa học đã xem</h5>
                  {watchedCourses.map((course) => (
                    <Link
                      to={`/course-detail/${course.id}`}
                      key={course.id}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Card className="mb-3">
                        <Row noGutters>
                          <Col md={4} className="d-flex align-items-center">
                            <div
                              style={{
                                width: "100%",
                                height: "150px",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Card.Img
                                src={`${BASE_API_URL}${course.cover}`}
                                alt={course.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </Col>
                          <Col md={8}>
                            <Card.Body>
                              <Card.Title className="fw-bold">
                                {course.title}
                              </Card.Title>
                              <Card.Text>{course.description}</Card.Text>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </Link>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </MainLayout>
  );
};

export default Profile;
