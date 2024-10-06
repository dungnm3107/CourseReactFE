import React from "react";
import { Link } from "react-router-dom";



export default function CardItemVideo() {
  return (  
      <div
        className="card card-hover"
        style={{ borderRadius: "16px" }}
      >
        <div className="card-body">
          <img
            style={{ height: "200px", borderRadius: "16px", objectFit: "cover" }}
            src={ "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={"title"}
          />
          <h5 className="card-title mt-2 fw-bold" style={{ color: "black" }}>{"title"}</h5>
        </div>
      </div>
  );
}