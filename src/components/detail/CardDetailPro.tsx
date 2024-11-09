import { useEffect, useState } from "react";
import CardDetailRightPro from "./CardDetailRightPro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Accordion from "./Accordion";
import axiosInstance from "../../config/axios";
import { useParams } from "react-router-dom";
import LoginModal from "../../pages/SignIn/LoginModal";
import SignUpModal from "../../pages/SignUp/SignUpModal";

interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: "FREE" | "PAID";
  listChapter: Chapter[];
  videoUrl: string;
}
interface Chapter {
  id: number;
  sequence: number;
  description: string;
  lessons?: { id: number }[];
}

export default function CardDetailPro() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  const handleOpenSignUpModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };
  const handleCloseSignUpModal = () => setIsSignUpModalOpen(false);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/course/get/${id}`);
        console.log("API response:", response.data);
        if (response.data && typeof response.data === "object") {
          setCourse(response.data.result);
          console.log("Updated course state:", response.data.result);
          // Calculate total lessons
          const total = response.data.result.listChapter.reduce(
            (acc: number, chapter: Chapter) =>
              acc + (chapter.lessons?.length || 0),
            0
          );
          setTotalLessons(total);
        } else {
          console.error("Unexpected data structure:", response.data);
          setCourse(null);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }
  console.log("Course state:", course);
  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>{"KHÓA HỌC: " + course.title || "No title available"}</h1>
        <p>{course.description || "No description available"}</p>

        <h3>Bạn sẽ học được những gì?</h3>
        <div className="row">
          {course.listChapter && course.listChapter.length > 0 ? (
            course.listChapter
              .sort((a, b) => a.sequence - b.sequence)
              .map((chapter) => (
                <div key={chapter.id} className="col-md-6 mb-2">
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "#fa9200", marginRight: "10px" }}
                  />
                  <span>{chapter.description}</span>
                </div>
              ))
          ) : (
            <div className="col-12">No chapter information available</div>
          )}
        </div>

        <h3 className="mt-4">Nội dung khóa học</h3>
        <Accordion />
      </div>
      <div className="col-lg-4">
        <CardDetailRightPro
          totalLessons={totalLessons}
          courseId={course.id}
          coursePrice={course.coursePrice}
          videoUrl={course.videoUrl}
          onOpenLoginModal={handleOpenLoginModal}
        />
      </div>
      <LoginModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToSignUp={handleOpenSignUpModal}
        onSuccessfulLogin={handleCloseLoginModal}
      />
      <SignUpModal
        open={isSignUpModalOpen}
        onClose={handleCloseSignUpModal}
        onSwitchToLogin={handleOpenLoginModal}
      />
    </div>
  );
}
