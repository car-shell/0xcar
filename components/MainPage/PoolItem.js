import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Box, Card, CardActionArea, Typography, Button, Dialog, Stack} from '@mui/material'

import { useBlockNumber, useAccount} from 'wagmi'
import Image from 'next/image'
import { formatAmount, n1e18, formatTime } from "../utils";
import BaseLink from "../Head/BaseLink"
import { useGameContract } from "../../data/game";
import { useTokenContract } from "../../data/token";
import { useCustomizedDialog, DialogFrame } from './DialogFrame'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import useToast from '../Toast'
import Link from 'next/link'


const WithdrawContent = ({token, amount})=> {
    return <>
        <Stack direction='column' alignItems='center' >
            <Typography gutterBottom sx={{font:'700 normal 36px Arial',color:'#06FC99'}}>
                {amount + " " + token?.symbol.toString()}
            </Typography>
            <Typography gutterBottom  sx={{font:'400 normal 16px Arial', color:'#fff'}}>
            10% of the initial balance of the Prize Pool
            </Typography>
            <Typography sx={{font:'400 normal 13px Arial', color:'#f2f2f2', paddingTop: '32px'}} width='90%'>
            <span display='inline' style={{color:'#f59a23'}}>Tips: </span>  Please note that withdrawals are available every 15 days after the initial 90
                days of pool creation. Be mindful of the withdrawal dates; if missed, you&aposll have
                to wait until the next withdrawal opportunity.
            </Typography>
        </Stack>
    </>
}

const WithdrawSuccessContent = ({token, withdrawContentInfo}) => {
    return <><Stack direction='column' alignItems='center'  width='480px'>
        <Typography gutterBottom sx={{font:'700 italic 28px Arial',color:'#8400FF'}}>
        Congratulation!
        </Typography>
        <Typography gutterBottom sx={{font:'700 italic 28px Arial',color:'#06FC99'}}>
        Withdrawal Successful
        </Typography>
        <Stack direction='column' alignItems='left' sx={{border: '1px solid #333', borderRadius: '10px', padding: '16px 16px 16px 16px', marginTop: '32px'}} width="90%">
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Amount Withdrawn
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial'}}>
                    {formatAmount(withdrawContentInfo.amount)} {token?.symbol} 
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Withdrawal Time
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial'}}>
                    {formatTime(withdrawContentInfo.time, true)}
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Transaction Hash
                </Typography>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#41A0DA'}}>
                    <Link href={"https://testnet.bscscan.com/tx/" + withdrawContentInfo.hash} target='_blank'>
                        {withdrawContentInfo.hash.slice(0,6)+"..."+withdrawContentInfo.hash.slice(-6)}
                    </Link>
                </Typography>
            </Stack>
        </Stack>

    </Stack></> 
}

const ClosureRulesContent = ({}) => {
    return <><Stack direction='column' alignItems='left' sx={{border: '1px solid #333', borderRadius: '10px', padding: '8px 16px'}}>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial',color:'#f59a23'}}>
        Pool Closure Rules
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        1. When the balance of the prize pool falls below 30% of the initial amount, you may choose to close the pool.
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        2. Consider carefully before closing the pool. Once closed, it cannot be restored, and you will permanently lose ownership of the pool.
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        3. After the prize pool is locked, you can withdraw the entire balance 3 days later.
        </Typography>
    </Stack></>
}


const ClosureStepContent = ({steps, token, stepContent, amount}) => {
    return <> <Stack direction='column' alignItems='center' width='520px'>
        <Typography gutterBottom sx={{font:'700 normal 36px Arial',color:'#06FC99'}}>
            {formatAmount(amount)} {token?.symbol}
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial'}}>
        Prize Pool Balance
        </Typography>
        <Stepper activeStep={stepContent.active} alternativeLabel sx={{width: '100%', marginTop: '16px'}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{'& .MuiStepIcon-root': {
            color: 'gray', // circle color (COMPLETED)
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: '#5bc67e', // circle color (COMPLETED)
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: '#5bc67e', // circle color (COMPLETED)
          },
          '& .MuiStepLabel-alternativeLabel': {
            color: 'common.white', // circle color (COMPLETED)
            fontStyle: 'italic'
          },
          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':{
                color: 'common.white', // Just text label (COMPLETED)
                fontStyle: 'italic'
            },
          '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':{
                color: 'common.white', // Just text label (ACTIVE)
                fontStyle: 'italic'
            },
            '& .MuiStepLabel-root.Mui-active': {
                color: 'common.white', // circle color (ACTIVE)
              },
          '& .MuiStepIcon-root .MuiStepIcon-text': {
            fill: '#000 !important', // circle's number (ACTIVE)
          }
          }}>
                {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack></>
}

