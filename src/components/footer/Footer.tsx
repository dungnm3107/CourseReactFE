
import { Link } from "react-router-dom";
import "../../assets/css/footer.css";
import logo from "../../assets/images/logoCourse.png";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#111111", width: "100%" }}
      className="text-white mt-3 position-relative"
    >
      <div className="container p-4 container-footer">
        <div className="row justify-content-center footer-content">
          {/* New contact information column */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-2">
              <img
                src={logo}
                alt="F8 Logo"
                style={{ width: "40px", height: "40px", borderRadius: "10%" }}
                className="me-2"
              />
              <h5 className="text-uppercase mb-0">Học Lập Trình Để Đi Làm</h5>
            </div>
            <ul className="list-unstyled mb-0 text-left">
              <li>
                <span>Điện thoại: 035 569 4350</span>
              </li>
              <li>
                <span>Email: manhdung1682003@gmail.com</span>
              </li>
              <li>
                <span>Địa chỉ: Số 1, ngõ 1, Định Công, Hoàng Mai, Hà Nội</span>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 mb-4 ">
            <h5 className="text-uppercase">VỀ IT COURSE</h5>
            <ul className="list-unstyled">
              {[
                { label: "Giới thiệu", link: "/about-page" },
                { label: "Chính sách bảo mật thông tin cá nhân", link: "#!" },
                { label: "Chính sách bảo mật thanh toán", link: "#!" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.link} className="text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase">TÀI KHOẢN</h5>
            <ul className="list-unstyled">
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
      <div className="container copyright-section">
        <div className="text-copyright">
          © 2024 Copyright <span className="fw-bold"> Nguyễn Mạnh Dũng</span>
        </div>
        <div className="social-icons">
          {[
            {
              network: "facebook",
              url: "https://www.facebook.com/profile.php?id=100015907356510",
            },
            {
              network: "instagram",
              url: "https://www.instagram.com/dungx_nd/",
            },
            { network: "github", url: "https://github.com/dungnm3107" },
          ].map(({ network, url }) => (
            <a
              key={network}
              className="btn btn-outline-light btn-floating"
              href={url}
              role="button"
              target="_blank" // Mở liên kết trong tab mới
              rel="noopener noreferrer" // Bảo mật khi mở tab mới
            >
              <i className={`fa-brands fa-${network}`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
