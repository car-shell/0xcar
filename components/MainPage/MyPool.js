import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack} from '@mui/material'
import PoolItem from './PoolItem'
import {useAddrees} from 'wagmi'
import {useAccount} from "wagmi";
import useToast from '../Toast'

import { useGameContract } from "../../data/game";

const MyPool = () => {
    const {pools, preRemovePool, removePool} = useGameContract();
    const {address, isConnected} = useAccount()
    const [value, setValue] = React.useState(0);
    const {ToastUI, showToast} = useToast()
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRemovePool = (pool) => {
        if (pool.isLocked) {
            removePool(pool.id, ()=>{
                showToast("success", "success")
            }, (error)=>{
                showToast(error.shortMessage || error.message || error.reason, "error")
            })
        } else {
            preRemovePool(pool.id, ()=>{
                showToast("success", "success")
            }, (error)=>{
                showToast(error.shortMessage || error.messag || error.reason, "error")
            })
        }
    }

    return (
    <React.Fragment>
        <ToastUI />
        <Stack direction='column' alignItems='center' justifyContent="center" width='100%'>
            <Stack direction='column' alignItems='center' width='60%'>
                <Typography component='div' sx={{margin: '80px 0 6px 0', font: '700 normal 20px Arial'}}>
                    My Pool
                </Typography> 
                {pools && isConnected && pools.filter((item)=>{return item?.owner.toLowerCase()==address.toLowerCase()}).map((item)=>{
                    return <>
                        <Stack key={'stack-'+item.id} direction='row' justifyContent="flex-end" alignItems="left" width="100%" sx={{padding: '32px 0 0 0'}}>
                            <Button key={'button-'+item.id} variant="contained" color="error" sx={{borderRadius: '90px',  width: "150px"}} onClick={()=>{handleRemovePool(item)}} >
                                {item.isLocked?"Remove Pool":"Lock Pool"}
                            </Button>
                        </Stack>
                        <PoolItem key={'pool-'+item.id} poolPro={item} my={true}/>
                    </>
                })}
            </Stack>
            <Box width='60%'>
                <Typography component='div' sx={{ padding: '50px 16px 20px 16px', font: '700 normal 16px Arial'}}>
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
                        Withdrawal handling fee = 7% of the pool&aposs profit balance.
                        </li>
                        <li  style={{margin: "8px"}}>
                        The withdrawal operation is irreversible. Once completed, the wallet address previously bound to the user will automatically be bound to the official pool.
                        </li>
                    </ul>
                </Typography>
            </Box>
        </Stack>

    </React.Fragment>);
}

export default MyPool;