import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import "../../assets/css/dashboard.css";
import { useAuth } from "../../service/AuthContext";

const Dashboard: React.FC = () => {

  const { avatar, role } = useAuth();

  return (
    <AdminLayout
      avatar={avatar}
      role={role}
    >
      <div className="d-flex">
        <AdminSideBar />
        <div className="content">
          <h1>Admin Dashboard</h1>
          <p>Welcome to the admin dashboard!</p>
          {/* Additional dashboard content can go here */}
          <div className="dashboard-cards">
            <div className="card">
              <h2>Statistics</h2>
              <p>Overview of user registrations, course completions, etc.</p>
            </div>
            <div className="card">
              <h2>Recent Activities</h2>
              <p>List of recent activities or updates.</p>
            </div>
            <div className="card">
              <h2>Quick Actions</h2>
              <p>Links to quickly manage users or courses.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
