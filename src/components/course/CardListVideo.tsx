import React from "react";
import CardItemVideo from "./CardItemVideo";

export default function CardListVideo() {
  return (
    <>
      <div style={{ height: "44px" }}>
        <h6 className="pt-3">
          {" "}
          <span
            style={{ fontSize: "28px", color: "black", fontWeight: "bold" }}
          >
            Video nổi bật
          </span>
        </h6>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItemVideo />
        </div>
      </div>
    </>
  );
}
