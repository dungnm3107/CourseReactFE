import { faCirclePlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../../assets/css/accordion.css";
export default function Accordion() {
  return (
    <div>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              <span className="fw-bold">
                <FontAwesomeIcon icon={faPlus} style={{ color: "#fa9200" }} />{" "}
                1.
              </span>
              <span style={{ marginLeft: "5px" }} className="fw-bold">
                Cấu Hình Môi Trường
              </span>
              <div className="text-right-col"><span>3</span> bài học</div>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>1.</span>Giới Thiệu Về React JS <span></span>
                </li>
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>2.</span> <span>Cài Đặt Biến Môi Trường</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              <span className="fw-bold">
                <FontAwesomeIcon icon={faPlus} style={{ color: "#fa9200" }} />{" "}
                2.
              </span>
              <span style={{ marginLeft: "5px" }} className="fw-bold">
                Bài Học React JS
              </span>
              <div className="text-right-col"><span>4</span> bài học</div>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>3.</span> <span>Học Lập Trình Cơ Bản</span>
                </li>
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>4.</span> <span>Cách Fetch Api bằng Axios</span>
                </li>
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>5.</span> <span>Cách Sử Dụng React Hook</span>
                </li>
                <li className="list-group-item">
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    style={{ color: "#fa9200" }}
                  />{" "}
                  <span>6.</span> <span>Sử Dụng UseState Trong React Hook</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button
              className="accordion-button collapsed "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              <span className="fw-bold">
                <FontAwesomeIcon icon={faPlus} style={{ color: "#fa9200" }} />{" "}
                3.
              </span>
              <span style={{ marginLeft: "5px" }} className="fw-bold">
                Bài Học PHP
              </span>
               <div className="text-right-col"><span>3</span> bài học</div>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingThree"
          >
            <div className="accordion-body"></div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
    </div>
  );
}
