import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";
import '../../assets/css/favoritesPage.css'; 
import Hls from "hls.js"; 

  
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
  const [hlsInstances, setHlsInstances] = useState<Map<number, Hls>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement | null>>(new Map());

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

   // Sử dụng HLS để phát video từ URL có chữ ký
   useEffect(() => {
    favoriteLessons.forEach((favoriteLesson) => {
      const videoRef = videoRefs.current.get(favoriteLesson.id);
      if (videoRef && Hls.isSupported()) {
        const hls = new Hls();
        const fetchSignedUrl = async () => {
          try {
            const signedUrlResponse = await axiosInstance.get(
              `/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(
                favoriteLesson.lesson.videoUrl
              )}`
            );
            const signedUrl = signedUrlResponse.data;
            hls.loadSource(signedUrl);
            hls.attachMedia(videoRef);
          } catch (error) {
            console.error("Error fetching signed video URL:", error);
          }
        };
        fetchSignedUrl();
        setHlsInstances((prev) => new Map(prev.set(favoriteLesson.id, hls)));
      }
    });

    // Cleanup HLS instances
    return () => {
      hlsInstances.forEach((hls) => hls.destroy());
    };
  }, [favoriteLessons]);

  return (
    <div className="favorites-page">
      <h1>Danh sách bài học yêu thích</h1>
      {favoriteLessons.length === 0 ? (
        <p>Chưa có bài học nào trong danh sách yêu thích.</p>
      ) : (
        
        <div className="video-lessons-favarite">
        {favoriteLessons.map((favoriteLesson) => (
          <div key={favoriteLesson.id} className="video-lesson-card-favorite-wrapper">
            <div
              className="video-lesson-card-favorite"
            >
              <video
                controls
                preload="metadata"
                className="video-thumbnail"
                ref={(el) => {
                  videoRefs.current.set(favoriteLesson.id, el);
                }}
                muted
              />
              <h2 className="video-title">{favoriteLesson.lesson.title}</h2>
            </div>
          </div>
        ))}
      </div>
      
      
      )}

    </div>
  );
};

export default FavoritesPage;