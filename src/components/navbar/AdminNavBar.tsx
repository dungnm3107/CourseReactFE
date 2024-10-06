import React from "react";
import { Avatar, Button } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import "../../assets/css/navbar.css";
import { useLogout } from "../../hooks /useLogout";


export function NavBar({
  avatar,
  role,
}: { avatar: string; role: string }) {
  const logout = useLogout();

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
              <NavLink className="nav-link fw-bold " to="/">
                Trang chủ
              </NavLink>
            </li>
          </ul>
          {/* <!-- Left links --> */}
        </div>

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
                  Thông báo mới
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
                src={avatar || "/path/to/default/avatar.jpg"}
                style={{ fontSize: "14px" }}
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
      </div>
    </nav>
  );
}

export default NavBar;
