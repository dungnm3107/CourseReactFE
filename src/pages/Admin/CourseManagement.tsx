import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../service/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "../../assets/css/courseManagement.css";
import {
  Modal,
  Box,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate, useLocation } from "react-router-dom";
import Hls from "hls.js";
import useHlsPlayer from "../../hooks/useHlsPlayer";
interface Course {
  id: number;
  title: string;
  description: string;
  coursePrice: number;
  cover: string;
  courseType: "FREE" | "PAID";
  videoUrl: string;
  createdAt: string;
  createBy: string;
  idUserCreate: number | null;
}

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { avatar, role, userId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    idUserCreate: userId,
    title: "",
    description: "",
    coursePrice: 0,
    cover: "",
    courseType: "FREE",
    videoUrl: "",
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
  const [isUploading, setIsUploading] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [originalVideo, setOriginalVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  useHlsPlayer(previewVideoUrl, videoRef);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (location.state) {
      const { page: savedPage, rowsPerPage: savedRowsPerPage } =
        location.state as any;
      if (savedPage !== undefined && savedRowsPerPage !== undefined) {
        setPage(savedPage);
        setRowsPerPage(savedRowsPerPage);
      }
    }
  }, [location.state]);

  const fetchCourses = async () => {
    try {
      let response;

      if (searchKeyword.trim() === "") {
        // Gọi API lấy tất cả khóa học, yêu cầu token
        response = await axiosInstance.get("/api/v1/course/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // Gọi API tìm kiếm, không yêu cầu token
        response = await axiosInstance.get(
          `/api/v1/course/search?keyword=${encodeURIComponent(searchKeyword)}`
        );
      }

      // Xử lý videoUrl nếu có
      const coursesWithSignedUrls = await Promise.all(
        response.data.map(async (course: Course) => {
          if (course.videoUrl) {
            const signedUrlResponse = await axiosInstance.get(
              `/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(
                course.videoUrl
              )}`
            );
            return { ...course, videoUrl: signedUrlResponse.data };
          }
          return course;
        })
      );

      setCourses(coursesWithSignedUrls); // Cập nhật danh sách khóa học
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
  };
  useEffect(() => {
    fetchCourses(); // Lấy tất cả khóa học khi vào trang lần đầu
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses(); // Gọi lại khi searchKeyword thay đổi
    }, 300); // Thêm độ trễ để giảm số lần gọi API không cần thiết
    return () => clearTimeout(timeoutId); // Xóa timeout khi unmount
  }, [searchKeyword]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true); // Bắt đầu quá trình upload
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        //  Gửi yêu cầu tải lên video
        const uploadResponse = await axiosInstance.post(
          "/api/v1/video/gcs/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const nameUrl = uploadResponse.data; //name video
        console.log("Uploaded video URL: ", nameUrl);

        const signedUrlResponse = await axiosInstance.get(
          `/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(nameUrl)}`
        );

        const signedUrl = signedUrlResponse.data; // URL ký kết
        console.log("Signed video URL: ", signedUrl);

        // Cập nhật URL video
        if (openEditModal && editCourse) {
          setOriginalVideo(nameUrl);
          setEditCourse((prevEditCourse) => ({
            ...prevEditCourse!,
            videoUrl: signedUrl, // Cập nhật videoUrl cho editCourse
          }));
        } else {
          setOriginalVideo(nameUrl);
          setNewCourse((prevNewCourse) => ({
            ...prevNewCourse,
            videoUrl: signedUrl, // Cập nhật videoUrl cho newCourse
          }));
        }

        toast.success("Tải video thành công!"); // Thông báo khi video tải lên thành công
      } catch (error: any) {
        console.error("Error uploading video:", error);
        toast.error("Lỗi khi tải video lên Google Cloud Storage!");
      } finally {
        setIsUploading(false); // Kết thúc quá trình upload
      }
    }
  };
  console.log("url signed video", previewVideoUrl);

  //xem video
  const handleVideoPreview = (videoUrl: string) => {
    console.log("Video URL:", videoUrl); // Thêm dòng này để debug
    setPreviewVideoUrl(videoUrl);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]); // Tạo URL tạm thời cho ảnh
      setSelectedImage(imageUrl); // Cập nhật trạng thái với URL ảnh
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
        setNewCourse((prev) => ({ ...prev, cover: coverUrl })); // nhận url images từ server
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
        {
          ...newCourse,
          idUserCreate: userId,
          cover: coverUrl,
          videoUrl: originalVideo,
        },
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
        videoUrl: "",
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
        setEditCourse((prev) => ({ ...prev!, cover: coverUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Tải ảnh bìa mới không thành công!");
        return;
      }
    }

    if (editCourse) {
      console.log("course data" + editCourse.courseType); //PAID
      try {
        await axiosInstance.put(
          `/api/v1/course/update`,
          {
            ...editCourse,
            idCourse: editCourse.id,
            idUserUpdate: userId,
            courseType: editCourse.courseType,
            cover: coverUrl,
            videoUrl: originalVideo,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Payload sent to API:", {
          ...editCourse,
          idCourse: editCourse.id,
          idUserUpdate: userId,
          courseType: editCourse.courseType,
          cover: coverUrl,
          videoUrl: originalVideo,
        });

        fetchCourses();
        setEditCourse(null);
        setOpenEditModal(false);
        toast.success("Khóa học đã được cập nhật thành công!");
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Cập nhật khóa học không thành công!");
      }
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleViewChapters = (courseId: number) => {
    navigate(`/admin/chapter-management/${courseId}`, {
      state: {
        from: {
          pathname: location.pathname,
          search: location.search,
          page,
          rowsPerPage,
        },
      },
    });
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

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <AdminLayout avatar={avatar} role={role}>
        <div className="container-content">
          <h1>QUẢN LÝ KHÓA HỌC</h1>
          <div
            className="course-action-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Tìm kiếm khóa học..."
                variant="outlined"
                size="small"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchKeyword && (
                        <IconButton onClick={clearSearch} size="small">
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
              style={{ marginRight: "30px" }}
            >
              Thêm khóa học
            </Button>
          </div>

          {/*  Modal thêm mới course */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              className="modal-box"
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
                {/* Hiển thị ảnh đã chọn */}
                {selectedImage && (
                  <div className="form-group">
                    <label>Xem ảnh bìa</label>
                    <img
                      src={selectedImage}
                      alt="Ảnh bìa đã chọn"
                      style={{
                        width: "200px",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                )}
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

                <div className="form-group">
                  <label htmlFor="video">Chọn Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload} // Hàm xử lý khi chọn video
                  />
                </div>
                {/* Video Preview Section */}
                {newCourse.videoUrl ? (
                  <>
                    <label>Xem Video</label>
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
                        ref={(videoRef) => {
                          if (videoRef) {
                            const hls = new Hls();
                            hls.loadSource(newCourse.videoUrl);
                            hls.attachMedia(videoRef);
                          }
                        }}
                        controls
                        preload="metadata" // tải dữ liệu trước để view cho tối ưu
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isUploading || !newCourse.videoUrl} // Chỉ cho lưu khi upload xong và có URL video
                >
                  {isUploading ? "Đang tải video..." : "Lưu"}
                </Button>
              </form>
            </Box>
          </Modal>
          {/* Modal chỉnh sửa course */}
          <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <Box
              className="modal-box"
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
                      {editCourse.cover && (
                        <img
                          src={editCourse.cover}
                          alt="Ảnh bìa hiện tại"
                          style={{
                            width: 200,
                            height: "auto",
                            marginBottom: 10,
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
                      value={editCourse?.courseType || "FREE"}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="FREE">Miễn phí</option>
                      <option value="PAID">Trả phí</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="video">Video hiện tại</label>
                    {editCourse.videoUrl ? (
                      <video
                        ref={(videoRef) => {
                          if (videoRef) {
                            const hls = new Hls();
                            hls.loadSource(editCourse.videoUrl);
                            hls.attachMedia(videoRef);
                          }
                        }}
                        controls
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                    ) : (
                      <p>Chưa có video.</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-video">Chọn Video mới</label>
                    <input
                      type="file"
                      id="new-video"
                      accept="video/*"
                      onChange={handleVideoUpload} // Hàm xử lý khi chọn video mới
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isUploading || !editCourse.videoUrl} // Chỉ cho lưu khi upload xong và có URL video
                  >
                    {isUploading ? "Đang tải video..." : "Cập nhật"}
                  </Button>
                </form>
              )}
            </Box>
          </Modal>
          {/* Modal xóa course */}
          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box
              className="modal-box"
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

          <div className="course-table-container">
            <table className="course-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-title">Tiêu đề</th>
                  <th className="col-desc">Mô tả</th>
                  <th className="col-price">Giá</th>
                  <th className="col-type">Loại</th>
                  <th className="col-cover">Ảnh bìa</th>
                  <th className="col-video">Video</th>
                  <th className="col-actions">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <tr key={course.id}>
                      <td className="col-id">{course.id}</td>
                      <td className="col-title">{course.title}</td>
                      <td className="col-desc">
                        <div className="description-cell">
                          {course.description}
                        </div>
                      </td>
                      <td className="col-price">{course.coursePrice}đ</td>
                      <td className="col-type">{course.courseType}</td>
                      <td className="col-cover">
                        <div className="image-cell">
                          {course.cover && (
                            <img
                              src={course.cover}
                              alt="Ảnh bìa"
                              style={{ width: "180px", height: "100px" }}
                              onClick={() => handleImageClick(course.cover)}
                            />
                          )}
                        </div>
                      </td>
                      <td className="col-video">
                        <div className="video-cell">
                          {course.videoUrl ? (
                            <Button
                              onClick={() =>
                                handleVideoPreview(course.videoUrl)
                              }
                            >
                              Xem video
                            </Button>
                          ) : (
                            <span>Chưa có video</span>
                          )}
                        </div>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          <Button onClick={() => handleEditCourse(course)}>
                            <EditIcon sx={{ color: "blue" }} />
                          </Button>
                          <Button onClick={() => handleDeleteCourse(course.id)}>
                            <DeleteIcon sx={{ color: "red" }} />
                          </Button>
                          <Button onClick={() => handleViewChapters(course.id)}>
                            Chapters
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={courses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
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
                backgroundColor: "#e0e0e0", // màu nền tổng thể của khung ngoài video
                marginTop: "2%",
              }}
            >
              {previewVideoUrl ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0e0e0", // Màu xám cho phần ngoài khung video
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    ref={(videoRef) => {
                      if (videoRef) {
                        const hls = new Hls();
                        hls.loadSource(previewVideoUrl);
                        hls.attachMedia(videoRef);
                      }
                    }}
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
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default CourseManagement;
