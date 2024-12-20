import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from "../../service/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/logoCourse.png";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../config/axios";


const defaultTheme = createTheme();
export default function SignIn({
  onSwitchToSignUp,
  onSuccessfulLogin,
  onSwitchToForgotPassword,
}: {
  onSwitchToSignUp: () => void;
  onSuccessfulLogin: () => void;
  onSwitchToForgotPassword: () => void;
}) {
  const navigate = useNavigate();
  const {checkLoginStatus} = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      userName: data.get("username"),
      password: data.get("password"),
    };


    // check
    if (!loginData.userName || !loginData.password) {
      const missingFields = [];
      if (!loginData.userName) missingFields.push("tên tài khoản");
      if (!loginData.password) missingFields.push("mật khẩu");

      const errorMessage = `Vui lòng nhập ${missingFields.join(" và ")}.`;
      toast.error(errorMessage, {
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

    try {
      const response = await axiosInstance.post(
        `/api/v1/user/login`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Login success", response.data);
  
      localStorage.setItem("token", response.data.result.jwtToken);
  
      // Fetch user profile data after login to get avatar and role
      const profileResponse = await axiosInstance.get(`/api/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${response.data.result.jwtToken}`,
        },
      });
  
      // Save avatar and role to localStorage
      localStorage.setItem("avatar", profileResponse.data.avatar);
      localStorage.setItem("role", profileResponse.data.listRoles[0].roleName);
  
      // Trigger login status check
      checkLoginStatus();
      onSuccessfulLogin();
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Unexpected error:", error);
        toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axiosInstance.post(`/api/v1/SSO/loginGoogle`, {
        credential: credentialResponse.credential,
      });
      console.log("Google login success", response.data);
  
      // Store the token, avatar, and role in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("avatar", response.data.avatar);
      localStorage.setItem("role", response.data.role);
  
      await checkLoginStatus();
  
      onSuccessfulLogin();
      navigate("/");
    } catch (error) {
      console.log("Đăng nhập Google thất bại", error);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên tài khoản"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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
           <Grid container justifyContent="flex-start">
              <Grid item>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
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
                  Quên mật khẩu?
                </button>
              </Grid>
            </Grid>
            <Button
              style={{ backgroundColor: "#3333CC", color: "white" }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: "20px" }}
            >
              Đăng nhập
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <button
                  onClick={onSwitchToSignUp}
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
                  Bạn chưa có tài khoản? Đăng kí
                </button>
              </Grid>
            </Grid>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                //credentialResponse chứ gg id token
                handleGoogleLogin(credentialResponse);
              }}
              onError={() => {
                console.log("Đăng nhập Google thất bại");
                toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
              }}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              shape="circle"
              width="100%"
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
