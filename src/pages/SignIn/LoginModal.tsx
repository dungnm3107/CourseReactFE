import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignIn from './SignIn';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccessfulLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onSwitchToSignUp }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal"
      aria-describedby="login-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflow: 'hidden',
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
        <SignIn onSwitchToSignUp={onSwitchToSignUp} onSuccessfulLogin={onClose} />
      </Box>
    </Modal>
  );
};

export default LoginModal;