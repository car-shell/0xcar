import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Box, Card, CardActionArea, Typography, Button, Dialog, Stack} from '@mui/material'
import { useBlockNumber } from 'wagmi'
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


const WithdrawContent = ({token, amount})=> {
    return <>
        <Stack direction='column' alignItems='center' >
            <Typography gutterBottom sx={{font:'700 normal 36px Arial',color:'#06FC99'}}>
                {formatAmount((amount).toString())} {token?.symbol}
            </Typography>
            <Typography gutterBottom  sx={{font:'400 normal 16px Arial', color:'#fff'}}>
            10% of the current balance of the Prize Pool
            </Typography>
            <Typography sx={{font:'400 normal 13px Arial', color:'#f2f2f2', paddingTop: '32px'}} width='90%'>
            <span display='inline' style={{color:'#f59a23'}}>Tips: </span>  Please note that withdrawals are available every 15 days after the initial 90
                days of pool creation. Be mindful of the withdrawal dates; if missed, you&aposll have
                to wait until the next withdrawal opportunity.
            </Typography>
        </Stack>
    </>
}

const ClosureRulesContent = ({time}) => {
    return <><Stack direction='column' alignItems='left' sx={{border: '1px solid #333', borderRadius: '10px', padding: '8px 16px'}}>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial',color:'#f59a23'}}>
        Pool Closure Rules
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        1. The Prize pool can only be closed after 90 days from its creation.
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        2. Consider carefully before closing the pool. Once closed, it cannot be restored, and you will permanently lose ownership of the pool.
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        3. There is an opportunity to close the pool every 90 days. If you miss the closing window, you will have to wait another 90 days.
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial', paddingTop: '12px'}}>
        4. The next window for closing the pool is:
        </Typography>
        <Typography gutterBottom sx={{font:'400 italic 14px Arial',color:'#06FC99'}}>
        {time}
        </Typography>
    </Stack></>
}


