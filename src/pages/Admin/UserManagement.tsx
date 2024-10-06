import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import "../../assets/css/userManagement.css";
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
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../service/AuthContext";

type User = {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
};

const UserManagement: React.FC = () => {
  const { avatar, role } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    fullName: "",
    userName: "",
    password: "",
    email: "",
    phone: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUserIdToDelete(userId);
    setOpenConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    if (userIdToDelete !== null) {
      try {
        await axiosInstance.delete(`/api/v1/user/${userIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchUsers();
        toast.success("Người dùng đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Xóa người dùng thất bại!");
      } finally {
        setOpenConfirmModal(false);
        setUserIdToDelete(null);
      }
    }
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !newUser.userName ||
      newUser.userName.length < 5 ||
      newUser.userName.length > 50
    ) {
      newErrors.userName = "Tên người dùng phải có từ 5 đến 50 ký tự";
    }
    if (
      !newUser.fullName ||
      newUser.fullName.length < 5 ||
      newUser.fullName.length > 50
    ) {
      newErrors.fullName = "Tên đầy đủ phải dài từ 5 đến 50 ký tự";
    }
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!newUser.password || !passwordPattern.test(newUser.password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ cái viết hoa, 1 chữ số và 1 ký tự đặc biệt";
    }
    if (
      !newUser.email ||
      !/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(
        newUser.email
      )
    ) {
      newErrors.email = "Định dạng email không hợp lệ";
    }
    if (!newUser.phone || !/^0\d{9}$/.test(newUser.phone)) {
      newErrors.phone = "Định dạng số điện thoại không hợp lệ";
    }
    return newErrors;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors
      return;
    }
    try {
      await axiosInstance.post("/api/v1/user/register", newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers(); // Refresh danh sách người dùng
      setNewUser({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        phone: "",
      }); 
      setOpenModal(false); 
      toast.success("Thêm người dùng thành công!"); 
    } catch (error) {
      console.error("Error adding user:", error);
      if (axios.isAxiosError(error) && error.response) {
  
        const errorMessage =
          error.response.data.message || "Thêm người dùng thất bại!";
        toast.error(errorMessage); 
      } else {
        toast.error("Thêm người dùng thất bại!"); 
      }
    }
  };

  const cancelDeleteUser = () => {
    setOpenConfirmModal(false);
    setUserIdToDelete(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };
  return (
    <>
      <AdminLayout avatar={avatar} role={role}>
        <div className="container-content">
          <h1>Quản lý người dùng</h1>
          <div className ="button-container"> 
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Thêm mới user
          </Button>
          </div>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                padding: 0,
                maxWidth: 500,
                margin: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <div className="user-form">
                <h2>Thêm mới user</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">Fullname</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Nhập tên đầy đủ"
                      value={newUser.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.fullName && (
                      <span className="error">{errors.fullName}</span>
                    )}{" "}
                    {/* Display error */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="userName">Username</label>
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      placeholder="Nhập username"
                      value={newUser.userName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.userName && (
                      <span className="error">{errors.userName}</span>
                    )}{" "}
                    {/* Display error */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={newUser.password}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.password && (
                      <span className="error">{errors.password}</span>
                    )}{" "}
                    {/* Display error */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Nhập email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <span className="error">{errors.email}</span>
                    )}{" "}
                    {/* Display error */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      value={newUser.phone}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.phone && (
                      <span className="error">{errors.phone}</span>
                    )}{" "}
                    {/* Display error */}
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </form>
              </div>
            </Box>
          </Modal>

          <Modal open={openConfirmModal} onClose={cancelDeleteUser}>
            <Box
              sx={{
                padding: 4,
                maxWidth: 400,
                margin: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <h2>Xác nhận xóa người dùng</h2>
              <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmDeleteUser}
              >
                Xóa
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancelDeleteUser}
              >
                Hủy
              </Button>
            </Box>
          </Modal>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell align="center">{user.id}</TableCell>
                      <TableCell align="center">{user.fullName}</TableCell>
                      <TableCell align="center">{user.userName}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.phone}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[7, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default UserManagement;
