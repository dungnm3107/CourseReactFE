import React from "react";

export default function Roadmap() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontWeight: "bold" }}>Lộ trình học</h1>
      <p>
        Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để đi làm
        với vị trí "Lập trình viên Front-end", bạn nên tập trung vào lộ trình "Front-end".
      </p>
      <p>
        Bạn có thể tham khảo lộ trình học bất cứ mảng nào về IT qua{" "}
        <a
          href="https://roadmap.sh"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }} // Gạch chân
        >
          đường dẫn này
        </a>.
      </p>
    </div>
  );
}
