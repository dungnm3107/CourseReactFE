import React, { useEffect, useState, useRef } from "react";
import { Avatar, Button } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import "../../assets/css/navbar.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";
import { BASE_API_URL } from "../../constants/Constants";

interface NavBarProps {
  onOpenLoginModal: () => void;
  onOpenSignUpModal: () => void;
}
interface Course {
  id: string; // or number depending on your API response
  title: string;
  coursePrice: number;
  cover: string;
}

export function NavBar({ onOpenLoginModal, onOpenSignUpModal }: NavBarProps) {
  const { isLoggedIn } = useAuth();
  const logout = useLogout();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [courses, setCourses] = useState<Course[]>([]);
  const [showResults, setShowResults] = useState(false); // State to manage the visibility of the results
  const resultsRef = useRef<HTMLDivElement | null>(null); // Ref for the results container

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    const storedRole = localStorage.getItem("role");
    setAvatar(storedAvatar);
    setRole(storedRole);
  }, [isLoggedIn]);

  // Hàm gọi API tìm kiếm khóa học
  const handleSearch = async () => {
    if (!searchKeyword) return; // Nếu không có từ khóa thì không gọi API
    try {
      const response = await axiosInstance.get(
        `/api/v1/course/search?keyword=${searchKeyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token vào header
          },
        }
      );
      setCourses(response.data); // Lưu kết quả vào state
      setShowResults(true); // Show results after fetching
    } catch (error) {
      console.error("Error fetching courses", error);
      setCourses([]); // Reset kết quả nếu có lỗi
      setShowResults(true); // Show results even if there's an error
    }
  };

  // Cập nhật khi người dùng nhập từ khóa
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  // Cập nhật khi nhấn Enter hoặc click search
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Handle click outside of results to close the results container
  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setShowResults(false); // Hide the results
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the results
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light sticky-top"
      style={{
        zIndex: 10,
        position: "sticky",
        top: 0,
        borderBottom: "1px solid #e8ebed ",
        backgroundColor: "#fff",
      }}
    >
      {/* <!-- Container wrapper --> */}
      <div className="container-fluid">
        {/* <!-- Toggle button --> */}
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        {/* <!-- Collapsible wrapper --> */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* <!-- Navbar brand --> */}
          <Link className="navbar-brand mt-2 mt-lg-0" to="/">
            <img src={logo} width="50" alt="MDB Logo" loading="lazy" />
          </Link>
          {/* <!-- Left links --> */}
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <li className="nav-item">
              <NavLink
                className="nav-link fw-bold"
                to="/"
                style={{ color: "#444", fontWeight: "bold" }}
              >
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link fw-bold"
                to="/about-page"
                style={{ color: "#444", fontWeight: "bold" }}
              >
                Giới thiệu
              </NavLink>
            </li>
          </ul>
          {/* <!-- Left links --> */}
        </div>
        {/* <!-- Collapsible wrapper --> */}

        {/* Centered search bar */}
        <div className="flex-grow-1 d-flex justify-content">
          <form
            className="d-flex input-group w-75"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Tìm kiếm khóa học..."
                aria-label="Search"
                style={{ borderRadius: "20px 0 0 20px" }}
                value={searchKeyword}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                id="button-addon2"
                style={{ borderRadius: "0 20px 20px 0" }}
                onClick={handleSearch}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Kết quả tìm kiếm */}
          {showResults && (
            <div
              className="search-results"
              ref={resultsRef}
              style={{
                maxWidth: "588px", // Thu nhỏ chiều rộng tối đa
                width: "100%",
                maxHeight: "400px", // Giới hạn chiều cao
                overflowY: "auto", // Cho phép cuộn nếu có nhiều kết quả
                // position: 'absolute',
                // top: '100%',
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                // zIndex: 1000
              }}
            >
              {courses.length > 0 ? (
                <>
                  <h4>Kết quả cho '{searchKeyword}':</h4>
                  <ul>
                    {courses.map((course) => (
                      <li
                        key={course.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={`${BASE_API_URL}${course.cover}`}
                          alt={course.title}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginLeft: 2,
                            marginRight: 2,
                          }}
                        />
                        <Link
                          to={
                            course.coursePrice === 0
                              ? `/course-detail/${course.id}`
                              : `/course-detail-pro/${course.id}`
                          }
                        >
                          {course.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <h4>Không có kết quả cho '{searchKeyword}'</h4>
              )}
            </div>
          )}
        </div>
        {!isLoggedIn ? (
          <div>
            <Button
              className="btn-custom-bold"
              variant="text"
              onClick={onOpenLoginModal}
            >
              Đăng nhập
            </Button>
            <Button
              className="btn-custom-bold"
              variant="text"
              onClick={onOpenSignUpModal}
            >
              Đăng ký
            </Button>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <a
                className="text-reset me-3 dropdown-toggle hidden-arrow"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-bell  notification-icon"></i>
                <span className="badge rounded-pill badge-notification bg-danger">
                  1
                </span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end notification-dropdown"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item notification-item" href="#">
                    Chúc bạn học tập hiệu quả! 🎊
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <a
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <Avatar
                  src={avatar ?? ""}
                  alt="User Avatar"
                  sx={{ width: 40, height: 40 }}
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <Link to={"/profile"} className="dropdown-item">
                    Thông tin cá nhân
                  </Link>
                </li>
                {role === "ADMIN" && (
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Trang quản lý
                    </Link>
                  </li>
                )}
                <li>
                  <Button
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={logout}
                  >
                    Đăng xuất
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
