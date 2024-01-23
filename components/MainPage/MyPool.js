import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack} from '@mui/material'
import PoolItem from './PoolItem'
import {useAddrees} from 'wagmi'
import {useAccount} from "wagmi";
import { formatAmount, n1e18, formatTime } from "../utils";

import { useGameContract } from "../../data/game";

const MyPool = () => {
    const {pools, preRemovePool, removePool} = useGameContract();
    const {address, isConnected} = useAccount()
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
    <React.Fragment>
        <Stack direction='column' alignItems='center' justifyContent="center">
            <Stack direction='column' alignItems='center' >
                <Typography component='div' width='100%' sx={{margin: '80px 0 38px 0px ', color: "#7D7D7D", font: '700 normal 20px Arial', textAlign: 'left'}}>
                    My Prize Pool
                </Typography> 
                {pools && isConnected && pools.filter((item)=>{return item?.owner.toLowerCase()==address.toLowerCase()}).map((item)=>{
                    return <Box key={'box-'+item.id} >
                        <PoolItem key={'pool-'+item.id} poolPro={item} my={true}/>
                    </Box>
                })}

                <Typography component='div' width='100%' sx={{ padding: '50px 0px 20px 0px', font: '700 normal 16px Arial'}}>
                    Withdrawal Pool Rules
                </Typography>
                <Typography component='div' sx={{ font: '400 normal 14px Arial'}}>
                    <ul style={{padding: '0px 8px 0px 0px'}}>
                        <li style={{marginTop: "8px"}}>
                        The pool must be operational for at least 3 months before manual withdrawal is allowed.
                        </li>
                        <li style={{marginTop: "8px"}}>
                        At the end of each cycle, there is a 3-day period for pool withdrawal. If this period is exceeded, the pool is automatically renewed for another 3 months.
                        </li>
                        <li style={{marginTop: "8px"}}>
                        Withdrawal process: Lock pool &gt; Wait for 3 days &gt; Manual withdrawal available after 3 days.
                        </li>
                        <li style={{marginTop: "8px"}}>
                        The withdrawal operation is the same as the withdrawal logic for regular users, including a deduction of a handling fee.
                        </li>
                        <li style={{marginTop: "8px"}}>
                        Withdrawal handling fee = 7% of the pool&aposs profit balance.
                        </li>
                        <li  style={{marginTop: "8px"}}>
                        The withdrawal operation is irreversible. Once completed, the wallet address previously bound to the user will automatically be bound to the official pool.
                        </li>
                    </ul>
                </Typography>
            </Stack>
                
        </Stack>

    </React.Fragment>);
}

export default MyPool;