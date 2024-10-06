import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/footer.css";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#111111", width: "100%" }}
      className="text-white mt-3 position-relative"
    >
      <div className="container p-4">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase text-left">DỊCH VỤ</h5>
            <ul className="list-unstyled mb-0 text-left">
              {[
                "Điều khoản sử dụng",
                "Chính sách bảo mật thông tin cá nhân",
                "Chính sách bảo mật thanh toán",
              ].map((item) => (
                <li key={item}>
                  <a href="#!" className="text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase text-left">TÀI KHOẢN CỦA TÔI</h5>
            <ul className="list-unstyled mb-0 text-left">
              <li>
                <Link to={"/login"} className="text-white">
                  Đăng nhập/Tạo mới tài khoản
                </Link>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Chi tiết tài khoản
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Lịch sử mua hàng
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="text-center p-3"
        style={{ backgroundColor: "#111111" }}
      >
        © 2024 Copyright
        <span className="text-white fw-bold"> Nguyễn Mạnh Dũng</span>
      </div>
      <div className="social-icons position-absolute bottom-0 end-0 p-3">
        {["facebook", "google", "instagram", "github"].map((network) => (
          <a
            key={network}
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
          >
            <i className={`fa-brands fa-${network}`}></i>
          </a>
        ))}
      </div>
    </footer>
  );
}
