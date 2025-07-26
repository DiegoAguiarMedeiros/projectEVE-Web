import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


type TransitionsModalProps = {
  openButton: React.ReactNode;
  okButton: React.ReactNode;
  open: boolean;
  handleOpen: VoidFunction;
  handleClose: VoidFunction;
  width?:number;
}

export default function TransitionsModal({ openButton, okButton, children, open, handleOpen, handleClose,width }: React.PropsWithChildren<TransitionsModalProps>) {

  return (
    <>
      {openButton}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open} >
          <Card sx={{ ...style, width: width !== undefined ? `${width}%` : `${style.width}px` }}>
            {children as React.ReactElement}
            <Box
              display="flex"
              alignSelf='flex-end'
              justifyContent='space-between'
              sx={{ width: '100%' }}
            >
              <Button variant='outlined' color='warning' onClick={handleClose}>Fechar</Button>

              {okButton}
            </Box>
          </Card>
        </Fade>

      </Modal>
    </>
  );
}
