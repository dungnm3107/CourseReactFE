import * as React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "../../assets/images/google.svg";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoCourse.png";
import axios from "axios";
import { BASE_API_URL } from "../../constants/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../service/AuthContext";

const defaultTheme = createTheme();

export default function SignUp({
  onSwitchToLogin,
  onSuccessfulSignUp,
}: {
  onSwitchToLogin: () => void;
  onSuccessfulSignUp: () => void;
}) {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const password = data.get("password") as string;
    const passwordConfirm = data.get("passwordConfirm") as string;

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
      const response = await axios.post(
        `${BASE_API_URL}/api/v1/user/register`,
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
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onSuccessfulSignUp(); // Close the modal
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
      toast.error(
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và thử lại.",
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
    }
  };

  const handleGoogleSignUp = async (credentialResponse: any) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/v1/SSO/loginGoogle`,
        { credential: credentialResponse.credential }
      );
      console.log("Google sign up success", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setIsLoggedIn(true);
      onSuccessfulSignUp();
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Tôi muốn nhận thông tin đăng kí qua email"
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
            <Box>
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
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
