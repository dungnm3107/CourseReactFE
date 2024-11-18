import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faChevronDown,
  faChevronUp,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/courseDetailView.css";
import { useAuth } from "../../service/AuthContext";
import useGetSignedUrl from "../../hooks/useGetSignedUrl";
import useHlsPlayer from "../../hooks/useHlsPlayer";
interface Chapter {
  id: number;
  title: string;
  chapterSequence: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  lessonSequence: number;
  content: string;
  videoUrl: string;
}

interface FavoriteLessonResponse {
  id: number;
  userId: number | null;
  lesson: Lesson;
  deleted: boolean;
  createdAt: string;
}

const CourseDetailViewPro: React.FC = () => {
  const { userId, isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]); // Mảng chứa ID các chương đã mở
  const [watchedTime, setWatchedTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const navigate = useNavigate();
  const [initialWatchTime, setInitialWatchTime] = useState<number>(0);
  const [favoriteLessons, setFavoriteLessons] = useState<
    FavoriteLessonResponse[]
  >([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const videoRef = React.createRef<HTMLVideoElement>();
  const signedUrl = useGetSignedUrl(selectedLesson?.videoUrl || "");

  useHlsPlayer(signedUrl, videoRef);

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/progress/completed?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const completedLessonIds = response.data.map(
          (lesson: { lessonId: number }) => lesson.lessonId
        );
        setCompletedLessons(completedLessonIds); // Lưu danh sách bài học đã hoàn thành
      } catch (error) {
        console.error("Error fetching completed lessons:", error);
      }
    };

    fetchCompletedLessons();
  }, [userId]);

  const saveProgress = async () => {
    if (selectedLesson && userId) {
      const requestBody = {
        userId: userId,
        lessonId: selectedLesson.id,
      };

      try {
        await axiosInstance.post("/api/v1/progress", requestBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Progress saved:", requestBody);
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  const toggleFavorite = async (lesson: Lesson) => {
    try {
      const requestBody = {
        lessonId: lesson.id,
        userId: userId,
      };
      const response = await axiosInstance.post(
        "/api/v1/favorite-lessons/toggle",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Cập nhật favoriteLessons state với phản hồi từ API
      setFavoriteLessons((prev) => {
        const isFavorite = prev.some((fav) => fav.lesson.id === lesson.id);
        if (isFavorite) {
          return prev.filter((fav) => fav.lesson.id !== lesson.id); // Xóa khỏi danh sách yêu thích
        } else {
          return [...prev, response.data]; // Thêm vào danh sách yêu thích từ phản hồi
        }
      });
      console.log("Favorite lesson toggled:", requestBody);
    } catch (error) {
      console.error("Error toggling favorite lesson:", error);
    }
  };

  // Fetch favorite lessons when the component mounts
  useEffect(() => {
    const fetchFavoriteLessons = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/favorite-lessons?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavoriteLessons(response.data); // Lưu trữ dữ liệu mới vào trạng thái
      } catch (error) {
        console.error("Error fetching favorite lessons:", error);
      }
    };

    fetchFavoriteLessons();
  }, [userId]);

  // Cập nhật hàm kiểm tra bài học yêu thích
  const isLessonFavorite = (lessonId: number) => {
    return favoriteLessons.some(
      (fav) => fav.lesson.id === lessonId && !fav.deleted
    );
  };

  // luu lich su xem
  const saveWatchHistory = useCallback(async () => {
    if (selectedLesson && userId) {
      const requestBody = {
        lessonId: selectedLesson.id,
        userId: userId,
        watchedTime: watchedTime,
      };

      try {
        await axiosInstance.post(
          "/api/v1/lesson-watch-history/save",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Watch history saved:", requestBody);
      } catch (error) {
        console.error("Error saving watch history:", error);
      }
    }
  }, [selectedLesson, userId, watchedTime]);

  useEffect(() => {
    const fetchLastWatchedTime = async (lessonId: number) => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/lesson-watch-history/get?lessonId=${lessonId}&userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const lastWatchedTime = response.data;
        setInitialWatchTime(lastWatchedTime);
      } catch (error) {
        console.error("Error fetching last watched time:", error);
        setInitialWatchTime(0);
      }
    };
    if (selectedLesson) {
      fetchLastWatchedTime(selectedLesson.id);
    }
  }, [selectedLesson, userId]);

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
          const fetchedChapters = response.data.result;
          setChapters(fetchedChapters);

          if (
            fetchedChapters.length > 0 &&
            fetchedChapters[0].lessons.length > 0
          ) {
            setSelectedLesson(fetchedChapters[0].lessons[0]);
          }
          // Mở tất cả các chương
          setExpandedChapters(
            fetchedChapters.map((chapter: { id: any }) => chapter.id)
          );
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

  // lay thoi gian xem hien tai
  useEffect(() => {
    const videoElement = document.getElementById(
      "video-player"
    ) as HTMLVideoElement;

    const handleTimeUpdate = () => {
      if (videoElement) {
        setWatchedTime(videoElement.currentTime);
        setVideoDuration(videoElement.duration);

        // Kiểm tra nếu thời gian còn lại dưới 1 phút
        if (videoDuration - videoElement.currentTime <= 60) {
          saveProgress();
        }
      }
    };

    let intervalId: NodeJS.Timeout;

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement.currentTime = initialWatchTime;
      });

      // Gọi API mỗi 60 giây thay vì mỗi lần watchedTime thay đổi
      intervalId = setInterval(() => {
        saveWatchHistory();
      }, 60000); // 60 giây
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
      clearInterval(intervalId);
      saveWatchHistory(); // Lưu lại khi rời khỏi trang
    };
  }, [selectedLesson, saveWatchHistory, initialWatchTime]);

  // luu lich su khi exit
  useBeforeUnload(() => {
    saveWatchHistory();
  });

  // xu ly khi click vao lesson
  const handleLessonClick = (lesson: Lesson) => {
    saveWatchHistory();
    setSelectedLesson(lesson);
    setWatchedTime(0);
    setInitialWatchTime(0);
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const findPreviousLesson = () => {
    if (!selectedLesson || chapters.length === 0) return null;
    let found = false;
    for (let i = 0; i < chapters.length; i++) {
      const lessons = chapters[i].lessons;
      for (let j = 0; j < lessons.length; j++) {
        if (lessons[j].id === selectedLesson.id) {
          if (j > 0) {
            return lessons[j - 1]; // Previous lesson in the same chapter
          } else if (i > 0 && chapters[i - 1].lessons.length > 0) {
            return chapters[i - 1].lessons[chapters[i - 1].lessons.length - 1]; // Last lesson of the previous chapter
          }
          found = true;
          break;
        }
      }
      if (found) break;
    }
    return null;
  };

  const findNextLesson = () => {
    if (!selectedLesson || chapters.length === 0) return null;
    let found = false;
    for (let i = 0; i < chapters.length; i++) {
      const lessons = chapters[i].lessons;
      for (let j = 0; j < lessons.length; j++) {
        if (lessons[j].id === selectedLesson.id) {
          if (j < lessons.length - 1) {
            return lessons[j + 1]; // Next lesson in the same chapter
          } else if (
            i < chapters.length - 1 &&
            chapters[i + 1].lessons.length > 0
          ) {
            return chapters[i + 1].lessons[0]; // First lesson of the next chapter
          }
          found = true;
          break;
        }
      }
      if (found) break;
    }
    return null;
  };

  // luu lich su khi back
  const handleNavigateBack = () => {
    saveWatchHistory();
    navigate(-1);
  };
  // luu lich xu khi back next lesson
  const handlePreviousLesson = () => {
    const prevLesson = findPreviousLesson();
    if (prevLesson) {
      saveWatchHistory();
      setSelectedLesson(prevLesson);
      setWatchedTime(0);
    }
  };

  const handleNextLesson = () => {
    const nextLesson = findNextLesson();
    if (nextLesson) {
      saveWatchHistory();
      setSelectedLesson(nextLesson);
      setWatchedTime(0);
    }
  };

  const isLessonLocked = (lesson: Lesson) => {
    const lessonIndex = chapters
      .flatMap((chapter) => chapter.lessons)
      .indexOf(lesson);
    return (
      lessonIndex > 0 &&
      !completedLessons.includes(
        chapters.flatMap((chapter) => chapter.lessons)[lessonIndex - 1].id
      )
    );
  };
  return (
    <div className="course-detail-view">
      <button onClick={handleNavigateBack} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
      </button>
      <h1 className="course-title">{courseName}</h1>
      <div className="content-container">
        {/* Video Section */}
        <div className="video-container">
          {selectedLesson ? (
            <video
              id="video-player"
              key={selectedLesson.id}
              controls
              ref={videoRef}
              preload="metadata"
              className="video-player"
              style={{
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
          ) : (
            <div className="empty-video">
              <img
                src="/path/to/placeholder_image.png"
                alt="No video selected"
              />
            </div>
          )}
          {selectedLesson && (
            <div className="lesson-title">
              <h2>
                {"Bài " +
                  selectedLesson.lessonSequence +
                  ": " +
                  selectedLesson.title}
              </h2>
            </div>
          )}
          <div className="lesson-navigation">
            <button
              className="nav-button"
              onClick={handlePreviousLesson}
              disabled={!findPreviousLesson()}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Trước
            </button>
            <button
              className="nav-button"
              onClick={handleNextLesson}
              disabled={
                watchedTime > 60 ||
                (selectedLesson && completedLessons.includes(selectedLesson.id))
                  ? false
                  : !findNextLesson()
              }
            >
              Sau <FontAwesomeIcon icon={faChevronRight} />
            </button>

            {/* them danh sach yeu thich */}
            {isLoggedIn && selectedLesson && (
              <button
                className={`fav-button ${
                  isLessonFavorite(selectedLesson.id) ? "active" : ""
                }`}
                onClick={() => toggleFavorite(selectedLesson)}
              >
                {isLessonFavorite(selectedLesson.id)
                  ? "Xóa khỏi danh sách yêu thích "
                  : "Thêm vào danh sách yêu thích"}
                <FontAwesomeIcon
                  icon={
                    isLessonFavorite(selectedLesson.id) ? faStar : faStarHalfAlt
                  }
                  style={{ marginLeft: "8px" }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Chapters Section */}
        <div className="chapters-container">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="chapter">
              <div
                className="chapter-header"
                onClick={() => toggleChapter(chapter.id)}
              >
                <h2 className="chapter-title">
                  Chương {chapter.chapterSequence}. {chapter.title}
                  <FontAwesomeIcon
                    icon={
                      expandedChapters.includes(chapter.id)
                        ? faChevronUp
                        : faChevronDown
                    }
                    className="toggle-icon"
                  />
                </h2>
              </div>
              {expandedChapters.includes(chapter.id) && (
                <ul className="lesson-list">
                  {chapter.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      onClick={() =>
                        !isLessonLocked(lesson) && handleLessonClick(lesson)
                      }
                      className={`lesson-item ${
                        selectedLesson?.id === lesson.id ? "active" : ""
                      } ${isLessonLocked(lesson) ? "locked" : ""}`}
                    >
                      Bài {lesson.lessonSequence}. {lesson.title}
                      {isLessonLocked(lesson) && (
                        <FontAwesomeIcon
                          icon={faLock}
                          style={{
                            marginLeft: "8px",
                            color: "gray",
                            fontSize: "13px",
                          }}
                        />
                      )}
                      {completedLessons.includes(lesson.id) && (
                        <span
                          style={{
                            color: "green",
                            marginLeft: "8px",
                            fontSize: "20px",
                          }}
                        >
                          ✔
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailViewPro;
