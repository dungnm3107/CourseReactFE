import React from "react";
import { Avatar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import "../../assets/css/adminNarBar.css"; 
import { useLogout } from "../../hooks/useLogout";

export function AdminNavBar({
  avatar,
  role,
  toggleSidebar,
  isSidebarOpen,
}: {
  avatar: string;
  role: string;
  toggleSidebar: () => void; 
  isSidebarOpen:boolean;
}) {
  const logout = useLogout();

  return (
    <nav
      className="navbar-expand-lg sticky-top admin-navbar"
      style={{
        zIndex: 10,
        position: "sticky",
        top: 0,
        borderBottom: "1px solid #e8ebed ",
        height: "80px",
        marginLeft: isSidebarOpen ? '214px' : '0px', 
        transition: 'margin-left 0.3s',
      }}
    >
      <div className="admin-container-fluid">
        {/* Removed the button for the hamburger menu */}
        <div className="collapse navbar-collapse admin-coll" id="adminNavbarSupportedContent">
          <ul className="admin-navbar-nav">
            <li className="admin-nav-item">
            <FontAwesomeIcon icon={faBars} style={{ color: '#444', marginRight: '20px' }} onClick={toggleSidebar}/> {/* Hamburger icon */}
              <Link className="admin-nav-link" to="/">
                Trang chủ
              </Link>
            </li>
          </ul>
          <div className="admin-nav-actions ms-auto">
            <div className="admin-notification-dropdown">
              <a
                className="admin-notification-link"
                href="#"
                id="adminNavbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-bell"></i>
                <span className="admin-notification-badge bg-danger">1</span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="adminNavbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Thông báo mới
                  </a>
                </li>
              </ul>
            </div>
            <div className="admin-avatar-dropdown">
              <a
                className="dropdown-toggle d-flex align-items-center"
                href="#"
                id="adminNavbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <Avatar
                  src={avatar || "/path/to/default/avatar.jpg"}
                  sx={{ width: 40, height: 40 }}
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="adminNavbarDropdownMenuAvatar"
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
      </div>
    </nav>
  );
}

export default AdminNavBar;