const ClosureSuccessContent = ({token, withdrawContentInfo}) => {
    return <><Stack direction='column' alignItems='center'  width='480px'>
        <Typography gutterBottom sx={{font:'700 italic 28px Arial',color:'#06FC99'}}>
        All withdrawals complete
        </Typography>
        <Typography gutterBottom sx={{font:'700 italic 28px Arial',color:'#06FC99'}}>
        Prize pool has been <span style={{color: 'white'}}>cancelled</span>
        </Typography>
        <Stack direction='column' alignItems='left' sx={{border: '1px solid #333', borderRadius: '10px', padding: '16px 16px 16px 16px', marginTop: '32px'}} width="90%">
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Amount Withdrawn
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial',color:'#06FC99'}}>
                    {formatAmount(withdrawContentInfo.amount)} {token?.symbol} 
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                Widthdraw Time
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial',color:'#06FC99'}}>
                {formatTime(withdrawContentInfo.time, true)}
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Transaction Hash
                </Typography>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#41A0DA'}}>
                    <Link href={"https://testnet.bscscan.com/tx/" + withdrawContentInfo.hash} target='_blank'>
                        {withdrawContentInfo.hash.slice(0,6)+"..."+withdrawContentInfo.hash.slice(-6)}
                    </Link>
                </Typography>
            </Stack>
        </Stack>

    </Stack></> 
}


