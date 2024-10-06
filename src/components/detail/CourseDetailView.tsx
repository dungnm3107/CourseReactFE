import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/courseDetailView.css";

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  lessonSequence: number;
}

const CourseDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/course/get/${id}`);
        if (response.data) {
          setCourseName(response.data.result.title); 
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/chapter/get/${id}`);
        if (response.data && Array.isArray(response.data.result)) {
          setChapters(response.data.result);
        } else {
          console.error("Unexpected data structure:", response.data);
          setChapters([]);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (id) {
      fetchCourseDetails();
      fetchChapters();
    }
  }, [id]);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="course-detail-view">
      <button onClick={() => navigate(-1)} className="back-button">
        <FontAwesomeIcon icon="arrow-left" /> Quay lại
      </button>
      <h1 className="course-title">{courseName}</h1>
      <div className="content-container">
        <div className="video-container">
          {selectedLesson ? (
            <video controls>
              <source src={`/path/to/video/${selectedLesson.id}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Chọn một bài học để xem video.</p>
          )}
        </div>
        <div className="chapters-container">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="chapter">
              <h2 className="chapter-title">{chapter.title}</h2>
              <ul className="lessons-list">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.id} className="lesson-item" onClick={() => handleLessonClick(lesson)}>
                    <FontAwesomeIcon icon={faCirclePlay} className="play-icon" />
                    <span>{lesson.lessonSequence}. {lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;