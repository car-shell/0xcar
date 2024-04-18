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
    return (
    <React.Fragment>
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='60%' maxWidth="80%" marginBottom="32px">
            <Typography component='div' sx={{fontSize: '48px', fontStyle: 'italic', fontWeight: '900', marginTop: '48px'}}>
            Alliance Pool
            </Typography>
            <Typography component='div' sx={{fontSize: '48px',  fontStyle: 'italic', fontWeight: '900', }}>
            Creation Application
            </Typography>
            <Stack direction='column' justifyContent="space-between" alignItems="leflt" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '5px', marginTop:'32px', padding: '28px 48px 48px 48px'}} >
                <Typography component='div' sx={{font: '700 20px normal', margin: '22px 0 14px 0'}}>
                Alliance Pool Application
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                1.Eligibility for Application: <span style={{font: '400 14px normal'}}> Applicants for the Alliance Pool must possess significant
promotional capabilities and have a notable presence on social media.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px20px normal', marginBottom: '10px'}}>
                2.Application Process:  <span style={{font: '400 14px normal'}}> Users must go through the official application process provided by the
management to apply for the creation of an Alliance Pool.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                3.Inviting Users: <span style={{font: '400 14px normal'}}> Once an Alliance Pool is established, the applicant can invite other users to
place bets within their Alliance Pool.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal'}}>
                4.No Initial Fees: <span style={{font: '400 14px normal'}}> Opening an Alliance Pool does not require any initial fees.</span>
                </Typography>

                <Typography component='div' sx={{font: '700 20px normal', margin: '22px 0 14px 0'}}>
                Alliance Pool Applicatio
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                1.Fee Discounts: <span style={{font: '400 14px normal'}}> Users betting in the Alliance Pool can enjoy more favorable fee discounts.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal'}}>
                2.Revenue Distribution:  <span style={{font: '400 14px normal'}}> All revenues will be allocated between the official and   the Alliance Pool
holder according to established rules. For more details on the revenue distribution, please refer to.</span>
                </Typography>

                <Typography component='div' sx={{font: '700 20px normal', margin: '22px 0 14px 0'}}>
                Pool Withdrawal and Ownership
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal', marginBottom: '10px'}}>
                3.Ownership: <span style={{font: '400 14px normal'}}> Although the Alliance Pool is managed by the applicant, the ownership belongs to
the official administrators.</span>
                </Typography>
                <Typography component='div' sx={{font: '700 16px normal'}}>
                4.Right to Withdraw Pool: <span style={{font: '400 14px normal'}}> The official administrators reserve the right to withdraw the Alliance
Pool at any time based on the transaction activity within the pool.</span>
                </Typography>

                <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' maxWidth="100%">
                    <Button variant="contained" alignSelf='center' color='error' sx={{textTransform:'none', height: '40px', width: '80%', font: "400 normal 14px Arial", marginTop: '28px', '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333333', color: "#aaaaaa"}}} >
                        Apply Now
                    </Button>
                </Stack>
            </Stack>
            
        </Stack>
    </React.Fragment>);
}

export default APool;