const PoolItem = ({poolPro, my=false}) => {
    const [pool, setPool] = React.useState(poolPro);
    const {token} = useTokenContract();
    const {preRemovePool, removePool, withdrawPool, whitelistPool} = useGameContract();
    const [openDialog, handleClose, props] = useCustomizedDialog()
    const [dialogInfo, setDialogInfo] = useState({})
    const [withdrawContentInfo, setWithdrawContentInfo] = useState({})

    const { data: blockNumber, isLoading } = useBlockNumber()
    const [lockPoolStepInfo, setLockPoolStepInfo] = useState({active: 0})
    const {ToastUI, showToast} = useToast()
    const {address} = useAccount();

    const steps = ["Lock pool", "Wait for 3 days", "Withdraw all"]

    React.useEffect(() => {
        setPool(poolPro);
    }, [poolPro]);

    
    const handleRemovePool = () => {
        if (pool.isLocked) {
            setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Processing...', disable: true, action: null}})
            removePool(pool.id, (data)=>{
                showToast("success", "success");
                setWithdrawContentInfo({hash: data, time: new Date(), amount: pool.remainBalance})
                setDialogInfo({title: "Close Pool", context: "ClosureSuccessContent", button: {title: 'Got It', disable: false, action: null}})
            }, (error)=>{
                console.log(error);
                showToast(error.shortMessage || error.message || error.reason, "error")
                handleClose()
            })
        } else {
            setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Processing...', disable: true, action: null}})
            preRemovePool(pool.id, ()=>{
                showToast("success", "success")
                setLockPoolStepInfo({active: 1})
                setDialogInfo((pre)=>{
                    return {title: "Close Pool", context: "ClosureStepContent", button: {title: 'Available for withdrawal in', time: Number(pool.canEndBlockNum - blockNumber)*3, disable: true, action: null}}
                })
            }, (error)=>{
                console.log(error);
                showToast(error.shortMessage || error.messag || error.reason, "error")
                handleClose()
            })
        }
    }

    const handleWithdrawPool = () => {
        setDialogInfo({title: "Withdraw", context: "WithdrawContent", button: {title: 'Processing...', disable: true, action: null}})
        withdrawPool(pool.id, (data)=>{
            setWithdrawContentInfo({hash: data, time: new Date(), amount: pool.initBalance/10n})
            setDialogInfo({title: "Withdraw", context: "WithdrawSuccessContent", button: {title: 'Got it', disable: false, action: null}})
            showToast("success", "success")
        }, (error)=>{
            showToast(error.shortMessage || error.message || error.reason, "error")
            handleClose()
        })
    }

    const nextWidthdraw = useCallback(() => {
        // let one_period = 3600n*24n*16n/3n;
        let one_period = 3600n*3n/3n;
        // let widthdraw_period = 3600n*24n/3n
        let widthdraw_period = 3600n/3n

        console.log( `cur ${blockNumber} -- ${pool.nextWidthdrawBlockNum}`);
        if (blockNumber > pool.nextWidthdrawBlockNum) {
            let pass = blockNumber - pool.nextWidthdrawBlockNum;
            if ( pass < widthdraw_period ) {
                return 0;
            }
            let mod = pass%one_period;
            if (mod < widthdraw_period)  {
                return 0;
            }

            return mod - one_period;
        }

        return blockNumber - pool.nextWidthdrawBlockNum;
    }, [pool, blockNumber])
    
    const handleClosePool = () => { 
        if (pool.isLocked && pool.isUsed) {
            if (blockNumber < pool.canEndBlockNum) {
                setLockPoolStepInfo({active: 1})
                setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: `Available for withdrawal in`, time: Number(pool.canEndBlockNum - blockNumber)*3, disable: true, action: null}})
            } else if (pool.isUsed) {
                setLockPoolStepInfo({active: 2})
                setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Withdraw All', disable: false, action: handleRemovePool}})
            }
        } else if (pool.remainBalance+pool.lockedBalance > pool.initBalance*30n/100n && pool.isUsed) {
            setDialogInfo({title: "Close Pool", context: "ClosureRulesContent", button: {title: 'Got It', disable: false, action: null}})
        } else if (pool.isUsed) {
            setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Lock Pool', disable: false, action: handleRemovePool}})
        } 

        openDialog()
    }

    const handleWithdraw = () =>{
        let t = nextWidthdraw();
        console.log(`new widthdraw time is ${Number(t)*3}`);
        if (t<0 && pool.remainBalance+pool.lockedBalance > pool.initBalance*30n/100n) {
            let d = new Date((new Date()).getTime()+(Number(-t)*3*1000))
            let end = (new Date(d)).setDate(d.getDate() + 1);
            setDialogInfo({title: "Withdraw", context: "WithdrawContent", button: {title: `Please withdraw between ${formatTime(d, true)} and ${formatTime(end, true)}`, disable: true, action: null}})
        } else {
            setDialogInfo({title: "Withdraw", context: "WithdrawContent", button: {title: 'Withdraw', disable: false, action: handleWithdrawPool}})
        }
        openDialog()
    }

    const padStart = (x) => {
        return new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 3,
            useGrouping: false
        }).format(x)
    } 

    return <>
        {!isLoading && <Box  width='100%' sx={{minWidth: '1080px'}} >
            <Box  width='100%' height='32px' sx={{position: 'relative',  top: '10px', left: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                <Box  width='100px' height='32px' sx={{textAlign: 'center', border: pool.id==1n?'1px solid #F59A23':'1px solid #797979', borderRadius: '50px', font: "700 normal 14px Arial", lineHeight: '32px', color: 'white', backgroundColor: pool.id==1n?'#F59A23':'black' }} >
                    # {pool.id==1?"Official":padStart(Number(pool.id))} Pool
                </Box>
                {!my && whitelistPool==pool.id && <Box  width='100px' height='32px' sx={{textAlign: 'center',  font: "700 italic 14px Arial", lineHeight: '32px', color: '#06FC99', backgroundColor: 'transparent', marginBottom: '8px', marginRight: '10px' }} >
                    Fee Reduction
                </Box>}
            </Box>
            <Card variant="outlined" sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center',  border: pool.id==1n?'1px solid #F59A23':'1px solid #797979', backgroundColor: 'transparent' , borderRadius: '10px'}}>
                <Box alignItems='center' sx={{ width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '128px'}}>
                    <Box alignItems='center' sx={{display: 'flex', flexDirection: 'column', borderRight: pool.id==1n?'1px solid #F59A23':'1px solid #797979', width:'56%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', color: pool.id==1n?'#F59A23':"white", width: '100%'}}>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', width: '160px'}}>
                                Initial Pool Fund
                            </Typography>
                            <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', textAlign: 'right', width: '200px'}}>
                                {formatAmount(pool?.initBalance)} {token?.symbol}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', color: pool.id==1n?'#F59A23':"white",width: '100%'}}>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400',  width: '160px'}}>
                                Current Pool Balance
                            </Typography>
                            <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', textAlign: 'right', width: '200px'}}>
                                {formatAmount(pool?.remainBalance)} {token?.symbol}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',color: pool.id==1n?'#F59A23':"white", width: '100%'}}>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', width: '160px'}}>
                                Bet count
                            </Typography>
                            <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', textAlign: 'right', width: '200px'}}>
                                {Number(pool?.betCount)}
                            </Typography>
                        </Box>
                    </Box>

                    { !my?
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center',  alignItems: 'center', width:'42%'}}>
                        <BaseLink href={"/pool?id="+pool.id} style={{width: "280px"}} >
                            <Button variant="contained" color="error"  sx={{ width: "100%", height:'50px', backgroundColor: pool.id==1n?'#F59A23':"#d9001b", borderRadius: '150px', textTransform:'none' }} >
                                    Bet
                            </Button>
                        </BaseLink>
                    </Box>
                        :
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', color: pool.id==1n?'#F59A23':"white", width:'44%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', width: '160px'}}>
                            Cumulative Earnings
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', textAlign: 'right', width: '200px'}}>
                            {formatAmount(pool?.income)} {token?.symbol}
                        </Typography>
                    </Box>
                    }
                </Box>

                { my && 
                <Box alignItems='center' sx={{ width: '100%', height: '64px', display: 'flex', flexDirection: 'row', alignItems: 'center', borderTop: pool.id==1n?'1px solid #F59A23':'1px solid #797979'}}>
                    <Box alignItems='center' sx={{display: 'flex', flexDirection: 'column', width:'56%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', color: pool.id==1n?'#F59A23':"white", width: '100%'}}>
                            <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', width: '160px'}}>
                            Created Time
                            </Typography>
                            <Typography component='div' sx={{fontSize: '18px', fontWeight: '650', textAlign: 'right', width: '200px'}}>
                            {pool?.startTimestamp?formatTime(new Date(Number(pool.startTimestamp)*1000).toString(), true):'--'}
                            </Typography>
                        </Box>
                    </Box>

                    {pool.isUsed?
                    <Box sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', color: pool.id==1n?'#F59A23':"white", width:'42%'}}>
                        <Button variant="contained" color="error" sx={{textTransform: 'none',borderRadius: '90px', height: '32px',  width: "170px"}} onClick={handleWithdraw} >
                        Withdraw
                        </Button>
                        <Button variant="contained" color="error" sx={{textTransform: 'none', borderRadius: '90px', height: '32px',  width: "170px"}} onClick={handleClosePool} >
                        Close Pool
                        </Button>
                    </Box>
                    :
                    <Stack direction='row' justifyContent="center" width="42%" alignItems='center' sx={{marginLeft: '16px'}}>
                    <Button variant="contained" disabled sx={{textTransform: 'none', borderRadius: '90px', height: '32px',  width: "340px", '&.MuiButton-contained.Mui-disabled': {backgroundColor: '#333', color: "#ccc"}}} onClick={handleWithdraw} >
                    The prize pool has been closed
                    </Button>
                    </Stack>}

                </Box>}
                
            </Card>
            
        </Box>}
        <DialogFrame {...props} title={dialogInfo.title} button={dialogInfo.button} tail={dialogInfo.context == "ClosureStepContent" && lockPoolStepInfo.active==0}> 
            {dialogInfo.context == "WithdrawContent"?
            <WithdrawContent token={token} amount={formatAmount(pool?.initBalance/10n)} />:
            dialogInfo.context == "ClosureRulesContent"?
            <ClosureRulesContent />:
            dialogInfo.context == "ClosureStepContent"?
            <ClosureStepContent token={token} steps={steps} stepContent={lockPoolStepInfo} amount={pool?.remainBalance} />:
            dialogInfo.context == "ClosureSuccessContent"?
            <ClosureSuccessContent token={token} withdrawContentInfo={withdrawContentInfo} />:
            dialogInfo.context == "WithdrawSuccessContent"?
            <WithdrawSuccessContent token={token} withdrawContentInfo={withdrawContentInfo}/>:
            <></>
            }
        </DialogFrame>
        <ToastUI />
    </>
}

export default PoolItem;