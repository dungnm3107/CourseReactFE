import React, { useEffect, useState, useRef } from "react";
import { Avatar, Button } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import "../../assets/css/navbar.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";

interface NavBarProps {
  onOpenLoginModal: () => void;
  onOpenSignUpModal: () => void;
}
interface Course {
  id: string;
  title: string;
  coursePrice: number;
  cover: string;
}

export function NavBar({ onOpenLoginModal, onOpenSignUpModal }: NavBarProps) {
  const { isLoggedIn } = useAuth();
  const logout = useLogout();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    const storedRole = localStorage.getItem("role");
    setAvatar(storedAvatar);
    setRole(storedRole);
  }, [isLoggedIn]);

    // search
    // dung debounce de giam tan xuat call api
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (searchKeyword.trim() !== "") {
          handleSearch();
        } else {
          setCourses([]);
          setShowResults(false);
        }
      }, 300); // cho delay 0.3 s
  
      return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword]);

  const handleSearch = async () => {
    if (!searchKeyword) return;
    try {
      const response = await axiosInstance.get(
        `/api/v1/course/search?keyword=${searchKeyword}`
      );
      setCourses(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching courses", error);
      setCourses([]);
      setShowResults(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  // dong ket qua tim kiem khi click ra ngoai
  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setShowResults(false); 
    }
  };

  useEffect(() => {
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
      <div className="container-fluid">
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Link className="navbar-brand mt-2 mt-lg-0" to="/">
            <img src={logo} width="50" alt="MDB Logo" loading="lazy" />
          </Link>

          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <li className="nav-item">
              <NavLink
                className="nav-link fw-bold"
                to="/"
                style={{ color: "#444", fontWeight: "bold" }}
              >
                Trang chủ
              </NavLink>
            </li> */}
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
        </div>

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

          {/* ket qua tim kem */}
          {showResults && (
            <div
              className="search-results"
              ref={resultsRef}
              style={{
                maxWidth: "600px",
                width: "100%",
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
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
                          src={course.cover}
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
