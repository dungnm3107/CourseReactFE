import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import "../../assets/css/userManagement.css";
import {
  Modal,
  Box,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../service/AuthContext";
import ClearIcon from "@mui/icons-material/Clear";

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
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearSearch = () => {
    setSearchKeyword("");
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(); // Gọi lại khi searchKeyword thay đổi
    }, 300);

    return () => clearTimeout(timeoutId); // Xóa timeout khi unmount hoặc khi searchKeyword thay đổi
  }, [searchKeyword]); 


  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/user/search?username=${searchKeyword}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
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
    setPage(0); // Reset to the first page
  };
  return (
    <>
      <AdminLayout avatar={avatar} role={role}>
        <div className="container-content">
          <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
          <div
            className="search-container-user"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Tìm kiếm người dùng..."
                variant="outlined"
                size="small"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
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
              style={{ marginRight: "48px" }}
            >
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

          <div className="table-container-user">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
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
        </div>
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default UserManagement;
