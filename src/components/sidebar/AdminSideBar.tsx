import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faBook,faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import logo from "../../assets/images/logoCourse.png"; 
import "../../assets/css/adminSideBar.css";

interface AdminSideBarProps {
  isOpen: boolean;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ isOpen }) => {
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
        <Link 
          to="https://sandbox.vnpayment.vn/merchantv2/Transaction/PaymentSearch.htm?bankCode=&ordid=&fromdate=20-10-2024&todate=07-11-2024&tnxref=&payType=&trace=&status=&desc=&mcStatus=" 
          className="admin-box"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faMoneyBill} className="sidebar-icon" />
          <span>Quản lý giao dịch</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSideBar;