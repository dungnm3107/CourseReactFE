import React, { useEffect, useState } from "react";
import CardItem from "./CardItem";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../service/AuthContext";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: "FREE" | "PAID";
}


export default function CardListPro() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/course/paid");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else if (response.data && typeof response.data === "object") {
          const coursesArray = Object.values(response.data).find(Array.isArray);
          if (coursesArray) {
            setCourses(coursesArray);
          } else {
            console.error("Unexpected data structure:", response.data);
            setCourses([]);
          }
        } else {
          console.error("Unexpected response data:", response.data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const handleLinkClick = async (courseId: number) => {
  
    try {
      const response = await axiosInstance.get(`/api/v1/orders/latest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId, courseId },
      });
  
      const latestOrder = response.data;
  
      // Kiểm tra xem latestOrder có tồn tại và có trạng thái là COMPLETED
      if (latestOrder && latestOrder.status === "COMPLETED") {
        navigate(`/course-detail/${courseId}`);
      } else {
        navigate(`/course-detail-pro/${courseId}`);
      }
    } catch (error) {
      console.error("Error fetching latest order:", error);
      // Nếu có lỗi trong việc gọi API, bạn có thể điều hướng sang course-detail-pro
      navigate(`/course-detail-pro/${courseId}`);
    }
  };
  

  return (
    <>
      <div style={{ height: "44px" , marginBottom: "10px"  }}>
        <h6 className="pt-3">
          <span
            style={{ fontSize: "28px", color: "black", fontWeight: "bold"}}
          >
            Khóa học Pro
          </span>
          <span className="badge mb-3" style={{
             backgroundColor: "orange", 
             position: "relative",
             top: "-5px",    
             marginLeft: "4px" 
          }}>
            New
          </span>
        </h6>
      </div>
      <div className="row">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="col-sm-6 col-md-4 col-lg-3 mt-3">
              <div onClick={() => handleLinkClick(course.id)} style={{ cursor: 'pointer' }}>
                <CardItem course={course} />
              </div>
            </div>
          ))
        ) : (
          <p>No paid courses available</p>
        )}
      </div>
    </>
  );
}
