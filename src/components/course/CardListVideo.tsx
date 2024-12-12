import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../config/axios";
import Hls from "hls.js"; // Import Hls.js for HLS streaming
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
  const [hlsInstances, setHlsInstances] = useState<Map<number, Hls>>(new Map()); // Track HLS instances per video
  const videoRefs = useRef<Map<number, HTMLVideoElement | null>>(new Map());

  useEffect(() => {
    const fetchWatchedLessons = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/lesson-watch-history/top8-watched"
        );
        setWatchedLessons(response.data);
      } catch (error) {
        console.error("Error fetching watched lessons:", error);
      }
    };

    fetchWatchedLessons();
  }, []);

  useEffect(() => {
    // Initialize HLS.js for each video after lessons are fetched
    watchedLessons.forEach((lesson) => {
      const videoRef = videoRefs.current.get(lesson.idLesson);
      if (videoRef && Hls.isSupported()) {
        const hls = new Hls();
        const fetchSignedUrl = async () => {
          try {
            const signedUrlResponse = await axiosInstance.get(
              `/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(
                lesson.videoUrl
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
        setHlsInstances((prev) => new Map(prev.set(lesson.idLesson, hls)));
      }
    });

    // Cleanup HLS instances when the component is unmounted
    return () => {
      hlsInstances.forEach((hls) => hls.destroy());
    };
  }, [watchedLessons]);

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
            <div key={lesson.idLesson} className="video-lesson-card-wrapper">
              <div className="video-lesson-card">
                <video
                  controls
                  preload="metadata"
                  className="video-thumbnail"
                  ref={(el) => {
                    videoRefs.current.set(lesson.idLesson, el);
                  }}
                  muted
                />
                <h3 className="video-title">{lesson.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
