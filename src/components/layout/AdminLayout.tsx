import React from "react";
import AdminNavBar from "../navbar/AdminNavBar";
import AdminSideBar from "../sidebar/AdminSideBar";

interface AdminLayoutProps {
  children: React.ReactNode;
  avatar: string | null;
  role: string | null;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  avatar,
  role,
}) => {
  return (
    <div>
      <AdminNavBar
        avatar={avatar || ""}
        role={role || ""}
      />
      <div className="content-wrapper">
        <AdminSideBar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;