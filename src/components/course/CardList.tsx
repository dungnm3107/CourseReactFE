import { useEffect, useState } from "react";
import CardItemFree from "./CardItemFree";
import axiosInstance from "../../config/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../service/AuthContext';

interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: "FREE" | "PAID";
}
export default function CardList(){
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/course/free");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else if (response.data && typeof response.data === "object") {
          // If the response is an object, try to find an array property
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

  const handleCourseClick = (courseId: number) => {
      navigate(`/course-detail/${courseId}`);
  };

  return (
    <>
      <div style={{ height: "44px", marginBottom: "10px"  }}>
        <h6 className="pt-3">
          <span
            style={{ fontSize: "28px", color: "black", fontWeight: "bold" }}
          >
            Khóa học Free
          </span>
        </h6>
      </div>
      <div className="row">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="col-sm-6 col-md-4 col-lg-3 mt-3">
              <div onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
              <CardItemFree course={course} />
            </div>
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </>
  );
}
