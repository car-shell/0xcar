import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack, TextField} from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Image from 'next/image'
import { useAccount } from "wagmi";
import { useIDOContract } from "../../data/ido";
import { useTokenContract } from "../../data/token";
import { useSwapContract } from "../../data/swap";
import { amountFromFormatedStr, formatAmount,n1e18} from "../utils"
import useStepInfo from '../StepInfo'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from "next/link";

import useToast from '../Toast'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



const IDO = () => {
    const {init, remain, total_usdt_raised, createIDOPool, usdtBalance} = useIDOContract();
    const {token} = useTokenContract();
    const {address, isConnected} = useAccount()
    const {amountsOut} = useSwapContract()
    const [value, setValue] = React.useState();
    const [checked, setChecked] = React.useState(false);

    const {ToastUI, showToast} = useToast()
    const {setStepInfo, setStepNodes, StepInfo} = useStepInfo()

    const {openConnectModal} = useConnectModal()

    
    useEffect(()=>{
        setStepNodes({create_pool: [{name: 'Comfirm in Wallet'}, {name: 'Pool Created'}], 
            approve: [{name: 'Approve submited'}, {name: 'Approve completed'}]})
    }, [setStepNodes])

    const onStepChange = useCallback((step, isShow, stepName=null, stepTitle=null, buttonContent=null)=>{
        setStepInfo((pre) => {
            let n = { ...pre, isShow: isShow,  active: step, stepName: stepName!=null?stepName:pre.stepName, stepTitle: stepTitle!=null?stepTitle:pre.stepTitle, buttonContent: buttonContent!=null?buttonContent:pre.buttonContent, stepMsg: null}
            console.log( n );
            return n })
    }, [setStepInfo])

    const handleCreate = (event) => {
        if (!isConnected) {
            openConnectModal()
            return
        }

        if (value < 5000 || value > 50000) {
            showToast("The amount exceeds the limit. The valid range is 5,000.00 to 50,000.00", 'error')
            return
        }

        createIDOPool(BigInt(value*1e18), [], (data)=>{
            // showToast("Congratulations，Create pool success", 'success')
        }, (error)=>{
            onStepChange(0, false, '', '')
            showToast(error.shortMessage, 'error')
        }, onStepChange)
    };

    const tipContent = () => {
        if (!isConnected) {
            return "Connect Wallet"
        }
        if (!checked) {
            return "Agree to the IDO rules before creating a pool"
        }
        if (value < 5000 || value > 50000) {
            return "The valid range is 5,000.00 to 50,000.00"
        }
        return "Create"
    }

    const handleInput = useCallback(
      (e) => {
          e.target.value = e.target.value.replace(/[^\d.]/g, "")
          setValue(e.target.value)
      },
      [setValue])
    
    const handleMax = (e)=>{
        let b = amountFromFormatedStr(usdtBalance)
        console.log( `usdt balance ${b}` );
        if (b > 50000) {
            setValue(50000.00);
        } else {
            setValue(b)
        }
    }


    return (
    <React.Fragment>
        <ToastUI />
        <StepInfo />
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='60%' maxWidth="600px" >
            <Typography component='div' sx={{fontSize: '36px', fontWeight: '700', color: '#F59A23', marginTop: '70px'}}>
                CDNL IDO
            </Typography>
            <Typography component='div' sx={{fontSize: '36px',  fontStyle: 'italic', fontWeight: '700'}}>
                Become a Market Maker
            </Typography>
            <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'32px', paddingBottom: '16px'}} >
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', fontStyle: 'italic', flexDirection: 'row', alignItems: 'center', marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Total Supply
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400',  paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {init} {token?.symbol}
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex',  fontStyle: 'italic', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Remaining Tokens
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {remain} {token?.symbol}
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex',  fontStyle: 'italic', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        USDT Raised
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {total_usdt_raised} USDT
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction='column' justifyContent="space-between" alignItems="center" gap='4px' width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'16px', paddingBottom: '16px'}}>
                <Typography component='div' sx={{fontSize: '28px', fontStyle: 'italic',  fontWeight: '700', paddingTop: '32px'}}>
                    Create a Bet Pool
                </Typography>
                <Stack direction='row' width='90%' justifyContent="space-between"  gap='4px' alignItems="center" sx={{ marginTop: '8px'}}>
                    <Stack direction='row' width='50%' justifyContent="flex-start"  alignItems="center"  sx={{ marginTop: '8px'}}>
                    {isConnected &&<Box height='8px' width='8px' sx={{backgroundColor:"#06FC99", border: "1px solid #06FC99", borderRadius: "100%", marginRight: '8px'}}/>}
                    {isConnected &&<Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                            {address?.slice(0, 6) + '...' + address?.slice(38)}
                        </Typography>}
                    </Stack>
                    <Stack width='50%' sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'right', textAlign: 'right'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '10px'}}>
                            Balance
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400'}}>
                            {usdtBalance} usdt
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='48px' sx={{border: "1px solid #333333"}} >
                    <input  style={{paddingLeft: '10px', width: '90%', height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} type='numbmic' placeholder='Input amount (5,000 USDT - 50,000 USDT)' value={value} onChange={handleInput}/>
                    <button style={{width: '10%', cursor: 'pointer',height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} onClick={handleMax} > MAX </button>
                </Stack>
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                {/* <TextField id="outlined-number" label="Input amount" variant="outlied" type="number" sx={{ input: { color: 'white' } }} value={value} onChange={handleInput}/> */}
                <Stack direction='column' width='90%' justifyContent="space-between" alignItems="center" sx={{border: "1px solid #333333", fontStyle: 'italic',  borderRadius: '5px', backgroundColor: '#333333' , marginTop: '32px'}}>
                    <Typography component='div' width='100%' sx={{fontSize: '16px', fontWeight: '700', paddingTop: '16px', paddingLeft: '32px', textAlign: 'left'}}>
                        Information
                    </Typography>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Current CDNL Price
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {formatAmount(amountsOut?amountsOut[1]:200n*n1e18)} {token?.symbol}
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Cost
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {value?formatAmount(value):"0.00"} USDT
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px', marginBottom: '16px'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                        Buyable
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {value?formatAmount(value*parseFloat(amountsOut?amountsOut[1]/n1e18:200n)/0.85):'0.00'} {token?.symbol}
                        </Typography>
                    </Stack>
                </Stack>
                <Button variant="contained"  disabled={(isConnected && !checked) || (isConnected && (value < 5000 || value > 50000 )) } color='error' sx={{textTransform:'none', height: '40px', width: '90%', font: "400 normal 18px Arial", marginTop: '28px', '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333', color: "#ccc"}}} onClick={handleCreate}>
                    {tipContent()}
                </Button>
                <FormGroup width='100%'>
                    <FormControlLabel  height='12px'  control={<Checkbox checked={checked} onChange={(e)=>{setChecked(!checked)}} sx={{
                        color: 'white',
                        '&.Mui-checked': {
                            color: '#06FC99',
                        },
                    }} />} label={<Typography>I understand and agree to the <Link href='https://www.google.com' target='blank' style={{color: '#41A0DA'}}>&lt;IDO Rules&gt;</Link></Typography>}/>
                </FormGroup>
            </Stack>
        </Stack>
    </React.Fragment>);
}

export default IDO;