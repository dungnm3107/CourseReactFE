import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccessfulLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onSwitchToSignUp,
}) => {
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  const handleSwitchToForgotPassword = () => {
    setShowForgotPassword(true);
    setShowChangePassword(false);
  };

  const handleSwitchToSignIn = () => {
    setShowForgotPassword(false);
    setShowChangePassword(false);
  };
  const handleSwitchToChangePassword = () => {
    setShowForgotPassword(false);
    setShowChangePassword(true);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal"
      aria-describedby="login-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: "hidden",
          borderRadius: "15px",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {showForgotPassword ? (
          <ForgotPassword onClose={handleSwitchToSignIn}  onSwitchToChangePassword={handleSwitchToChangePassword}/>
        ) : showChangePassword ? (
          <ChangePassword onClose={handleSwitchToSignIn} onSwitchToForgotPassword={handleSwitchToForgotPassword} />
        ) : (
          <SignIn
            onSwitchToSignUp={onSwitchToSignUp}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
            onSuccessfulLogin={onClose}
          />
        )}
      </Box>
    </Modal>
  );
};

export default LoginModal;
