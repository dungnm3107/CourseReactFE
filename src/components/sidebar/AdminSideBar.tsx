import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminSideBar: React.FC = () => {
  const [isAttributesOpen, setIsAttributesOpen] = useState(false);

  const toggleAttributes = () => {
    setIsAttributesOpen(!isAttributesOpen);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <Link to="/admin" className="box">
          <span>Trang chủ Admin</span>
        </Link>
        <Link to="/admin/users" className="box">
          <span>Quản lý người dùng</span>
        </Link>
        <Link to="/admin/courses" className="box">
          <span>Quản lý khóa học</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSideBar;