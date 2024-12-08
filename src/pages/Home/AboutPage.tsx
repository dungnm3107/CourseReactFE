
import { Link } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import "../../assets/css/aboutPage.css";

export function AboutPage() {
  return (
    <div className="about-container">
      <header className="about-header">
        <img src={logo} alt="Course IT Logo" className="about-logo" />
        <h1>Giới thiệu về IT Course</h1>
      </header>
      <section className="about-introduction">
        <h2>Nền tảng học trực tuyến cho ngành IT</h2>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Chào mừng bạn đến với <strong>Course IT</strong> - nơi hội tụ
          những khóa học chất lượng dành cho những ai đam mê học tập và phát
          triển bản thân trong lĩnh vực công nghệ thông tin (IT). Chúng tôi
          tạo ra một không gian để kết nối những người muốn chia sẻ kiến thức
          với những học viên đang tìm kiếm sự phát triển nghề nghiệp.
        </p>
      </section>
      
      <section className="about-vision">
        <h2>Tầm nhìn của chúng tôi</h2>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Tại <strong>Course IT</strong>, chúng tôi tin rằng kiến thức là
          sức mạnh. Chúng tôi mong muốn tạo ra một cộng đồng học tập, nơi mọi
          người đều có cơ hội học hỏi từ những chuyên gia hàng đầu trong ngành.
          Chúng tôi hướng đến việc trở thành nền tảng học trực tuyến hàng đầu
          tại Việt Nam, cung cấp những khóa học đa dạng và chất lượng.
        </p>
      </section>

      <section className="about-mission">
        <h2>Sứ mệnh của chúng tôi</h2>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Sứ mệnh của chúng tôi là cung cấp các khóa học phong phú, từ miễn
          phí đến trả phí, để đáp ứng nhu cầu học tập của từng cá nhân. Chúng
          tôi cam kết đem lại trải nghiệm học tập tốt nhất cho học viên thông
          qua các giảng viên có kinh nghiệm, nội dung khóa học chất lượng và
          hỗ trợ tận tình.
        </p>
      </section>

      <section className="about-features">
        <h2>Tính năng nổi bật</h2>
        <ul>
          <li>
            <strong>Khóa học miễn phí và trả phí:</strong> Cung cấp sự linh hoạt
            cho giảng viên trong việc lựa chọn cách thức phân phối khóa học của
            mình.
          </li>
          <li>
            <strong>Tìm kiếm khóa học nhanh chóng:</strong> Học viên có thể dễ
            dàng tìm kiếm khóa học theo từ khóa với giao diện thân thiện.
          </li>
          <li>
            <strong>Quản lý người dùng:</strong> Học viên có thể dễ dàng đăng
            ký, theo dõi thông tin cá nhân và truy cập các khóa học đã đăng ký.
          </li>
        </ul>
      </section>

      <footer className="about-footer">
        <Link to="/" className="about-back-home"> Quay lại trang chủ</Link>
      </footer>
    </div>
  );
}
