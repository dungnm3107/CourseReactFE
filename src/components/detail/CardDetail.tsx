import React from "react";
import CardDetailRight from "./CardDetailRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Accordion from "./Accordion";


export default function CardDetail() {
  return (
    <>
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-7 mt-3">
          <div className="col-12">
            <h1>Kiến Thức Nhập Môn</h1>
          </div>
          <div className="col-12">
            {" "}
            <p>
              Để có cái nhìn tổng quan về ngàng IT - Lập trình web các bạn nên
              xem videos tại đây
            </p>
          </div>
          <br></br>
          <br></br>
          <div className="col-12">
            <h3>Bạn sẽ học được những gì ?</h3>
          </div>
          <div className="row">
             <div className="col-6"> <FontAwesomeIcon icon={faCheck} style={{color: "#fa9200",}} /> <span>Các kiến thức cơ bản IT</span></div>
             <div className="col-6"> <FontAwesomeIcon icon={faCheck} style={{color: "#fa9200",}} /> <span>Các mô hình, kiến trúc cơ bản</span></div>
             <div className="col-6"> <FontAwesomeIcon icon={faCheck} style={{color: "#fa9200",}} /> <span>Các khái niệm, thuật ngữ</span></div>
             <div className="col-6"> <FontAwesomeIcon icon={faCheck} style={{color: "#fa9200",}} /> <span>Các cấu trúc dữ liệu giải thuật</span></div>
          </div>
          <br></br>
          <br></br>
          <div className="col-12">
            <h3>Nội dung khóa học</h3>
            <br></br>
            <Accordion />
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-4 mt-3">
            <CardDetailRight />
        </div>
      </div>
    </>
  );
}
