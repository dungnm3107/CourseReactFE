import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/images/logoCourse.png";
import axiosInstance from "../../config/axios";
import { toast , ToastContainer} from "react-toastify";

interface ChangePasswordProps {
  onClose: () => void;
  onSwitchToForgotPassword: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onClose = () => {},
  onSwitchToForgotPassword = () => {},
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const [incorrectFormatPW, setIncorrectFormatPW] = useState("");
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // lay email tu localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setIsPasswordMatching(false);
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setIncorrectFormatPW(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
      );
      return;
    }

    if (newPassword === confirmPassword) {
      try {
        const response = await axiosInstance.put(
          `/api/v1/password-reset/change-password?`,
          { email: email, newPassword: newPassword },
          {
            headers: {
              'Content-Type': 'application/json', 
            },
          }
        );
        if (response.status === 200) {
          toast.success("Cập nhật mật khẩu thành công! Hãy đăng nhập lại");
          setTimeout(() => {
            onClose();
            localStorage.removeItem("forgotPasswordEmail");
          }, 4000); 
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsPasswordMatching(false);
    }
  };

  return (
    
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box display="flex" alignItems="center" width="100%" sx={{ mb: 0 }}>
        <IconButton onClick={onSwitchToForgotPassword}></IconButton>
        <Typography
          sx={{
            cursor: "pointer",
            fontSize: "20px",
            position: "absolute",
            top: "30px",
          }}
          onClick={onClose}
        >
          &lt; Quay lại
        </Typography>
      </Box>
      <img
        src={logo}
        alt="Logo"
        style={{ width: "100px", marginBottom: "20px" }}
      />
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Cập nhật mật khẩu mới
      </Typography>
      <Typography align="center" sx={{ mb: 6, color: "#20B2AA" }}>
        Nhập mật khẩu mới và xác nhận mật khẩu để tiếp tục.
      </Typography>

      <TextField
        fullWidth
        label="Mật khẩu mới"
        type={showNewPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          if (e.target.value.trim() === "") {
            setIncorrectFormatPW("");
          }
        }}
        onBlur={() => {
          if (!passwordRegex.test(newPassword)) {
            setIncorrectFormatPW(
              "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
            );
          }
        }}
        sx={{ mb: 4, width: "80%", borderRadius: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          style: { borderRadius: "10px" },
        }}
      />
      {incorrectFormatPW && (
        <Typography color="error" sx={{ mb: 2, fontSize: "14px", width: "80%" }} align="left">
          {incorrectFormatPW}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Xác nhận mật khẩu mới"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (e.target.value.trim() === "") {
            setIsPasswordMatching(true);
          }
        }}
        sx={{ mb: 2, width: "80%", borderRadius: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          style: { borderRadius: "10px" },
        }}
      />

      {!isPasswordMatching && (
        <Typography color="error" sx={{ mb: 2 }}>
          Mật khẩu xác nhận không khớp!
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
        disabled={!newPassword || !confirmPassword || !isPasswordMatching}
        sx={{ mt: 4, width: "80%", borderRadius: 10 }}
      >
        Cập nhật mật khẩu
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default ChangePassword;
