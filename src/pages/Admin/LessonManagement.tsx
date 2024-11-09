import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../service/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/lessonManagement.css";

interface Lesson {
  idLesson: number;
  idChapter: number;
  title: string;
  lessonSequence: number;
  content: string;
  videoUrl: string;
}

const LessonManagement: React.FC = () => {
  const { courseId, chapterId } = useParams(); // Lấy ID khóa học và chương từ URL
  const { avatar, role } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [lessonIdToDelete, setLessonIdToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Lesson>>({
    idLesson: undefined,
    idChapter: chapterId ? parseInt(chapterId) : 0,
    title: "",
    content: "",
    lessonSequence: 1,
    videoUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, [page, rowsPerPage]);

  // Lấy danh sách bài học
  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/lesson/get/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: page + 1,
            limit: rowsPerPage,
          },
        }
      );
       // Gọi API để lấy presignedUrl cho videoUrl
    const lessonsWithPresignedUrls = await Promise.all(response.data.result.map(async (lesson: Lesson) => {
      if (lesson.videoUrl) {
        const presignedUrlResponse = await axiosInstance.get(`/api/v1/video/get-presigned-url?fileUrl=${encodeURIComponent(lesson.videoUrl)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return { ...lesson, videoUrl: presignedUrlResponse.data.url };
      }
      return lesson; 
    }));

      setLessons(lessonsWithPresignedUrls);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu bài học!");
      console.error("Error fetching lessons:", error);
    }
  };

  // Kiểm tra trạng thái và video trước khi lưu
  const handleSave = async () => {
    // Nếu đang upload video hoặc video chưa có URL, báo lỗi
    if (isUploading || !formData.videoUrl) {
      toast.error("Vui lòng tải video trước khi lưu bài học!");
      return;
    }

    try {
    
      const updatedFormData = {
        ...formData,
        idChapter: parseInt(chapterId ? chapterId : "0"),
        videoUrl: originalVideoUrl
      };

      if (formData.idLesson) {
        await axiosInstance.put(`/api/v1/lesson/update`, updatedFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Cập nhật bài học thành công!");
      } else {
        await axiosInstance.post(`/api/v1/lesson/save`, updatedFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Tạo mới bài học thành công!");
      }
      handleCloseModal();
      fetchLessons();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Lỗi khi lưu bài học!");
    }
  };

  // Mở modal và đặt bài học cần chỉnh sửa (nếu có)
  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setFormData({
      idLesson: lesson.idLesson,
      idChapter: lesson.idChapter,
      title: lesson.title,
      lessonSequence: lesson.lessonSequence,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
    });
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setFormData({
      idLesson: undefined,
      idChapter: parseInt(chapterId ? chapterId : "0"),
      title: "",
      content: "",
      lessonSequence: 0,
      videoUrl: "",
    });
    setOpenModal(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // delete chapter
  const handleDeleteLesson = (lessonId: number) => {
    setLessonIdToDelete(lessonId);
    setOpenConfirmModal(true);
  };

  const confirmDeleteChapter = async () => {
    if (lessonIdToDelete !== null) {
      try {
        await axiosInstance.delete(`/api/v1/lesson/${lessonIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchLessons();
        toast.success("Chương đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa chương:", error);
        toast.error("Xóa chương không thành công!");
      } finally {
        setOpenConfirmModal(false);
        setLessonIdToDelete(null);
      }
    }
  };

  // upload video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true); // Bắt đầu quá trình upload
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await axiosInstance.post(
          "/api/v1/video/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const videoUrl = response.data.url;
        console.log("Uploaded video URL: ", videoUrl);

        // Gọi API để lấy presigned URL
        const presignedUrlResponse = await axiosInstance.get(
          `/api/v1/video/get-presigned-url?fileUrl=${encodeURIComponent(videoUrl)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const presignedUrl = presignedUrlResponse.data.url; // URL ký kết

        setOriginalVideoUrl(videoUrl);
        setFormData((prevFormData) => ({
          ...prevFormData,
          videoUrl: presignedUrl,
        }));

        toast.success("Tải video thành công!"); // Thông báo khi video tải lên thành công
      } catch (error: any) {
        console.error("Error uploading video:", error);

        if (error.response && error.response.status === 417) {
          // Kiểm tra lỗi từ backend (417 Expectation Failed)
          toast.error(error.response.data); // Hiển thị thông báo lỗi từ backend
        } else {
          toast.error("Lỗi khi tải video lên S3!");
        }
      } finally {
        setIsUploading(false); // Kết thúc quá trình upload
      }
    }
  };

  //xem video
  const handleVideoPreview = (videoUrl: string) => {
    console.log("Video URL in preview:", videoUrl); // Kiểm tra giá trị videoUrl
    setPreviewVideoUrl(videoUrl);
};

  return (
    <AdminLayout avatar={avatar} role={role}>
      <ToastContainer />
      <div className="container-content">
        <h1>QUẢN LÝ BÀI HỌC</h1>

        <div className="button-container">
          <Button variant="contained" color="primary" onClick={handleAddLesson}>
            Thêm Bài học
          </Button>
        </div>

        <div className="lesson-table-container">
          <table className="lesson-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-title">Tiêu đề</th>
                <th className="col-content">Nội dung</th>
                <th className="col-sequence">Thứ tự</th>
                <th className="col-video">Video</th>
                <th className="col-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.idLesson}>
                  <td className="col-id">{lesson.idLesson}</td>
                  <td className="col-title">{lesson.title}</td>
                  <td className="col-content">{lesson.content}</td>
                  <td className="col-sequence">{lesson.lessonSequence}</td>
                  <td className="col-video">
                    {lesson.videoUrl ? (
                      <Button
                        onClick={() => handleVideoPreview(lesson.videoUrl)}
                        sx={{ color: "blue" }}
                      >
                        Xem video
                      </Button>
                    ) : (
                      "Chưa có video"
                    )}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <IconButton
                        onClick={() => handleEdit(lesson)}
                        sx={{ color: "blue" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteLesson(lesson.idLesson)}
                        sx={{ color: "red" }}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
        <TablePagination
          component="div"
          count={lessons.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </div>
        {/* modal them moi hoac chinh sua bai hoc */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            className="modal-box"
            sx={{ padding: 4, maxWidth: 600, margin: "auto" }}
          >
            <h2>{selectedLesson ? "Chỉnh sửa Bài học" : "Thêm Bài học"}</h2>

            <TextField
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nội dung"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Thứ tự"
              type="number"
              value={formData.lessonSequence}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lessonSequence: parseInt(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />

            {/* Video Preview Section */}
            {formData.videoUrl ? (
              <>
                <label>Video Preview</label>
                <br />
                <Box
                  sx={{
                    width: "100%",
                    maxHeight: "400px",
                    overflow: "hidden", // Ẩn nội dung video thừa
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <video
                    src={formData.videoUrl}
                    controls
                    preload="metadata" // tải dữ liệu trước để view cho tối ưu, thay vì tải toàn bộ
                    style={{
                      maxWidth: "100%",
                      height: "auto", // Tự động điều chỉnh chiều cao để giữ tỷ lệ
                    }}
                  />
                </Box>
              </>
            ) : (
              <p>Chưa có video. Hãy tải lên một video mới.</p>
            )}

            <label> Chọn Video mới</label>
            <br />
            <input type="file" accept="video/*" onChange={handleVideoUpload} />
            <br />
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isUploading || !formData.videoUrl} // Chỉ cho lưu khi upload xong và có URL video
            >
              {isUploading
                ? "Đang tải video..."
                : selectedLesson
                ? "Cập nhật"
                : "Lưu"}
            </Button>
          </Box>
        </Modal>

        {/* Delete Course Modal */}

        <Modal
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
        >
          <Box
            sx={{
              padding: 4,
              maxWidth: 400,
              margin: "auto",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <h2>Xác nhận xóa bài học</h2>
            <p>Bạn có chắc chắn muốn xóa bài học này?</p>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmDeleteChapter}
            >
              Xóa
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenConfirmModal(false)}
            >
              Hủy
            </Button>
          </Box>
        </Modal>
        {/* modal view video  */}
        <Modal
          open={!!previewVideoUrl} // Modal mở khi URL tồn tại
          onClose={() => setPreviewVideoUrl(null)}
        >
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
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Bóng đổ cho video để làm nổi bật
                  }}
                />
              </div>
            ) : (
              <p>Không thể tải video</p>
            )}
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default LessonManagement;
