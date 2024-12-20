

interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: 'FREE' | 'PAID';
}

interface CardItemProps {
  course: Course;
  isPurchased: boolean;
}

export default function CardItem({ course, isPurchased }: CardItemProps) {
  return (
      <div
        className="card card-hover"
        style={{ borderRadius: "16px","border":"1px solid #e0e0e0",
          padding: "0px",
          boxShadow: '0 4px 8px  rgba(0, 0, 0, 0.3)', }}
      >
        <div className="card-body">
          <img
            style={{ height: "200px", borderRadius: "16px", objectFit: "cover" }}
            src={course.cover|| "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={course.title}
          />
          <h5 className="card-title mt-2 fw-bold" style={{ color: "black" }}>{course.title}</h5>
          <p className="card-text fw-bold">
          {isPurchased ? (
            <span style={{ color: "#28a745" }}>Đã mua</span>
          ) : (
            <span style={{ color: "#DC143C" }}>{course.coursePrice.toLocaleString('vi-VN')}đ</span>
          )}
        </p>
        </div>
      </div>
  );
}