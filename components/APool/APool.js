import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack, TextField} from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Image from 'next/image'
import { useAccount } from "wagmi";
import { amountFromFormatedStr, formatAmount, n1e18} from "../utils"
import Link from "next/link";

import useToast from '../Toast'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const APool = () => {
    const {ToastUI, showToast} = useToast()
    return (
    <React.Fragment>
        <ToastUI />
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='60%' maxWidth="720px" marginBottom="32px">
            <Typography component='div' sx={{fontSize: '48px', fontStyle: 'italic', fontWeight: '900', marginTop: '48px'}}>
            <span style={{color: '#06FC99'}}>Alliance</span> <span style={{color: 'yellow'}}>Pool</span>
            </Typography>
            <Typography component='div' sx={{fontSize: '48px',  fontStyle: 'italic', fontWeight: '900', }}>
            Creation Application
            </Typography>
            <Stack direction='column' justifyContent="space-between" alignItems="leflt" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '5px', marginTop:'32px', padding: '28px 48px 48px 48px'}} >
                <Typography component='div' sx={{font: '700 20px normal', margin: '8px 0 14px 0'}}>
                Application Guidelines
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                1. Eligibility: <span style={{font: '400 14px normal'}}> Applicants must demonstrate significant promotional capabilities and a
notable social media presence. (No initial fees are required to open an Alliance Pool.)</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px20px normal', marginBottom: '10px'}}>
                2. Process:  <span style={{font: '400 14px normal'}}> Submit an application -&gt; Receive approval -&gt; Create Alliance Pool -&gt;
Invite users to place bets -&gt; Earn commission from fees.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                3. Inviting Users: <span style={{font: '400 14px normal'}}> Once an Alliance Pool is established, the applicant can invite other users to
place bets within their Alliance Pool.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal'}}>
                4. No Initial Fees: <span style={{font: '400 14px normal'}}> Opening an Alliance Pool does not require any initial fees.</span>
                </Typography>

                <Typography component='div' sx={{font: '700 20px normal', margin: '22px 0 14px 0'}}>
                Ownership
                </Typography>
                <Typography component='div' sx={{font: '400 14px normal', marginBottom: '10px'}}>
                The ownership of the Alliance Pool is vested in the community. The project team reserves the right to
dissolve the pool in cases of mismanagement.
                </Typography>
                
                <Typography component='div' sx={{font: '700 20px normal', margin: '22px 0 14px 0'}}>
                Additional Information
                </Typography>
                <Typography component='div' sx={{font: '400 14px normal', marginBottom: '10px'}}>
                1. Funds for the Alliance Pool are sourced from the official pool. Should the Alliance Pool be dissolved,
funds will revert to the official pool.
                </Typography>
                <Typography component='div' sx={{font: '400 14px normal'}}>
                2. Accounts placing their first bet exclusively in the Alliance Pool will benefit from reduced transaction
fees.
                </Typography>

                <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' maxWidth="100%">
                    <Button variant="contained" onClick={()=>{
                        showToast('Coming soon')
                        //window.open('https://docs.google.com/forms/d/1kyU01oLW8TxPDedjnFXLoc3c1asneYFNVd7W8ECHXvU', '_blank')
                    }} alignSelf='center' color='error' sx={{textTransform:'none', height: '40px', width: '100%', font: "400 normal 14px Arial", marginTop: '28px', '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333333', color: "#aaaaaa"}}} >
                        Apply Now
                    </Button>
                </Stack>
            </Stack>
            
        </Stack>
    </React.Fragment>);
}

export default APool;