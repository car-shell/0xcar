import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack, TextField} from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Image from 'next/image'
import { useAccount } from "wagmi";
import styles from "../../styles/Bet.module.css";
import { useIDOContract } from "../../data/ido";
import { useTokenContract } from "../../data/token";
import useToast from '../Toast'



const IDO = () => {
    const {init, remain, total_usdt_raised, createIDOPool} = useIDOContract();
    const {token} = useTokenContract();
    const {address} = useAccount()
    const [value, setValue] = React.useState(5000);
    const {ToastUI, showToast} = useToast()

    const handleCreate = (event) => {
        createIDOPool(BigInt(value*1e18), [], (data)=>{

        }, (error)=>{
            showToast(error.shortMessage, 'error')
        })
    };

    const handleInput = useCallback(
      (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, "")
          setValue(e.target.value)
      },
      [setValue],
  )


    return (
    <React.Fragment>
        <ToastUI />
        <Stack direction='column' justifyContent="flex-between" alignItems="center" width='60%' maxWidth="600px" >
            <Typography component='div' sx={{fontSize: '36px', fontWeight: '700', color: '#F59A23', marginTop: '70px'}}>
                CDNL IDO
            </Typography>
            <Typography component='div' sx={{fontSize: '36px', fontWeight: '700'}}>
                Become a Market Maker
            </Typography>
            <Stack direction='column' justifyContent="flex-between" alignItems="center" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'32px', paddingBottom: '16px'}} >
                <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Total Supply
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {init} {token?.symbol}
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Remaining Tokens
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {remain} {token?.symbol}
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        USDT Raised
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {total_usdt_raised} USDT
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction='column' justifyContent="flex-between" alignItems="center" gap='16px' width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'32px', paddingBottom: '16px'}}>
                <Typography component='div' sx={{fontSize: '28px', fontWeight: '700', paddingTop: '32px'}}>
                    Create a Bet Pool
                </Typography>
                <Stack direction='row' width='100%' justifyContent="flex-between"  gap='16px' alignItems="center" sx={{ marginTop: '8px'}}>
                    <Stack direction='row' width='40%' justifyContent="center"  alignItems="center"  sx={{ marginTop: '8px'}}>
                        <Box height='8px' width='8px' sx={{backgroundColor:"#06FC99", border: "1px solid #06FC99", borderRadius: "100%", marginRight: '8px'}}/>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                            {address?.slice(0, 6) + '...' + address?.slice(38)}
                        </Typography>
                    </Stack>
                    <Stack width='60%' sx={{display: 'flex', flexDirection: 'row',  alignItems: 'right' }}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                            Balance
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400'}}>
                             usdt
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent="flex-between" alignItems="center" width='90%' height='48px' sx={{border: "1px solid #333333"}} >
                    <input  style={{paddingLeft: '10px', width: '80%', height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} type='numbmic' placeholder='Input amount' value={value} onChange={handleInput}/>
                    <button style={{width: '20%', cursor: 'pointer',height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} onClick={()=>{}} > MAX </button>
                </Stack>
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                {/* <TextField id="outlined-number" label="Input amount" variant="outlied" type="number" sx={{ input: { color: 'white' } }} value={value} onChange={handleInput}/> */}
                <Stack direction='column' width='90%' justifyContent="flex-between" alignItems="center" sx={{border: "1px solid #7f7f7f", borderRadius: '10px', backgroundColor: '#333333'}}>
                    <Typography component='div' width='80%' sx={{fontSize: '16px', fontWeight: '700', paddingTop: '16px', textAlign: 'left'}}>
                        Information
                    </Typography>
                    <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                            Total Supply
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {init} {token?.symbol}
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                            Remaining Tokens
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {remain} {token?.symbol}
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="flex-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px', marginButton: '16px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                            USDT Raised
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {total_usdt_raised} USDT
                        </Typography>
                    </Stack>
                </Stack>
                <Button variant="contained" color="error" sx={{height: '40px', width: '90%'}} onClick={handleCreate}>
                    Create
                </Button>
            </Stack>
        </Stack>
    </React.Fragment>);
}

export default IDO;