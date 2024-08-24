import React from "react";
import { Avatar, Button } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from"../../assets/logo3.png"

export  function NavBar() {
  return (
    
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light sticky-top"
      style={{ zIndex: 10 , position: "sticky" , top: 0 , borderBottom:"1px solid #e8ebed " , backgroundColor: "#fff"}}
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
            <img
              src={logo}
              width="50"
              alt="MDB Logo"
              loading="lazy"
            />
          </Link>
          {/* <!-- Left links --> */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold " to="/">
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" to="/about">
                Giới thiệu
              </NavLink>
            </li>
            <li className="nav-item dropdown dropdown-hover">
              <a
                className="nav-link dropdown-toggle fw-bold"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
               Kho Khóa Học
              </a>
             <ul className="dropdown-menu">
                <li>
                    <Link className="dropdown-item" to={"/blog"}>
                       Khóa Học 1
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item" to={"/news"}>
                      Khóa Học 1
                    </Link>
                </li>
            </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to={"/policy"}>
                 Bài Viết
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link fw-bold" to={"/policy"}>
                Chính sách
              </Link>
            </li>
          </ul>
          {/* <!-- Left links --> */}
        </div>
        {/* <!-- Collapsible wrapper --> */}
        {/* <!-- Right elements --> */}
        <div className="d-flex align-items-center">
          {/* <!-- Shopping Cart --> */}
          <Link className="text-reset me-3" to="/cart">
            <i className="fas fa-shopping-cart"></i>
            <span className="badge rounded-pill badge-notification bg-danger"></span>
          </Link>

          <div>
            <Link to={"/login"}>
              <Button>Đăng nhập</Button>
            </Link>
            <Link to={"/register"}>
              <Button>Đăng ký</Button>
            </Link>
          </div>

          <>
            {/* <!-- Notifications --> */}
            <div className="dropdown">
              <a
                className="text-reset me-3 dropdown-toggle hidden-arrow"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-bell"></i>
                <span className="badge rounded-pill badge-notification bg-danger">
                  1
                </span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Some news
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another news
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
            {/* <!-- Avatar --> */}
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
                  style={{ fontSize: "14px" }}
                  // alt={getLastNameByToken()?.toUpperCase()}
                  // src={getAvatarByToken()}
                  sx={{ width: 30, height: 30 }}
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
                <li>
                  <Link className="dropdown-item" to="">
                    Sách yêu thích của tôi
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="">
                    Quản lý
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" style={{ cursor: "pointer" }}>
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          </>
        </div>
        {/* <!-- Right elements --> */}
      </div>
      {/* <!-- Container wrapper --> */}
    </nav>
  );
}
export default NavBar;
