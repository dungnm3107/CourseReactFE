import {
  faCirclePlay,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/css/accordion.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useParams } from "react-router-dom";
import axios from "axios";
interface Chapter {
  id: number;
  sequence: number;
  title: string;
  description: string;
  chapterSequence: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  lessonSequence: number;
}

export default function Accordion() {
  const { id: courseId } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        if (!courseId) {
          console.error("Course ID is missing");
          return;
        }
        console.log("Fetching chapters for courseId:", courseId);
        const response = await axiosInstance.get(
          `/api/v1/chapter/get/${courseId}`
        );
        console.log("API response:", response.data.result);
        if (response.data && Array.isArray(response.data.result)) {
          setChapters(response.data.result);
        } else {
          console.error("Unexpected data structure:", response.data);
          setChapters([]);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Request config:", error.config);
        }
      }
    };

    fetchChapters();
  }, [courseId]);

  return (
    <div>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        {chapters.map((chapter, index) => (
          <div className="accordion-item" key={chapter.id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                <span className="fw-bold icon-container">
                  <FontAwesomeIcon icon={faPlus} className="icon-collapsed" />
                  <FontAwesomeIcon icon={faMinus} className="icon-expanded" />
                </span>
                <span className="fw-bold">
                  { "Chương " + chapter.chapterSequence || "No sequence"}.{" "}
                  {chapter.title || "No title"}
                </span>
                <div className="text-right-col ms-auto">
                  <span>{chapter.lessons?.length ?? 0}</span> bài học
                </div>
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
            >
              <div className="accordion-body">
                <ul className="list-group">
                  {chapter.lessons?.map((lesson, lessonIndex) => (
                    <li className="list-group-item" key={lesson.id}>
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        style={{ color: "#fa9200" }}
                      />{" "}
                      <span>{"Bài "+ lesson.lessonSequence || lessonIndex + 1}. </span>
                      {lesson.title || "No title"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <br></br>
      <br></br>
    </div>
  );
}
