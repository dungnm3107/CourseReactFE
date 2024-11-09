import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";
import { Modal, Box } from "@mui/material"; // Import Modal và Box từ MUI
import '../../assets/css/favoritesPage.css'; // Import file CSS

interface Lesson {
  id: number;
  idChapter: number;
  title: string;
  lessonSequence: number;
  content: string;
  videoUrl: string;
}

interface FavoriteLessonResponse {
  id: number;
  lesson: Lesson;
}

const FavoritesPage: React.FC = () => {
  const { userId } = useAuth();
  const [favoriteLessons, setFavoriteLessons] = useState<FavoriteLessonResponse[]>([]);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); 

  useEffect(() => {
    const fetchFavoriteLessons = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/favorite-lessons?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFavoriteLessons(response.data);
      } catch (error) {
        console.error("Error fetching favorite lessons:", error);
      }
    };

    fetchFavoriteLessons();
  }, [userId]);

  const handleOpenModal = (videoUrl: string) => {
    // Pause the currently playing video if it exists
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setPreviewVideoUrl(videoUrl);
    setOpenVideoModal(true);
  };

  const handleCloseModal = () => {
    setOpenVideoModal(false);
    setPreviewVideoUrl(null);
  };

  return (
    <div className="favorites-page">
      <h1>Danh sách bài học yêu thích</h1>
      {favoriteLessons.length === 0 ? (
        <p>Chưa có bài học nào trong danh sách yêu thích.</p>
      ) : (
        <div className="video-grid">
          {favoriteLessons.map((favoriteLesson) => (
            <div key={favoriteLesson.id} className="video-item" onClick={() => handleOpenModal(favoriteLesson.lesson.videoUrl)}>
              <video
                src={favoriteLesson.lesson.videoUrl}
                controls
                preload="none"
                className="video-thumbnail"
                ref={videoRef} 
                muted
              />
              <h2 className="video-title">{favoriteLesson.lesson.title}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Modal xem video */}
      <Modal open={openVideoModal} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 4,
            maxWidth: 1500,
            width: 1200,
            height: 700,
            margin: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0",
            marginTop: "2%",
          }}
        >
          {previewVideoUrl ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <video
                src={previewVideoUrl}
                controls
                preload="metadata"
                style={{
                  width: "90%",
                  height: "90%",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          ) : (
            <p>Không thể tải video</p>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default FavoritesPage;