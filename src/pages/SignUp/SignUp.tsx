import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";

const defaultTheme = createTheme();

export default function SignUp({
  onSwitchToLogin,
  onSuccessfulSignUp,
}: {
  onSwitchToLogin: () => void;
  onSuccessfulSignUp: () => void;
}) {
  // const navigate = useNavigate();
  // const { setIsLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordHintVisible, setPasswordHintVisible] = useState(false);
  const [emailHintVisible, setEmailHintVisible] = useState(false);
  const [userNameError, setUserNameError] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailCheck = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const email = event.target.value;
    if (email && !emailRegex.test(email)) {
      setEmailError("Email không đúng định dạng. Vui lòng kiểm tra lại.");
    } else {
      setEmailError(null); // Xóa lỗi nếu email hợp lệ
    }
  };

  const handleUserNameCheck = (event: React.FocusEvent<HTMLInputElement>) => {
    const userName = event.target.value;
    if (userName && userName.length < 6) {
      setUserNameError("Tên tài khoản phải có ít nhất 6 ký tự.");
    } else {
      setUserNameError(null); // Xóa lỗi nếu tên tài khoản hợp lệ
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userName = data.get("userName") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const passwordConfirm = data.get("passwordConfirm") as string;

    // check điền thiếu form
    if (!userName || !email || !password || !passwordConfirm) {
      toast.error("Vui lòng điền đầy đủ thông tin.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // check định dạng mk
    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }
    // xac nhan mk khong khop
    if (password !== passwordConfirm) {
      toast.error("Mật khẩu không khớp. Vui lòng kiểm tra lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const signUpData = {
      userName: data.get("userName") as string,
      email: data.get("email") as string,
      password: password,
    };
    try {
      const response = await axiosInstance.post(
        `/api/v1/user/register`,
        signUpData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Đăng ký thành công", response.data);
      toast.success("Đăng ký thành công. Vui lòng đăng nhập.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        onSuccessfulSignUp();
      }, 3000);
    } catch (error: any) {
      console.error("Signup failed", error);
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(
          message ||
            "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và thử lại.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else {
        toast.error(
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và thử lại.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    }
  };

  // const handleGoogleSignUp = async (credentialResponse: any) => {
  //   try {
  //     const response = await axiosInstance.post(
  //       `/api/v1/SSO/loginGoogle`,
  //       { credential: credentialResponse.credential }
  //     );
  //     console.log("Google sign up success", response.data);

  //     localStorage.setItem("token", response.data.token);
  //     localStorage.setItem("role", response.data.role);

  //     setIsLoggedIn(true);
  //     onSuccessfulSignUp();
  //     navigate("/");
  //   } catch (error) {
  //     console.log("Đăng nhập Google thất bại", error);
  //     toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  // };
  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", marginBottom: "20px" }}
          />
          <Typography component="h1" variant="h4" fontWeight="bold">
            Đăng kí tài khoản
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Tên tài khoản"
                  autoFocus
                  onBlur={handleUserNameCheck}
                  error={!!userNameError}
                  helperText={userNameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email của bạn"
                  name="email"
                  autoComplete="email"
                  onBlur={(event) => {
                    handleEmailCheck(event);
                    setEmailHintVisible(false);
                  }}
                  onFocus={() => setEmailHintVisible(true)}
                  error={!!emailError}
                  helperText={
                    emailError ||
                    (emailHintVisible &&
                      "Vui lòng nhập chính xác email của bạn.")
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  onFocus={() => setPasswordHintVisible(true)}
                  onBlur={() => setPasswordHintVisible(false)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {passwordHintVisible && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                    thường, số và ký tự đặc biệt!
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Nhập lại mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  id="passwordConfirm"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              style={{ backgroundColor: "#3333CC", color: "white" }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: "20px" }}
            >
              Đăng kí
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <button
                  onClick={onSwitchToLogin}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 10px",
                    font: "inherit",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Bạn đã có tài khoản? Đăng nhập
                </button>
              </Grid>
            </Grid>
            {/* <Box>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  handleGoogleSignUp(credentialResponse);
                }}
                onError={() => {
                  console.log("Đăng kí thất bại");
                  toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
                }}
                useOneTap
                theme="outline"
                size="large"
                text="signup_with"
                shape="circle"
                width="100%"
              />
            </Box> */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
