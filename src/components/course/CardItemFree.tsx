import React from "react";
import { Link } from "react-router-dom";
import { BASE_API_URL } from '../../constants/Constants';

interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: 'FREE' | 'PAID';
}

interface CardItemFreeProps {
  course: Course;
}

export default function CardItemFree({ course }: CardItemFreeProps) {
  return (  
      <div
        className="card card-hover"
        style={{  borderRadius: "16px","border":"1px solid #e0e0e0" , padding: "0px",
          boxShadow: '0 4px 8px  rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="card-body">
          <img
            style={{ height: "200px", borderRadius: "16px", objectFit: "cover" }}
            src={`${BASE_API_URL}${course.cover}`|| "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={course.title}
          />
          <h5 className="card-title mt-2 fw-bold" style={{ color: "black" }}>{course.title}</h5>
          {/* <p className="card-text" style={{ color: "gray" }}>{course.description}</p> */}
          <h5 className="card-title mt-3" style={{ color: 'rgb(233, 69, 29)' }}>Miễn phí</h5>
        </div>
      </div>
  );
}