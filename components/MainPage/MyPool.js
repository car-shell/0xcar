import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack} from '@mui/material'
import PoolItem from './PoolItem'


import { useGameContract } from "../../data/game";

const MyPool = () => {
    // const {pools} = usMyPooleGameContract();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
    <React.Fragment>
        <Stack direction='column' alignItems='center'>
            <Typography component='div' variant='h6'>
                My Pool
            </Typography>
            <Stack direction='row' justifyContent="flex-end" alignItems="left" width="100%" >
                <Button variant="outlined" width="80px" >
                    Lock Pool
                </Button>
            </Stack>
            {/* <PoolItem poolPro/> */}
        </Stack>
        <Box>
            <Typography component='div' sx={{ padding: '16px 16px 0px 16px', font: '500 normal 16px Arial'}}>
                Withdrawal Pool Rules
            </Typography>
            <Typography component='div' sx={{ font: '400 normal 14px Arial'}}>
                <ul style={{padding: '0px 8px 0px 20px'}}>
                    <li style={{margin: "8px"}}>
                    The pool must be operational for at least 3 months before manual withdrawal is allowed.
                    </li>
                    <li style={{margin: "8px"}}>
                    At the end of each cycle, there is a 3-day period for pool withdrawal. If this period is exceeded, the pool is automatically renewed for another 3 months.
                    </li>
                    <li style={{margin: "8px"}}>
                    Withdrawal process: Lock pool -&gt Wait for 3 days -&gt Manual withdrawal available after 3 days.
                    </li>
                    <li style={{margin: "8px"}}>
                    The withdrawal operation is the same as the withdrawal logic for regular users, including a deduction of a handling fee.
                    </li>
                    <li style={{margin: "8px"}}>
                    Withdrawal handling fee = 7% of the pool's profit balance.
                    </li>
                    <li  style={{margin: "8px"}}>
                    The withdrawal operation is irreversible. Once completed, the wallet address previously bound to the user will automatically be bound to the official pool.
                    </li>
                </ul>
            </Typography>
        </Box>

    </React.Fragment>);
}

export default MyPool;