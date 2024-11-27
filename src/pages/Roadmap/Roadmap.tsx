export default function Roadmap() {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1300px",
        margin: "0 auto", 
        textAlign: "justify", 
        lineHeight: "1.8",
      }}
    >
      <h1 style={{ fontWeight: "bold", fontSize: "28px", textAlign: "center", marginLeft:"-100px" }}>
        Lời khuyên khi chọn lộ trình học ngành IT
      </h1>
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#2d89ef" }}>
          1. Tìm hiểu các thông tin cơ bản về ngành
        </h2>

        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Trước khi bắt đầu học sâu vào một ngành cụ thể, việc hiểu rõ các thông
          tin cơ bản là điều vô cùng quan trọng. Điều này sẽ giúp bạn có cái
          nhìn tổng quan về ngành học, phát hiện mảng nào hấp dẫn và tạo lộ
          trình học tập hiệu quả nhất cho bản thân.
        </p>
      </section>
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#2d89ef" }}>
          2. Xác định lĩnh vực bạn muốn học
        </h2>
        <img
          src="https://topdev.vn/blog/wp-content/uploads/2023/07/cong-nghe-thong-tin.jpg"
          alt="Xác định lĩnh vực"
          style={{
            width: "70%",
            height: "auto",
            margin: "10px 0",
            borderRadius: "10px",
            alignItems: "center",
            marginLeft: "120px",
          }}
        />
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Ngành công nghệ thông tin rất rộng lớn, bạn cần xác định được đâu là
          thứ bản thân mình muốn theo học. Dưới đây là một số gợi ý nhóm ngành
          CNTT bạn có thể tham khảo:
        </p>
        <br />
        <ul
          style={{
            marginLeft: "20px",
            listStyleType: "disc",
            maxWidth: "1100px",
          }}
        >
          <li>
            {" "}
            <span style={{ fontWeight: "bold" }}>
              Khoa học máy tính (Computer Science):
            </span>{" "}
            Đây là là một ngành học nền tảng, cho phép bạn thấu hiểu mọi khía
            cạnh của máy tính, từ thiết kế, chế tạo, vận hành cho đến sửa chữa
            các yếu tố như phần cứng, phần mềm, hệ thống, nhằm đáp ứng nhu cầu
            của khách hàng hoặc người dùng. Đây là lĩnh vực dành riêng cho những
            người đam mê máy tính, và muốn tìm hiểu sâu về nền tảng của công
            nghệ này.
          </li>
          <br />
          <li>
            <span style={{ fontWeight: "bold" }}>
              Mạng máy tính và truyền thông dữ liệu (Data Communication and
              Computer Network):
            </span>
            Đây là là một trong những lĩnh vực chuyên sâu của Công nghệ thông
            tin, tập trung vào việc nghiên cứu, triển khai, và quản lý các hệ
            thống mạng máy tính và truyền thông dữ liệu. Ngành này chịu trách
            nhiệm xây dựng và duy trì các mạng máy tính, hệ thống viễn thông, và
            cơ sở dữ liệu để đảm bảo việc truyền tải dữ liệu thông tin diễn ra
            một cách hiệu quả và bảo mật.
          </li>
          <br />
          <li>
            <span style={{ fontWeight: "bold" }}>
              Kỹ thuật máy tính (Computer Engineering):
            </span>
            Đây là một ngành học kết hợp giữa kiến thức về Điện tử và Công nghệ
            thông tin, tập trung nghiên cứu cách xây dựng và phát triển thiết bị
            cùng với các phần mềm hỗ trợ hoạt động của các thiết bị phần cứng.
            Ngành này có sự liên quan chặt chẽ đến vật lý, kỹ thuật điện và khoa
            học máy tính.
          </li>
          <br />
          <li>
            <span style={{ fontWeight: "bold" }}>
              Công nghệ Phần mềm (Software Engineering):
            </span>
            Đây là một chuyên ngành tập trung vào nghiên cứu về hệ thống kỹ
            thuật và phần mềm máy tính. Mục tiêu của ngành là xây dựng các ứng
            dụng nhằm tăng cường hiệu quả hoạt động của doanh nghiệp và cải
            thiện chất lượng cuộc sống của con người.
          </li>
          <br />
          <li>
            <span style={{ fontWeight: "bold" }}>
              Big Data & Machine Learning:
            </span>
            Ngành học này tập trung vào việc nghiên cứu và ứng dụng các phương
            pháp, công cụ để xử lý và phân tích dữ liệu lớn (Big Data) thông qua
            trí tuệ nhân tạo và học máy (Machine Learning).
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#2d89ef" }}>
          3. Lựa chọn ngôn ngữ lập trình
        </h2>

        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Sau khi đã xác định lĩnh vực, hãy nghiên cứu các ngôn ngữ, công nghệ
          phổ biến trong lĩnh vực đó. Ví dụ:
        </p>
        <ul style={{ marginLeft: "20px", listStyleType: "disc" }}>
          <li>Front-end: HTML, CSS, JavaScript, React, Angular,...</li>
          <li>Back-end: Node.js, Java, Python, PHP,...</li>
          <li>Data Science: Python, R, SQL, Tableau,...</li>
        </ul>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Việc lựa chọn công nghệ sẽ giúp bạn tập trung và không bị lạc hướng
          giữa quá nhiều công nghệ khác nhau.
        </p>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          - Tham khảo bảng xếp hạng top các ngôn ngữ lập trình được sử dụng năm
          2024:
        </p>
        <img
          src="https://topdev.vn/blog/wp-content/uploads/2023/04/bang-xep-hang-ngon-ngu-lap-trinh-pho-bien-nhat.jpeg"
          alt="Chọn công nghệ"
          style={{
            width: "80%",
            height: "auto",
            margin: "10px 0",
            borderRadius: "10px",
            marginLeft: "65px",
          }}
        />
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#2d89ef" }}>
          4. Định hướng nghề nghiệp tương lai
        </h2>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Hãy tìm hiểu về các vị trí công việc trong lĩnh vực bạn chọn. Xác định
          yêu cầu của các công việc và bắt đầu xây dựng kỹ năng phù hợp.
        </p>
        <img
          src="https://cloud-web-cms-beta.s3.cloud.cmctelecom.vn/intel_537706c2ac.png"
          alt="Định hướng nghề nghiệp"
          style={{
            width: "70%",
            height: "auto",
            margin: "10px 0",
            borderRadius: "10px",
            marginLeft: "120px",
          }}
        />
        <p style={{ width: "100%", maxWidth: "1200px" }}><span style={{ fontWeight: "bold", textDecoration: "underline"}}>Ví dụ:</span></p>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          - Nếu bạn muốn trở thành <span style={{ fontWeight: "bold" }}>Front-end Developer</span>, hãy tập trung vào học
          HTML, CSS, JavaScript và một framework như React hoặc Angular.
        </p>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          - Nếu bạn muốn trở thành <span style={{ fontWeight: "bold" }}>Backend Developer</span>, hãy học các ngôn ngữ như
          Java, Python, hoặc Node.js, và tìm hiểu về các hệ quản trị cơ sở dữ
          liệu (SQL, NoSQL), cũng như các kiến thức về API, bảo mật và
          scalability.
        </p>
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          - Nếu bạn muốn trở thành <span style={{ fontWeight: "bold" }}>Fullstack Developer</span>, bạn cần kết hợp các kỹ
          năng của cả Front-end và Backend. Hãy học HTML, CSS, JavaScript
          (React, Angular), cùng với một ngôn ngữ backend (Node.js, Java) và cơ
          sở dữ liệu (MongoDB, PostgreSQL).
        </p>

      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#2d89ef" }}>
          5. Tham khảo lộ trình học cụ thể
        </h2>
        <img
          src="https://renewep.com/wp-content/uploads/2023/09/road-map.jpg"
          alt="Lộ trình"
          style={{
            width: "50%",
            height: "auto",
            margin: "10px 0",
            borderRadius: "10px",
            marginLeft: "190px",
          }}
        />
        <p style={{ width: "100%", maxWidth: "1200px" }}>
          Bạn có thể tham khảo các lộ trình học chi tiết tại trang{" "}
          <a
            href="https://roadmap.sh"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "#1e90ff" }}
          >
            roadmap.sh
          </a>
          . Trang này cung cấp lộ trình học chuyên sâu, rõ ràng cho nhiều lĩnh vực IT.
        </p>
      </section>
    </div>
  );
}