const ClosureStepContent = ({steps, token, stepContent, amount}) => {
    return <> <Stack direction='column' alignItems='center' width='480px'>
        <Typography gutterBottom sx={{font:'700 normal 36px Arial',color:'#06FC99'}}>
            {formatAmount((amount).toString())} {token?.symbol}
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

const ClosureSuccessContent = ({}) => {
    return <><Stack direction='column' alignItems='center'  width='480px'>
        <Typography gutterBottom sx={{font:'700 normal 28px Arial',color:'#06FC99'}}>
        All withdrawals complete
        </Typography>
        <Typography gutterBottom sx={{font:'700 normal 28px Arial',color:'#06FC99'}}>
        Prize pool has been cancelled
        </Typography>
        <Stack direction='column' alignItems='left' sx={{border: '1px solid #333', borderRadius: '10px', padding: '16px 16px 16px 16px', marginTop: '32px'}} width="90%">
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Amount Withdrawn
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial',color:'#06FC99'}}>
                    489,500,000.00 CDNL
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Amount Withdrawn
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial',color:'#06FC99'}}>
                    489,500,000.00 CDNL
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='left' justifyContent='space-between'>
                <Typography gutterBottom sx={{font:'400 italic 16px Arial',color:'#fff'}}>
                    Amount Withdrawn
                </Typography>
                <Typography gutterBottom sx={{font:'400 normal 16px Arial',color:'#06FC99'}}>
                    489,500,000.00 CDNL
                </Typography>
            </Stack>
        </Stack>

    </Stack></> 
}


const PoolItem = ({poolPro, my=false}) => {
    const [pool, setPool] = React.useState(poolPro);
    const {token} = useTokenContract();
    const {preRemovePool, removePool, widthdrawPool} = useGameContract();
    const [openDialog, handleClose, props] = useCustomizedDialog()
    const [dialogInfo, setDialogInfo] = useState({})
    const { data: blockNumber, isLoading } = useBlockNumber()
    const [lockPoolStepInfo, {setLockPoolStepInfo}] = useState({active: 0})
    const {ToastUI, showToast} = useToast()

    const steps = ["Close pool", "Wait for 3 days", "Withdraw all"]
    const handleRemovePool = () => {
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

    const handleWithdrawPool = () => {
        withdrawPool(pool.id, ()=>{
            showToast("success", "success")
        }, (error)=>{
            showToast(error.shortMessage || error.message || error.reason, "error")
        })
    }

    const nextWidthdraw = () => {
        console.log( `cur ${blockNumber} -- ${pool.nextWidthdrawBlockNum}`);
        if (blockNumber > pool.nextWidthdrawBlockNum) {
            let pass = blockNumber - pool.nextWidthdrawBlockNum;
            if ( pass < 3600n*24n/3n ) {
                return 0;
            }
            let one_period = 3600n*24n*16n/3n;
            let mod = pass%one_period;
            if (mod < 3600n*24n/3n)  {
                return 0;
            }

            return one_period - mod;
        }

        return blockNumber - pool.nextWidthdrawBlockNum;
    }

    const nextLockPool = () => {
        let one_period = 3600n*24n*15n/3n;
        if (blockNumber > pool.createdBlockNum + one_period ) {
            let pass = blockNumber - pool.createdBlockNum - one_period;
            if ( pass < 3600n*24n*3n/3n ) {
                return 0;
            }
            let mod = pass%(one_period+3600n*24n*3n/3n);
            if (mod > one_period)  {
                return 0;
            } else {
                return mod - one_period;
            }
        }

        return blockNumber - (one_period + pool.createdBlockNum);
    }
    
    const handleClosePool = (pool) => { 
        let t = nextLockPool()
        if (!pool.isLocked) {
            if (blockNumber < pool.canEndBlockNum) {
                setLockPoolStepInfo({active: 1})
                setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: `Available for withdrawal in ${Number(pool.canEndBlockNum - blockNumber)*3}`, disable: true, action: null}})
            } else if (pool.isUsed) {
                setLockPoolStepInfo({active: 2})
                setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Withdraw All', disable: false, action: handleRemovePool}})
            }
        } else if (t<0) {
            setDialogInfo({title: "Close Pool", context: "ClosureRulesContent", button: {title: 'Got It', disable: false, action: null}})
        } else if (pool.isUsed) {
            setDialogInfo({title: "Close Pool", context: "ClosureStepContent", button: {title: 'Close Pool', disable: false, action: handleRemovePool}})
        } else if (!pool.isUsed) {
            setDialogInfo({title: "Close Pool", context: "ClosureSuccessContent", button: {title: 'Got It', disable: false, action: null}})
        }

        openDialog()
    }

    const handleWithdraw = () =>{
        let t = nextWidthdraw();
        console.log(`new widthdraw time is ${Number(t)*3}`);
        if (t<0) {
            let d = new Date((new Date()).getTime()+(Number(-t)*3*1000))
            setDialogInfo({title: "Withdraw", context: "WithdrawContent", button: {title: `Please withdraw on ${d}`, disable: true, action: null}})
        } else {
            setDialogInfo({title: "Withdraw", context: "WithdrawContent", button: {title: 'Withdraw', disable: false, action: handleWithdrawPool}})
        }
        openDialog()
    }

   
    return <>
        {!isLoading && <Box  width='100%'>
            <Box  width='100px' height='32px' sx={{position: 'relative',  top: '10px', left: '10px', textAlign: 'center', border: pool.id==1n?'1px solid #F59A23':'1px solid #797979', borderRadius: '50px', font: "700 normal 14px Arial", lineHeight: '32px', color: 'white', backgroundColor: pool.id==1n?'#F59A23':'black' }} >
                    #00{Number(pool.id)} Pool
            </Box>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '128px', border: pool.id==1n?'1px solid #F59A23':'1px solid #797979', backgroundColor: 'transparent' , borderRadius: '10px'}}>
                <Box alignItems='center' sx={{display: 'flex', flexDirection: 'column', paddingRight: '28px', borderRight: pool.id==1n?'1px solid #F59A23':'1px solid #797979', width:'56%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: pool.id==1n?'#F59A23':"white", width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Initial Pool Fund
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {formatAmount(pool?.initBalance)} {token?.symbol}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: pool.id==1n?'#F59A23':"white",width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Current Pool Balance
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {formatAmount(pool?.remainBalance)} {token?.symbol}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: pool.id==1n?'#F59A23':"white", width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Bet count
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {Number(pool?.betCount)}
                        </Typography>
                    </Box>
                </Box>
                { !my?
                <Box sx={{display: 'flex', flexDirection: 'column',  alignItems: 'center', width:'44%'}}>
                    <BaseLink href={"/pool/"+pool.id} style={{width: "64%"}} >
                        <Button variant="contained" sx={{width: "100%", height:'50px', backgroundColor: pool.id==1n?'#F59A23':"#d9001b", borderRadius: '150px'}} >
                                Bet
                        </Button>
                    </BaseLink>
                </Box>
                    :
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '16px', color: pool.id==1n?'#F59A23':"white", width:'42%', columnGap: '24px'}}>
                    <Button variant="contained" color="error" sx={{borderRadius: '90px',  width: "170px"}} onClick={handleWithdraw} >
                    Withdraw
                    </Button>
                    <Button variant="contained" color="error" sx={{borderRadius: '90px',  width: "170px"}} onClick={handleClosePool} >
                    Close Pool
                    </Button>
                </Box>}
            </Card>
        </Box>}
        <DialogFrame {...props} title={dialogInfo.title} button={dialogInfo.button}> 
            {dialogInfo.context == "WithdrawContent"?
            <WithdrawContent token={token} amount={pool?.remainBalance/10n} />:
            dialogInfo.context == "ClosureRulesContent"?
            <ClosureRulesContent time={ (new Date((new Date()).getTime()+(Number(-nextLockPool())*3*1000))).toString() }/>:
            dialogInfo.context == "ClosureStepContent"?
            <ClosureStepContent token={token} steps={steps} stepContent={lockPoolStepInfo} amount={pool?.remainBalance} />:
            <ClosureSuccessContent />
            }
        </DialogFrame>
        <ToastUI />
    </>
}

export default PoolItem;