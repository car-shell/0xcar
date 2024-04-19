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
import { amountFromFormatedStr, formatAmount, formatTime, formatDuration, n1e18} from "../utils"
import useStepInfo from '../StepInfo'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from "next/link";
import { useRouter } from 'next/router'

import useToast from '../Toast'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



const IDO = ({refera}) => {
    const [referaAddr, setReferaAddr] = useState(refera)
    const {isSuccess, init, remain, total_usdt_raised, price, whitelistPrice, startTime, endTime, buyToken, usdtBalance, referaFund,referaCount, subscribed, claimed, isWhitelist, claimTokens, withdrawRefferasFund} = useIDOContract();
    const {token} = useTokenContract();
    const {address, isConnected} = useAccount()
    const {amountsOut} = useSwapContract()
    const [value, setValue] = React.useState();
    const [duration, setDuration] = React.useState('--');
    const [checked, setChecked] = React.useState(false);
    const [refUrl, setRefUrl] = React.useState('');
    const {ToastUI, showToast} = useToast()
    const {setStepInfo, setStepNodes, StepInfo} = useStepInfo()

    const {openConnectModal} = useConnectModal()
    const router = useRouter()

    const claimInfo = [(endTime-3600*24)*1000, (endTime+3600*24*30)*1000, (endTime+3600*24*60)*1000]
    
    useEffect(()=>{
        setStepNodes({create_pool: [{name: 'Comfirm in Wallet'}, {name: 'Done'}], 
            approve: [{name: 'Approve submited'}, {name: 'Approve completed'}]})
    }, [setStepNodes])
    
    useEffect(()=>{
        let r = 'Please Connect wallet first';
        if (isConnected) {
            r = `https://little-shape-9383.on.fleek.co/ido?refera=${address}`
        }
        setRefUrl(r)
    }, [address, isConnected, typeof window])

    useEffect(()=>{
        const i = setInterval(()=>{
            const n = Date.now()/1000
            if (isSuccess && n > startTime && n < endTime ) {
                setDuration(formatDuration(endTime-n))
            }
        }, 1000)
        return () => {
            clearInterval(i)
        }
    })
    const onStepChange = useCallback((step, isShow, stepName=null, stepTitle=null, buttonContent=null)=>{
        setStepInfo((pre) => {
            let n = { ...pre, isShow: isShow,  active: step, stepName: stepName!=null?stepName:pre.stepName, stepTitle: stepTitle!=null?stepTitle:pre.stepTitle, buttonContent: buttonContent!=null?buttonContent:pre.buttonContent, stepMsg: null}
            console.log( n );
            return n })
    }, [setStepInfo])

    const handleBuy = useCallback((event) => {
        if (!isConnected) {
            openConnectModal()
            return
        }

        if (value < 50 || value > 50000) {
            showToast("The amount exceeds the limit. The valid range is 50.00 to 50,000.00", 'error')
            return
        }

        buyToken(BigInt(value*1e18), referaAddr, (data)=>{
            showToast("Congratulations，buy token success", 'success')
        }, (error)=>{
            onStepChange(0, false, '', '')
            showToast(error.shortMessage, 'error')
        }, onStepChange)
    }, [isConnected, value, referaAddr]);

    const handleCopy = ()=>{
        navigator.clipboard.writeText(refUrl);
        showToast('url copied')
    }

    const tipContent = () => {
        if (!isConnected) {
            return "Connect Wallet"
        }
        if (!value || value < 50 || value > 50000) {
            return "The valid range is 50.00 to 50,000.00"
        }
        return "Buy"
    }

    const handleInput = useCallback(
      (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, "")
          console.log(typeof e.target.value);
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

    const handleClaim = useCallback(()=>{
        if (!isConnected) {
            openConnectModal()
            return
        }

        claimTokens((data)=>{
            // showToast("Congratulations，Create pool success", 'success')
        }, (error)=>{
            onStepChange(0, false, '', '')
            showToast(error.shortMessage, 'error')
        }, onStepChange)
    },[])

    const handleFund = useCallback(()=>{
        if (!isConnected) {
            openConnectModal()
            return
        }

        withdrawRefferasFund((data)=>{
            // showToast("Congratulations，Create pool success", 'success')
        }, (error)=>{
            onStepChange(0, false, '', '')
            showToast(error.shortMessage, 'error')
        }, onStepChange)
    },[])

    const getClaimStatus=(date, index)=>{
        if (Date.now() > date) {
            if (subscribed/3*(index+1) < claimed) {
                return (
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingRight: '32px', textAlign: 'right', width: '30%'}}>
                        Cliamed
                    </Typography>
                )
            } else {
                return (
                    <Stack direction='column' justifyContent="space-between" alignItems="center" width='30%' sx={{paddingRight: '32px'}} >
                            <Button variant="contained" color='error' sx={{textTransform:'none', width: '100%', font: "400 normal 14px Arial"}} onClick={handleClaim}>
                                {!isConnected?"Connect":"Claim"}
                            </Button>
                    </Stack>
                )
            }
        } else {
            return (
                <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingRight: '32px', textAlign: 'right', width: '30%'}}>
                    --
                </Typography>
            )
        }
    }
    return (
    <React.Fragment>
        <ToastUI />
        <StepInfo />
        { Date.now()/1000<endTime
        ?
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='60%' maxWidth="620px" marginBottom="32px">
            <Stack direction='row' alignItems='baseline' sx={{columnGap: '4px'}} >
                <Image  alt="" src='./fire.png' width='32' height='32' />
                <Typography component='div' sx={{marginTop: '18px', font: '900 oblique 36px Arial'}}>
                0xCardinal IDO
                </Typography>
            </Stack>
            {/* <Typography component='div' sx={{fontSize: '30px', fontStyle: 'italic', fontWeight: '700', marginTop: '48px'}}>
                <span style={{color: '#ea3423'}}>0x</span>
            </Typography> */}
            <Typography component='div' sx={{fontSize: '20px',  fontStyle: 'italic', fontWeight: '400', marginTop: '12px' }}>
            {formatTime(startTime*1000, true)} - {formatTime(endTime*1000, true)} (UTC+0)
            </Typography>
            <Typography component='div' sx={{font: '700 italic 18px sans', color: "#d7d7d7", marginTop: '12px' }}>
            Ends in <span style={{font: '700 italic 28px sans', color: "yellow"}}>{duration}</span>
            </Typography>

            <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'24px', paddingBottom: '16px'}} >
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', fontStyle: 'italic', flexDirection: 'row', alignItems: 'center', marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                    Remaining Tokens
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400',  paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {remain}/{init} {token?.symbol}
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
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex',  fontStyle: 'italic', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', color: '#7f7f7f'}}>
                    IDO price
                    </Typography>
                    <Typography component='div' sx={{fontSize: '16px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '90%'}}>
                        <span style={{font: '400 italic 14px sans'}}>Whitelist pice: </span>{whitelistPrice} USDT | <span style={{font: '400 italic 14px sans'}}>Public pice: </span> {price} USDT
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction='column' justifyContent="space-between" alignItems="center" gap='4px' width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'16px', paddingBottom: '16px'}}>
                {/* <Typography component='div' sx={{fontSize: '28px', fontStyle: 'italic',  fontWeight: '700', paddingTop: '32px'}}>
                    Create a Betting Pool
                </Typography> */}
                <Stack direction='row' width='90%' justifyContent="space-between"  gap='4px' alignItems="center" sx={{ marginTop: '32px'}}>
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
                            {usdtBalance} USDT
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='48px' sx={{border: "1px solid #333333"}} >
                    <input  style={{paddingLeft: '10px', width: '90%', height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} type='numbmic' placeholder='Input amount (50 USDT - 50,000 USDT)' value={value || ''} onChange={handleInput}/>
                    <button style={{width: '10%', cursor: 'pointer',height:'100%', border:'none', outline:'null', backgroundColor: 'transparent'}} onClick={handleMax} > MAX </button>
                </Stack>
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                {/* <TextField id="outlined-number" label="Input amount" variant="outlied" type="number" sx={{ input: { color: 'white' } }} value={value} onChange={handleInput}/> */}
                <Stack direction='column' width='90%' justifyContent="space-between" alignItems="center" sx={{border: "1px solid #333333",  backgroundColor: '#333333',  borderRadius: '5px',  marginTop: '32px'}}>
                    {/* <Typography component='div' width='100%' sx={{fontSize: '16px', fontWeight: '700', paddingTop: '16px', paddingLeft: '32px', textAlign: 'left'}}>
                        Information
                    </Typography> */}
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '13px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', }}>
                        Whitelist
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {isWhitelist?<span style={{color: '#06FC99'}}>YES</span>:<span style={{color: 'red'}}>NO</span>}
                        </Typography>
                    </Stack>
                    <Stack width='90%' justifyContent="space-between" height='1px' sx={{borderTop: "1px solid #666666", display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                    </Stack>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '13px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', }}>
                        Amount Spent
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontStyle: 'italic', fontWeight: '700', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                            {value?formatAmount(value):'--'} <span style={{fontWeight: '400', fontStyle: 'italic'}}>USDT</span>
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                        <Typography component='div' sx={{fontSize: '13px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', }}>
                        Subscription Price
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontStyle: 'italic', fontWeight: '700', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {isWhitelist?whitelistPrice:price} <span style={{fontWeight: '400', fontStyle: 'italic'}}>USDT</span>
                        </Typography>
                    </Stack>
                    <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px', marginBottom: '16px'}}>
                        <Typography component='div' sx={{fontSize: '13px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%', }}>
                        Tokens Subscribed
                        </Typography>
                        <Typography component='div' sx={{fontSize: '14px', fontStyle: 'italic', fontWeight: '700', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {value?(isWhitelist)?formatAmount(Number(value/whitelistPrice)):formatAmount(Number(value/price)):'--'} <span style={{fontWeight: '400'}}>{token.symbol}</span>
                        </Typography>
                    </Stack>
                </Stack>
                <Button variant="contained"  disabled={isConnected && (!value || (value < 50 || value > 50000)) } color='error' sx={{textTransform:'none', height: '40px', width: '90%', font: "400 normal 14px Arial", marginTop: '28px', '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333333', color: "#aaaaaa"}}} onClick={handleBuy}>
                    {tipContent()}
                </Button>
               
            </Stack>

            <Stack direction='column' justifyContent="space-between" alignItems="center" gap='4px' width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'16px', }}>
                {/* <Typography component='div' sx={{fontSize: '28px', fontStyle: 'italic',  fontWeight: '700', paddingTop: '32px'}}>
                    Create a Betting Pool
                </Typography> */}
                <Stack direction='row' width='90%' justifyContent="space-between"  gap='4px' alignItems="center" sx={{ marginTop: '32px'}}>
                    <Stack direction='row' width='50%' justifyContent="flex-start"  alignItems="center"  sx={{ marginTop: '8px'}}>
                        {isConnected &&<Box height='8px' width='8px' sx={{backgroundColor:"#06FC99", border: "1px solid #06FC99", borderRadius: "100%", marginRight: '8px'}}/>}
                        {isConnected &&<Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                        Referra Link
                        </Typography>}
                    </Stack>
                </Stack>

                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='48px' >
                    <input  style={{ border: "1px solid #333333", paddingLeft: '10px', width: '90%', height:'100%', outline:'null', backgroundColor: 'transparent', readonly: true, outline: 'none'}}  placeholder='Please Connect wallet first' defaultValue={refUrl} value={refUrl}/>
                    <button style={{ width: '10%', cursor: 'pointer',height:'100%', border:'none', outline:'null', backgroundColor: '#333333'}} onClick={handleCopy} > COPY </button>
                </Stack>
                
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                {/* <TextField id="outlined-number" label="Input amount" variant="outlied" type="number" sx={{ input: { color: 'white' } }} value={value} onChange={handleInput}/> */}
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',    marginTop: '16px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Tokens Subscribed
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {referaFund} USDT
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', marginBottom: '16px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Total Invitees
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                    {referaCount} 
                    </Typography>
                </Stack>
                
                <Stack width='100%' justifyContent="space-between" height='1px' sx={{borderTop: "1px solid #666666", display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}}/>
                <Typography variant="div" sx={{textTransform:'none', height: '40px', width: '90%', font: "400 normal 12px Arial", marginTop: '12px'}} >
                Through the referral link, the sharer will receive a 3% rebate from the participant&apos;s IDO contribution.
                </Typography>
            </Stack>
        </Stack>
        :
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='60%' maxWidth="620px" marginBottom="32px">
            <Stack direction='row' alignItems='baseline' sx={{columnGap: '4px'}} >
                <Image  alt="" src='./fire.png' width='32' height='32' />
                <Typography component='div' sx={{marginTop: '18px', font: '900 oblique 36px Arial'}}>
                0xCardinal IDO <span style={{color: "yellow"}}>END</span>
                </Typography>
            </Stack>
            {/* <Typography component='div' sx={{fontSize: '30px', fontStyle: 'italic', fontWeight: '700', marginTop: '48px'}}>
                <span style={{color: '#ea3423'}}>0x</span>
            </Typography> */}
            <Typography component='div' sx={{fontSize: '20px',  fontStyle: 'italic', fontWeight: '400', marginTop: '30px' }}>
            Please claim your tokens within the specified time.
            </Typography>
            <Typography component='div' sx={{fontSize: '20px',  fontStyle: 'italic', fontWeight: '400' }}>
            If you have a referral rebate, you can claim it immediately.
            </Typography>

            <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'30px', paddingBottom: '16px'}} >
                <Typography component='div' sx={{ font: '700 normal 20px sans',  padding: '8px 0px 16px 32px',  textAlign: 'left', width: '100%'}}>
                My Subscribed
                </Typography>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', fontStyle: 'italic', flexDirection: 'row', alignItems: 'center', marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Amount Spent
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400',  paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {isSuccess  ? (isWhitelist?formatAmount(BigInt(subscribed*whitelistPrice)):formatAmount(BigInt(subscribed*price))) : '--'} USDT
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex',  fontStyle: 'italic', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Subscription Price
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {isWhitelist?whitelistPrice:price} USDT
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex',  fontStyle: 'italic', flexDirection: 'row',  alignItems: 'center',  marginTop: '8px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Tokens Subscribed
                    </Typography>
                    <Typography component='div' sx={{fontSize: '16px', fontWeight: '400', paddingRight: '32px', textAlign: 'right', width: '90%'}}>
                        {formatAmount(BigInt(subscribed))} {token?.symbol}
                    </Typography>
                </Stack>

                <Stack width='90%' justifyContent="space-between" height='1px' sx={{borderTop: "1px solid #666666", display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '8px'}} />
                {claimInfo.map((data, index)=>{
                    return (
                        <Stack key={index} width='100%' justifyContent="space-between"  sx={{display: 'flex', fontStyle: 'italic', flexDirection: 'row', alignItems: 'center', marginTop: '8px'}}>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingLeft: '32px', textAlign: 'left', width: '30%'}}>
                            {formatTime(data)}
                            </Typography>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                            {formatAmount(BigInt(subscribed)/3n)} {token?.symbol} - 33.3%
                            </Typography>
                            {getClaimStatus(data, index)}
                        </Stack>
                    )
                })}
                
            </Stack>

            <Stack direction='column' justifyContent="space-between" alignItems="center" gap='4px' width='100%' sx={{border: "1px solid #7f7f7f", borderRadius: '10px', marginTop:'16px', }}>
                <Typography component='div' sx={{ font: '700 normal 20px sans', padding: '8px 0px 16px 32px', textAlign: 'left', width: '100%'}}>
                My Rebate
                </Typography>
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                {/* <TextField id="outlined-number" label="Input amount" variant="outlied" type="number" sx={{ input: { color: 'white' } }} value={value} onChange={handleInput}/> */}
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',  marginTop: 'px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Total Invitees
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                    {referaCount}
                    </Typography>
                </Stack>
                <Stack width='100%' justifyContent="space-between"  sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center',   marginBottom: '16px'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingLeft: '32px', textAlign: 'left', width: '40%'}}>
                    Tokens Subscribed
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400', color: '#06FC99', paddingRight: '32px', textAlign: 'right', width: '60%'}}>
                        {referaFund}
                    </Typography>
                </Stack>
                <Button variant="contained"  disabled={isConnected && referaFund == 0 } color='error' sx={{textTransform:'none', height: '40px', width: '90%', font: "400 normal 14px Arial", '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333333', color: "#aaaaaa"}}} onClick={handleFund}>
                    {referaFund!=0?isConnected?'Connect Wallet':'Claim':"You don&apos;t have a referral rebate"}
                </Button>
                <Stack width='100%' justifyContent="space-between" height='1px' sx={{borderTop: "1px solid #666666", display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '18px'}}/>
                <Typography variant="div" sx={{textTransform:'none', height: '40px', width: '90%', font: "400 normal 12px Arial", marginTop: '12px'}} >
                Through the referral link, the sharer will receive a 3% rebate from the participant&apos;s IDO contribution.
                </Typography>
            </Stack>
        </Stack>}
    </React.Fragment>);
}

export default IDO;