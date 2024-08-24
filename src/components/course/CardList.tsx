import React from "react";
import CardItem from "./CardItem";

export default function CardList() {
  return (
    <>
      <div style={{ height: "44px" }}>
        <h6 className="pt-3">
          {" "}
          <span
            style={{ fontSize: "28px", color: "black", fontWeight: "bold" }}
          >
            Khóa học Free
          </span>
        </h6>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
      </div>
    </>
  );
}
