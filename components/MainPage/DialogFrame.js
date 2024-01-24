import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Box, Card, CardActionArea, Typography, Button, Dialog, Stack} from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(32, 33, 34, 0.9)',
    },
    '& .MuiDialog-container': {
        border: '1px solid black',
        borderRadius: '10px'
    },
    '& .MuiDialogTitle-root': {
        backgroundColor: '#000',
        color: '#fff',
        // textAlign: 'center',
    },
    '& .MuiDialogContent-root': {
        backgroundColor: '#000',
        color: '#fff',
        paddingTop: '48px',
    },
    '& .MuiDialogActions-root': {
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center',
    },
  }));


export const DialogFrame = (({open, handleClose, title, button, children, tail})=>{
    const [checked, setChecked] = React.useState(false);

    return <>
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{marginBottom: '32px'}}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {title}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
            <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
            <Button autoFocus variant='contained' disabled={button?.disable || (tail && !checked)} sx={{ textTransform: 'none', width:'90%', borderRadius: '220px', font:'400 normal 14px Arial', height: '45px', margin: '16px 0 0px 0', '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333', color: "#ccc"}, '&.MuiButton-root': {backgroundColor: '#d9001b'}}} onClick={button?.action?button?.action:handleClose}>
                {(tail && !checked)?'Agree close pool rules first':button?.title}
            </Button>
            </DialogActions>
            { tail && <FormGroup sx={{'&.MuiFormGroup-root':{backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}}>
                <FormControlLabel sx={{width: '85%'}} control={<Checkbox size="small" checked={checked} onChange={(e)=>{setChecked(!checked)}} sx={{
                    color: 'white',
                    '&.Mui-checked': {
                        color: '#06FC99',
                    },
                }} />} label={<Typography sx={{font: '400 normal 13px arial', color: 'white'}}>I understand that closing the pool is irreversible and will permanently terminate this prize pool</Typography>}/>
            </FormGroup> }
        </BootstrapDialog>
    </>
})

export const useCustomizedDialog = () => {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
      };
    const handleClose = () => {
        setOpen(false);
    };
    
    const props = {
        open,
        handleClose
    };
    return [openDialog, handleClose, props]
}
