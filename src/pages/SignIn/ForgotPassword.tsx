import React, { useState } from "react";
import { Button, TextField, Typography, Box, IconButton } from "@mui/material";
import logo from "../../assets/images/logoCourse.png";
import axiosInstance from "../../config/axios";

interface ForgotPasswordProps {
  onClose: () => void;
  onSwitchToChangePassword: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onSwitchToChangePassword }) => {
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorValidationMessage, setErrorValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorValidationEmail, setErrorValidationEmail] = useState("");

  

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleSendCode = async () => {
    // kiem tra dinh dang email
    if (username.trim() === "") {
      setErrorValidationEmail("Email không được để trống.");
      return;
    }

    // Kiểm tra định dạng email
    if (!emailRegex.test(username)) {
      setErrorValidationEmail("Email không đúng định dạng.");
      return;
    } else {
      setErrorValidationEmail(""); // Xóa lỗi khi email hợp lệ
    }

    if (username.trim() !== "") {
      try {
        const response = await axiosInstance.post(
          `api/v1/password-reset?email=${username}`
        );
        if (response.status === 200) {
          setIsCodeSent(true);
          setSuccessMessage("Gửi mã thành công, kiểm tra email và nhập mã");
          setErrorMessage("");
          localStorage.setItem("forgotPasswordEmail", username);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          // Nếu API trả về lỗi 404, thông báo email không tồn tại
          setErrorMessage(
            "Email không tồn tại trong hệ thống, vui lòng kiểm tra lại."
          );
        } else {
          setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
        setIsCodeSent(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (verificationCode.trim() !== "") {
      try {
        const response = await axiosInstance.post(
          `api/v1/password-reset/validate-token?`,
          { token: verificationCode },
          {
            headers: {
              'Content-Type': 'application/json', 
            },
          }
        );
        if (response.status === 200) {
          onSwitchToChangePassword();
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          setErrorValidationMessage("Mã xác nhận không hợp lệ.");
        } else if (error.response && error.response.status === 401) {
          setErrorValidationMessage("Mã xác nhận đã hết hạn.");
        } else {
          setErrorValidationMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
      }
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
        <IconButton onClick={onClose}></IconButton>
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
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Quên mật khẩu?
      </Typography>
      <Typography align="center" sx={{ mb: 4, color: "#20B2AA" }}>
        Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã khôi phục mật khẩu.
      </Typography>

      <TextField
        fullWidth
        label="Email"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          // loai bo message khi field trong
          if (e.target.value.trim() === "") {
            setErrorValidationEmail("");
            setErrorMessage("");
          }
        }}
        sx={{ mb: 4, width: "80%", borderRadius: 2, marginTop: "20px" }}
        InputProps={{
          style: { borderRadius: "10px" },
        }}
      />

      {errorValidationEmail && (
        <Typography color="error" sx={{ mb: 2, fontSize: "14px" }} align="left">
          {errorValidationEmail}
        </Typography>
      )}
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2, fontSize: "14px" }}align="left">
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography color="primary" sx={{ mb: 2, fontSize: "14px" }}align="left">
          {successMessage}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Nhập mã xác nhận"
        value={verificationCode}
        onChange={(e) => {
          setVerificationCode(e.target.value);
          if (e.target.value.trim() === "") {
            setErrorValidationMessage("");
          }
        }}
        disabled={!isCodeSent}
        sx={{ mb: 2, width: "80%", borderRadius: 2 }}
        InputProps={{
          style: { borderRadius: "10px" },
        }}
      />
      {errorValidationMessage && (
        <Typography color="error" sx={{ mb: 2, fontSize: "14px" }} align="left">
          {errorValidationMessage}
        </Typography>
      )}

      <Box display="flex" justifyContent="f" sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleSendCode}
          disabled={isCodeSent || !username}
        >
          Gửi mã
        </Button>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleResetPassword}
        disabled={!verificationCode}
        sx={{ mb: 4, width: "80%", borderRadius: 10 }}
      >
        Đặt lại mật khẩu
      </Button>
    </Box>
  );
};

export default ForgotPassword;
