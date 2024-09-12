import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SignUp from "./SignUp";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  open,
  onClose,
  onSwitchToLogin,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="signup-modal"
      aria-describedby="signup-modal-description"
    >
      <Box sx={{
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
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <SignUp onSwitchToLogin={onSwitchToLogin} onSuccessfulSignUp={onClose} />
      </Box>
    </Modal>
  );
};

export default SignUpModal;