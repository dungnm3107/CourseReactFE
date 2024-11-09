import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faBook } from '@fortawesome/free-solid-svg-icons';
import logo from "../../assets/images/logoCourse.png"; 
import "../../assets/css/adminSideBar.css";

interface AdminSideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`admin-sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-content">
        <div className="logo-section">
          <img src={logo} alt="IT COURSE Logo" className="sidebar-logo" />
          <span className="logo-text">IT COURSE</span>
        </div>
        <div className="sidebar-divider"></div>
        <Link to="/admin" className="admin-box">
          <FontAwesomeIcon icon={faTachometerAlt} className="sidebar-icon" />
          <span>Trang chủ Admin</span>
        </Link>
        <Link to="/admin/users" className="admin-box">
          <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
          <span>Quản lý người dùng</span>
        </Link>
        <Link to="/admin/courses" className="admin-box">
          <FontAwesomeIcon icon={faBook} className="sidebar-icon" />
          <span>Quản lý khóa học</span>
        </Link>
        <Link to="/admin/courses" className="admin-box">
          <FontAwesomeIcon icon={faBook} className="sidebar-icon" />
          <span>Quản lý giao dich</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSideBar;