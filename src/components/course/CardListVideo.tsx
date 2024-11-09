import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { Modal, Box } from "@mui/material";
import "../../assets/css/cardListVideo.css"; // Make sure to copy the relevant CSS

interface LessonResponse {
  idLesson: number;
  idChapter: number;
  title: string;
  lessonSequence: number;
  content: string;
  videoUrl: string;
}

export default function CardListVideo() {
  const [watchedLessons, setWatchedLessons] = useState<LessonResponse[]>([]);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchWatchedLessons = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/lesson-watch-history/top8-watched");
        setWatchedLessons(response.data);
      } catch (error) {
        console.error("Error fetching watched lessons:", error);
      }
    };

    fetchWatchedLessons();
  }, []);

  const handleOpenModal = (videoUrl: string) => {
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
    
    <div className="vd">
        <div style={{ height: "44px" }}>
        <h6 className="pt-3">
          <span
            style={{ fontSize: "28px", color: "black", fontWeight: "bold" }}
          >
            Video nổi bật
          </span>
        </h6>
      </div>

      <div className="video-card-container">
        <div className="video-lessons-grid">
          {watchedLessons.map((lesson) => (
            <div
              key={lesson.idLesson}
              className="video-lesson-card"
              onClick={() => handleOpenModal(lesson.videoUrl)}
            >
              <video
                src={lesson.videoUrl}
                controls
                preload="none"
                className="video-thumbnail"
                ref={videoRef}
                muted
              />
              <h3 className="video-title">{lesson.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for video playback */}
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
}