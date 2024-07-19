import React from 'react';
import { Box, Modal, Fade, Backdrop, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LuckyWheel from './LuckyWheel';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#ccc',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: '8px',
  width: 'fit-content',  // Make sure modal fits the content
};

const closeButtonStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
};

const LuckyWheelModal = ({ data, open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <IconButton sx={closeButtonStyle} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <LuckyWheel data={data}/>
        </Box>
      </Fade>
    </Modal>
  );
};

export default LuckyWheelModal;
