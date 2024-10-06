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
      setLessons(response.data.result);
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
      // Include idChapter in the formData
      const updatedFormData = {
        ...formData,
        idChapter: parseInt(chapterId ? chapterId : "0"), // Ensure idChapter is correctly set
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

        setFormData((prevFormData) => ({
          ...prevFormData,
          videoUrl: videoUrl,
        }));

        toast.success("Tải video thành công!"); // Thông báo khi video tải lên thành công
        setIsUploading(false); // Kết thúc quá trình upload
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error("Lỗi khi tải video lên S3!");
        setIsUploading(false);
      }
    }
  };
  //xem video
  const handleVideoPreview = (videoUrl: string) => {
    console.log("Video URL:", videoUrl); // Thêm dòng này để debug
    setPreviewVideoUrl(videoUrl);
  };

  return (
    <AdminLayout avatar={avatar} role={role}>
      <ToastContainer />
      <div className="container-content">
        <h1>Quản lý Bài học</h1>

        <div className="button-container">
          <Button variant="contained" color="primary" onClick={handleAddLesson}>
            Thêm Bài học
          </Button>
        </div>

        {/* Danh sách Bài học */}
        <div className="table-container">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Tiêu đề</TableCell>
                  <TableCell align="center">Nội dung</TableCell>
                  <TableCell align="center">Thứ tự</TableCell>
                  <TableCell align="center">Video</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.idLesson}>
                    <TableCell align="center">{lesson.idLesson}</TableCell>
                    <TableCell align="center">{lesson.title}</TableCell>
                    <TableCell align="center">{lesson.content}</TableCell>
                    <TableCell align="center">
                      {lesson.lessonSequence}
                    </TableCell>
                    <TableCell align="center">
                      {lesson.videoUrl ? (
                        <Button
                          onClick={() => handleVideoPreview(lesson.videoUrl)}
                        >
                          Xem video
                        </Button>
                      ) : (
                        "Chưa có video"
                      )}
                    </TableCell>
                    <TableCell align="center">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
          component="div"
          count={lessons.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
                    maxHeight: "400px", // Giới hạn chiều cao của khung video
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
                    style={{
                      maxWidth: "100%", // Chiều rộng tối đa là 100% so với khung
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
              height: 800, 
              margin: "auto",
              bgcolor: "background.paper",
              borderRadius: 2,
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {previewVideoUrl ? (
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                style={{ width: "100%", height: "100%" }} 
              />
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
