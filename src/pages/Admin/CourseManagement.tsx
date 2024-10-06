import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../service/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "../../assets/css/courseManagement.css";
import { BASE_API_URL } from "../../constants/Constants";
import {
  Modal,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: "FREE" | "PAID";
  createdAt: string;
  createBy: string;
  idUserCreate: number | null;
}

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { avatar, role, userId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    idUserCreate: userId,
    title: "",
    description: "",
    coursePrice: 0,
    cover: "",
    courseType: "FREE",
    createdAt: "",
    createBy: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/course/all");
      setCourses(response.data.result);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // add new course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverUrl = "";

    if (selectedFile) {
      // Upload image to the server
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axiosInstance.post(
          "/api/v1/course/upload-cover",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        coverUrl = uploadResponse.data; 
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Tải ảnh lên không thành công!");
        return;
      }
    }

    try {
      // Gửi thông tin khóa học và URL ảnh bìa lên server
      await axiosInstance.post(
        "/api/v1/course/save",
        { ...newCourse, idUserCreate: userId, cover: coverUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCourses();
      setNewCourse({
        idUserCreate: userId,
        title: "",
        description: "",
        coursePrice: 0,
        cover: "",
        courseType: "FREE",
        createdAt: "",
        createBy: "",
      });
      setOpenModal(false);
      toast.success("Khóa học đã được thêm thành công!");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Thêm khóa học không thành công!");
    }
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  // update course

  const handleEditCourse = (course: Course) => {
    setEditCourse({ ...course });
    setOpenEditModal(true);
  };
  const handleEditInputChange = (e: any) => {
    const { name, value } = e.target;
    if (editCourse) {
      setEditCourse((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverUrl = editCourse?.cover || "";

    if (selectedFile) {
      // Upload new cover image if a file is selected
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axiosInstance.post(
          "/api/v1/course/upload-cover",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        coverUrl = uploadResponse.data; // URL returned from the API
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Tải ảnh bìa mới không thành công!");
        return;
      }
    }

    if (editCourse) {
      try {
        await axiosInstance.put(
          `/api/v1/course/update`,
          {
            ...editCourse,
            idCourse: editCourse.id, // Include the course ID
            idUserUpdate: userId, // User ID
            cover: coverUrl, // Updated cover URL
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCourses(); // Refresh course list
        setEditCourse(null);
        setOpenEditModal(false);
        toast.success("Khóa học đã được cập nhật thành công!");
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Cập nhật khóa học không thành công!");
      }
    }
  };

  // Handle file selection for editing cover image
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleViewChapters = (courseId: number) => {
    navigate(`/admin/chapter-management/${courseId}`);
  };

  // delete course

  const handleDeleteCourse = (courseId: number) => {
    setCourseIdToDelete(courseId);
    setOpenConfirmModal(true);
  };

  const confirmDeleteCourse = async () => {
    if (courseIdToDelete !== null) {
      try {
        await axiosInstance.delete(`/api/v1/course/${courseIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchCourses();
        toast.success("Khóa học đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        toast.error("Xóa khóa học không thành công!");
      } finally {
        setOpenConfirmModal(false);
        setCourseIdToDelete(null);
      }
    }
  };

  // preview images
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenPreviewModal(true);
  };

  const handleCloseModal = () => {
    setOpenPreviewModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <AdminLayout avatar={avatar} role={role}>
        <div className="container-content">
          <h1>Quản lý khóa học</h1>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Thêm khóa học
            </Button>
          </div>
          {/* Add new Course Modal */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                padding: 4,
                maxWidth: 600,
                margin: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <h2>Thêm mới khóa học</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Tiêu đề</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Mô tả</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={newCourse.description}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="coursePrice">Giá</label>
                  <input
                    type="number"
                    name="coursePrice"
                    id="coursePrice"
                    value={newCourse.coursePrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cover">Ảnh bìa</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="courseType">Loại khóa học</label>
                  <select
                    name="courseType"
                    id="courseType"
                    value={newCourse.courseType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="FREE">Miễn phí</option>
                    <option value="PAID">Trả phí</option>
                  </select>
                </div>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Edit Course Modal */}
          <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <Box
              sx={{
                padding: 4,
                maxWidth: 600,
                margin: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <h2>Cập nhật khóa học</h2>
              {editCourse && (
                <form onSubmit={handleUpdateCourse}>
                  <div className="form-group">
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={editCourse.title}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                      name="description"
                      id="description"
                      value={editCourse.description}
                      onChange={handleEditInputChange}
                      required
                      rows={4}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="coursePrice">Giá</label>
                    <input
                      type="number"
                      name="coursePrice"
                      id="coursePrice"
                      value={editCourse.coursePrice}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cover">Ảnh bìa hiện tại</label>
                    <div>
                      {`${BASE_API_URL}${editCourse.cover}` && ( 
                        <img
                          src={`${BASE_API_URL}${editCourse.cover}`} 
                          alt="Ảnh bìa hiện tại"
                          style={{
                            width: "200px",
                            height: "auto",
                            marginBottom: "10px",
                          }} 
                        />
                      )}
                    </div>
                    <label htmlFor="new-cover">Chọn ảnh mới</label>
                    <input
                      type="file"
                      id="new-cover"
                      accept="image/*"
                      onChange={handleEditFileChange} // Hàm xử lý khi chọn ảnh mới
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="courseType">Loại khóa học</label>
                    <select
                      name="courseType"
                      id="courseType"
                      value={editCourse.courseType}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="FREE">Miễn phí</option>
                      <option value="PAID">Trả phí</option>
                    </select>
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Cập nhật
                  </Button>
                </form>
              )}
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
              <h2>Xác nhận xóa khóa học</h2>
              <p>Bạn có chắc chắn muốn xóa khóa học này?</p>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmDeleteCourse}
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

          {/* Modal hiển thị ảnh */}
          <Modal open={openPreviewModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: 4,
                maxWidth: 800,
                width: "90%",
                bgcolor: "background.paper",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: "8px" }} 
                />
              )}
            </Box>
          </Modal>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Tiêu đề</TableCell>
                  <TableCell align="center">Mô tả</TableCell>
                  <TableCell align="center">Giá</TableCell>
                  <TableCell align="center">Ảnh bìa</TableCell>
                  <TableCell align="center">Loại khóa học</TableCell>
                  <TableCell align="center">Ngày tạo</TableCell>
                  <TableCell align="center">Người tạo</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow key={course.id}>
                      <TableCell align="center">{course.id}</TableCell>
                      <TableCell align="center">{course.title}</TableCell>
                      <TableCell align="center">{course.description}</TableCell>
                      <TableCell align="center">
                        {course.coursePrice}đ
                      </TableCell>
                      <TableCell align="center">
                        <img
                          src={`${BASE_API_URL}${course.cover}`}
                          style={{ width: "180px", cursor: "pointer" }}
                          onClick={() =>
                            handleImageClick(`${BASE_API_URL}${course.cover}`)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {course.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                      </TableCell>

                      <TableCell align="center">
                        {new Date(course.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell align="center">{course.createBy}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleEditCourse(course)}
                          sx={{ color: "blue" }}
                        >
                          <EditIcon sx={{ color: "blue" }} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourse(course.id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </Button>
                        <Button
                          onClick={() => handleViewChapters(course.id)}
                          sx={{ color: "green" }}
                        >
                          Quản lý Chapters
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default CourseManagement;
