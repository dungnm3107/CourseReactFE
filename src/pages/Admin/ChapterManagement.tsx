import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  TablePagination,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; // Import icons
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../service/AuthContext";
import { ToastContainer, toast } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "../../assets/css/chapterManagement.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


interface Chapter {
  id: number;
  courseId: number;
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

const ChapterManagement: React.FC = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { avatar, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states for add/edit chapter

  const [openModal, setOpenModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [chapterIdToDelete, setChapterIdToDelete] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Chapter>>({
    id: undefined, 
    courseId: courseId ? parseInt(courseId) : 0,
    title: "",
    description: "",
    chapterSequence: 0,
  });
  
  const handleBackToCourses = () => {
    const { from } = location.state || {};
    if (from) {
      navigate(from.pathname + from.search, {
        state: {
          page: from.page,
          rowsPerPage: from.rowsPerPage,
        },
      });
    } else {
      navigate("/admin/course-management");
    }
  };
  
  useEffect(() => {
    fetchChapters();
  }, [page, rowsPerPage]);

  const fetchChapters = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/chapter/get/${courseId}`,
        {
          params: {
            page: page + 1,
            limit: rowsPerPage,
          },
        }
      );
      setChapters(response.data.result);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setFormData({
      id: chapter.id, 
      courseId: chapter.courseId,
      title: chapter.title,
      description: chapter.description,
      chapterSequence: chapter.chapterSequence,
    });
    setOpenModal(true);
  };
  

 

  const handleSave = async () => {
    if (formData.id) {
      // Cập nhật chapter
      try {
        await axiosInstance.put(
          `/api/v1/chapter/update`,
          {
            idChapter: formData.id, 
            title: formData.title,
            description: formData.description,
            chapterSequence: formData.chapterSequence,
            courseId: formData.courseId
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOpenModal(false);
        fetchChapters();
        toast.success("Cập nhật chương thành công!"); 
      } catch (error) {
        console.error("Lỗi khi cập nhật chương:", error);
        toast.error("Lỗi khi cập nhật chương."); 
      }
    } else {
      // Tạo mới chapter
      const isSequenceExist = chapters.some(
        (chapter) => chapter.chapterSequence === formData.chapterSequence
      );
      
      if (isSequenceExist) {
        toast.error("Chapter sequence đã tồn tại, vui lòng chọn giá trị khác!"); 
        return; 
      }
      try {
        await axiosInstance.post(
          `/api/v1/chapter/save`,
          {
            ...formData,
            courseId: courseId ? parseInt(courseId) : 0, // Đảm bảo có courseId khi tạo mới
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOpenModal(false);
        fetchChapters();
        toast.success("Tạo mới chương thành công!"); 
      } catch (error) {
        console.error("Lỗi khi tạo chương:", error);
        toast.error("Lỗi khi tạo chương.");
      }
    }
  };
  
  
  const handleOpenModal = () => {
    setSelectedChapter(null);
    setFormData({
      id: undefined, 
      courseId: courseId ? parseInt(courseId) : 0, 
      title: "",
      description: "",
      chapterSequence: 0,
    });
    setOpenModal(true);
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);
  };

   // delete chapter
   const handleDeleteChapter = (chapterId: number) => {
    setChapterIdToDelete(chapterId);
    setOpenConfirmModal(true);
  };

  const confirmDeleteChapter = async () => {
    if (chapterIdToDelete !== null) {
      try {
        await axiosInstance.delete(`/api/v1/chapter/${chapterIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchChapters();
        toast.success("Chương đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa chương:", error);
        toast.error("Xóa chương không thành công!");
      } finally {
        setOpenConfirmModal(false);
        setChapterIdToDelete(null);
      }
    }
  };
  return (
    <AdminLayout avatar={avatar} role={role}>
      <div className="container-content">
        <h1>QUẢN LÝ CHƯƠNG</h1>
        <div style={{ textAlign: "left"}}>
          <IconButton onClick={handleBackToCourses} style={{ fontSize: "16px", fontWeight: "bold" }}>
            <ArrowBackIcon /> Quay lại
          </IconButton>
        </div>
        <div className="chapter-button-container">
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Thêm mới chương
          </Button>
        </div>
        <div className="chapter-table-container">
          <table className="chapter-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-title">Tiêu đề</th>
                <th className="col-desc">Mô tả</th>
                <th className="col-sequence">Thứ tự</th>
                <th className="col-lessons">Số lượng bài học</th>
                <th className="col-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td className="col-id">{chapter.id}</td>
                  <td className="col-title">{chapter.title}</td>
                  <td className="col-desc">{chapter.description}</td>
                  <td className="col-sequence">{chapter.chapterSequence}</td>
                  <td className="col-lessons">{chapter.lessons.length}</td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <IconButton onClick={() => handleEdit(chapter)} sx={{ color: "blue" }}>
                        <Edit sx={{ color: "blue" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteChapter(chapter.id)} sx={{ color: "red" }}>
                        <Delete sx={{ color: "red" }} />
                      </IconButton>
                      <Button onClick={() => navigate(`/admin/courses/${courseId}/chapters/${chapter.id}/lessons`)}>
                        Lessons
                      </Button>
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
          count={chapters.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </div>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box className="modal-box">
            <h2>{selectedChapter ? "Chỉnh sửa Chapter" : "Thêm Chapter"}</h2>
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
              label="Mô tả"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Thứ tự"
              type="number"
              value={formData.chapterSequence}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  chapterSequence: parseInt(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              {selectedChapter ? "Cập nhật" : "Lưu"}
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
            <h2>Xác nhận xóa chương</h2>
            <p>Bạn có chắc chắn muốn xóa chương này?</p>
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
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default ChapterManagement;
