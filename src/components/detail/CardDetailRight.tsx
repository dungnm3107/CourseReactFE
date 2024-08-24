import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faFilm,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";

export default function CardDetailRight() {
  return (
    <div className="row">
      <div className="col-12 mx-3">
        <CardMedia
          style={{ borderRadius: "16px" }}
          component="video"
          src="/your-video.mp4"
          sx={{
            backgroundImage: `url(/your-thumbnail.jpg)`,
            backgroundSize: "cover",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&::before": {
                content: '""',
                display: "block",
                width: 64,
                height: 64,
                backgroundImage: "url(/play-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              },
            },
          }}
          controls
        />
      </div>
      <div className="col-12 d-flex justify-content-center mx-3 mt-4">
        <h2 className="" style={{ color: "orange" }}>
          Miễn Phí
        </h2>
      </div>
      <div className="col-12 d-flex justify-content-center mx-3 mt-2">
        <button
          style={{
            color: "white",
            backgroundColor: "black",
            borderRadius: "20px",
            width: "180px",
            height: "40px",
            fontSize: "15px",
          }}
          className="btn fw-bold  mx-3"
        >
          ĐĂNG KÍ HỌC
        </button>
      </div>

      <div className="col-12 d-flex justify-content-center mt-4">
        <ul>
          <li className="list-group-item">
            <FontAwesomeIcon icon={faGauge} />
            <span className="mx-2">Trình Độ Cơ Bản</span>
          </li>
          <li className="list-group-item">
            <FontAwesomeIcon icon={faFilm} />
            <span className="mx-2">
              Tổng Số <strong>7</strong> Bài học
            </span>
          </li>
          <li className="list-group-item">
            <FontAwesomeIcon icon={faBatteryFull} />
            <span className="mx-2">Học mọi lúc mọi nơi</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
