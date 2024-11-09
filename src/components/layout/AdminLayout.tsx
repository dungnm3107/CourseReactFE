import React, { useState } from "react";
import AdminNavBar from "../navbar/AdminNavBar";
import AdminSideBar from "../sidebar/AdminSideBar";
import "../../assets/css/adminLayout.css"; 

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div>
      <AdminNavBar
        avatar={avatar || ""}
        role={role || ""}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen} 
      />
      <div className="admin-layout-content-wrapper">
        <div className={`admin-layout-sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
          <AdminSideBar isOpen={isSidebarOpen}/>
        </div>
        <main className={`admin-content ${isSidebarOpen ? '' : 'collapsed'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;