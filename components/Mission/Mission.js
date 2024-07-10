import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack, TextField} from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Image from 'next/image'
import { useAccount, useSignMessage, useConnect } from "wagmi";
import { useIDOContract } from "../../data/ido";
import { useTokenContract } from "../../data/token";
import { useSwapContract } from "../../data/swap";
import { amountFromFormatedStr, formatAmount, formatTime, formatDuration, n1e18} from "../utils"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from "next/link";
import { useRouter } from 'next/router'
import { getUrl, post } from "../../pages/api/axios";
import useToast from '../Toast'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import useDispatch from '../../store/useDispatch'
import { store, SET_CONNECTED } from '../../store/store'
import LuckyWheelModal from '../LuckyWheel/LuckyWheelModal'


const Mission = ({referral}) => {
    const {token} = useTokenContract();
    const {address, isConnected} = useAccount()
    const {ToastUI, showToast} = useToast()

    const {openConnectModal} = useConnectModal()
    const router = useRouter()
    const [message, setMessage] = useState('hello');

    const [activites, setActivites] = useState([]);
    const [userActivites, setUserActivites] = useState([]);
    const [user, setUser] = useState({});
    const {state:{connected: {connected, verifid}}} = useContext(store)
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(()=>{
        getActives()
    }, [])

    useEffect(()=>{
        if (isConnected) {
            let token = sessionStorage.getItem(`cur_token_${address}`)
            if (token) {
                getMe()
                getUserActives()
            }
        } else {
            setUser({})
            setUserActivites([])
        }
    
    }, [isConnected, verifid])

    useEffect(()=>{
        sessionStorage.setItem('cur_address', address);
    }, [address])
    
    const getActives = async () => {
        const resp = await getUrl("/activite/list")
        console.log(resp.data)
        
        setActivites(resp.data.filter(item=> item.atype == ('retweet') || item.atype == ('has_role') || item.atype == ('follow') || item.atype == ('place_bet')))
    }
    
    const getMe = async () => {
        const resp = await getUrl("/user/me")
        console.log(resp.data)
        setUser(resp.data)
    }

    const copyURL = (e) => {
        navigator.clipboard.writeText(`https://testnet.0xcarinal.io/mission?referral=${user.referral}`);
        e.nativeEvent.stopImmediatePropagation();
        showToast('URL copied')
    }

    const getUserActives = async () => {
        const resp = await getUrl("/user_activite/list")
        console.log(resp.data)
        setUserActivites([...resp.data])
    }

    const checkRetweet = async () => {
        const resp = await getUrl("/x/retweeted")
        console.log(resp)
        if ( resp.data.isFollowed ) {
            showToast("check success")
            getUserActives()
            getMe()
        } else {
            showToast("You haven\'t completed the task yet. Please finish the task before checking.", 'warning')
        }
    }

    const checkFollowed = async () => {
        const resp = await getUrl("/x/followed")
        console.log(resp)
        if ( resp.data.isRetweeted ) {
            showToast("check success")
            getUserActives()
            getMe()
        } else {
            showToast("You haven\'t completed the task yet. Please finish the task before checking.", 'warning')
        }
    }   

    const hasRole = async () => {
        const resp = await getUrl("/discord/has_role")
        console.log(resp.data.has_role)
        if ( resp.data.has_role ) {
            showToast("check success")
            getUserActives()
            getMe()
        } else {
            showToast("You haven\'t completed the task yet. Please finish the task before checking.", 'warning')
        }
    }   

    const discordLogin = async () => {
        let resp = await getUrl("/discord/login")
        console.log(resp.data)
        window.open(resp.data, '_bank')
    }

    const xLogin = async ()=>{
        let resp = await getUrl("/x/login")
        console.log(resp.data)
        window.open(resp.data, '_bank')
    }

    const betRecordCheck = async (cnt)=>{
        const resp = await getUrl("/bet_record/check")
        console.log(resp.data)
        if (resp.data.count >= cnt) {
            showToast('check success!')
            getUserActives()
            getMe()
        } else {
            showToast('You haven\'t completed the task yet. Please finish the task before checking.!', 'warning')
        }   
    }

    const handleCheck = useCallback(async (r)=> {
        if (!isConnected) {
            openConnectModal()
            return
        }
    
        if (!user.t_user_id && (r.atype=='retweet' || r.atype=='follow')) {
            xLogin()
            getMe()
        } else if(!user.d_user_id && (r.atype=='has_role')){
            discordLogin()
            getMe()
        } else {
            console.log(r.atype)
            
            switch(r.atype) {
                case 'retweet':
                    checkRetweet()
                    break
                case 'follow':
                    checkFollowed()
                    break
                case 'has_role':
                    hasRole()
                    break
                case 'place_bet':
                    betRecordCheck(parseInt(r.additional))
                    break;
            }

        }
    })
    const done = useCallback((r) => {
        return (userActivites.findIndex((x)=>(x.activite_id==r.id && x.user_id==user.id)) != -1)
    }, [userActivites])

    const getGoStyle = (r)=>{
        return {
            font: '400 normal 16px Arial',
            visibility: done(r)?"hidden":"visible",
            height: '35px', 
            width: '120px',
            backgroundColor: '#555', 
            textTransform: 'none', 
            flex: 1, 
            marginRight: '4px', 
            border: '1px solid #555555', 
            borderRadius: '10px',
        }
    }
    const checkButton = useCallback((r)=> {
        if (done(r)) {
            return <><Image style={{marginRight: '44px', marginLeft: '44px'}} width='32' height='32' alt="" placeholder='empty' src='Done.png'>
            </Image>
            </>
        } else {
            return <><Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1, border: '1px solid #555555', borderRadius: '10px' }} onClick={()=>{
                handleCheck(r)
            }}>
            Check
            </Button>
            </>
        }
        
    }, [userActivites])

    const goButton = useCallback((r) => {
        switch( r.atype ) {
            case 'follow':
                return <><Button variant='contained' sx={getGoStyle(r)}  >
                        <a target="_blank"
                        rel="noreferrer"
                        href="https://twitter.com/0xcardinal_io">
                        GO</a>
                    </Button></>
            case 'retweet':
                return <><Button variant='contained' sx={getGoStyle(r)}  >
                    <a target="_blank"
                        rel="noreferrer"
                        href={`https://twitter.com/intent/retweet?tweet_id=${r.additional}`}>
                        GO
                    </a>
                    </Button></>
            case 'has_role':
                return <><Button variant='contained' sx={getGoStyle(r)}  >
                <a target="_blank"
                    rel="noreferrer"
                    href="https://discord.gg/6b6JFrNzsT">
                    GO</a>
                    </Button></>
            case 'place_bet':
                return <><Button variant='contained' sx={getGoStyle(r)} onClick={()=>{router.push({ pathname: "/pool", query: {'id': 1}})}}  >
                        GO
                    </Button></>
        }
    }, [userActivites])

    return (<React.Fragment>
        <ToastUI />
        <LuckyWheelModal open={open} handleClose={handleClose} />
        <Stack direction='column' justifyContent="space-between" alignItems="center" width='80%' maxWidth="1024px" marginBottom="32px"  marginTop="32px" sx={{fontStyle: 'italic'}}>
            <Typography component='div' sx={{marginTop: '18px', font: '700 normal 36px Arial'}}>
            Ultimate Mission: Break of Dawn
            </Typography>
            <Typography component='div' sx={{font: '700 normal 16px Arial', marginTop: '12px' }}>
            The final mission is now live. The deadline will be announced in advance on our official Twitter, so stay tuned.
            </Typography>
            <Typography component='div' sx={{font: '700 normal 16px Arial',  marginTop: '12px' }}>
            Mission points directly determine airdrop shares. Give it your all and claim the biggest rewards!
            </Typography>
            <Stack direction='row' justifyContent="space-between" alignItems="center" width='80%' marginBottom="24px"  marginTop="24px">
                <Stack direction='column' justifyContent="space-between" alignItems="center" width='80%' marginBottom="24px"  marginTop="24px">
                    <Typography component='div' sx={{font: '400 normal 14px Arial', marginTop: '12px' }}>
                    Total Referrals
                    </Typography>
                    <Typography component='div' sx={{font: '700 normal 36px Arial', marginTop: '12px' }}>
                    {userActivites.reduce((total, v)=>{
                        if (v.activite_id==1) 
                            return total+1;
                        else 
                            return total;
                        }, 0)}
                    </Typography>
                </Stack>
                <Stack direction='column' justifyContent="space-between" alignItems="center" width='80%' marginBottom="24px"  marginTop="24px">
                    <Typography component='div' sx={{font: '400 normal 14px Arial', marginTop: '12px' }}>
                    POINTS
                    </Typography>
                    <Typography component='div' sx={{font: '700 normal 36px Arial', marginTop: '12px' }}>
                    {user.total_points || 0}
                    </Typography>
                </Stack>
                <Stack direction='column' justifyContent="space-between" alignItems="center" width='80%' marginBottom="24px"  marginTop="24px">
                    <Stack direction='row' justifyContent="space-between" alignItems="center" sx={{marginTop: '12px' }} columnGap='4px'>
                        <Typography component='div' sx={{font: '400 normal 14px Arial'}}>
                        Referral Code
                        </Typography>
                        <Image src='/ask.png' alt=''  width='16' height='16' onClick={()=>{}}/>
                    </Stack>
                    <Stack direction='row' justifyContent="space-between" alignItems="center" sx={{marginTop: '12px' }} columnGap='4px' onClick={copyURL}>
                        <Typography component='div' sx={{font: '700 normal 36px Arial' }}>
                        {user.referral || '--' }
                        </Typography>
                        <Image src='/referral.png' alt=''  width='28' height='28' />
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction='column' justifyContent="space-between" alignItems="center" width='100%' marginBottom="32px" backgroundColor="#1C1C1C">
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px' backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial' , flex: 9}} >
                    Participate in the daily lottery to earn more points
                    </Typography>
                    <Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1, border: '1px solid #555555', borderRadius: '10px' }} onClick={()=>{
                        if (!isConnected) {
                            openConnectModal()
                        } else {
                            handleOpen()
                        }
                    }}  >
                    GO
                    </Button>
                </Stack>
                {activites.map((r)=>{
                    return (
                    <Stack key={r.id} direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                        <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 6 }} >
                        {r.description}
                        </Typography>
                        <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2 }} >
                        {r.points} PTS
                        </Typography>
                        {goButton(r)}
                        {checkButton(r)}
                    </Stack>)
                })}
                {/* <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 6 }}  >
                    Follow @0xcardinal on X!
                    </Typography>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2}} >
                    2000 PTS
                    </Typography>
                    <Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1}}  >
                    <a target="_blank"
                        rel="noreferrer"
                        // class="twitter-follow-button"
                        href="https://twitter.com/0xcardinal_io">
                        Follow 0xcardinal</a>
                    </Button>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex:  6}} >
                    Like and retweet this  post on X!
                    </Typography>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2}} >
                    100 PTS
                    </Typography>
                    <Button variant='contained'  sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1}}  >
                    <a target="_blank"
                        // class="twitter-share-button"
                        rel="noreferrer"
                        href="https://twitter.com/intent/retweet?tweet_id=1802427191193448773">
                        Tweet</a>
                    </Button>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex:  6}} >
                    Have the Verified role in a Discord server
                    </Typography>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2}} >
                    2000 PTS
                    </Typography>
                    <Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1}} onClick={()=>handleCheck(checkRetweet)}>
                    Check
                    </Button>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex:  6}} >
                    Place more than 10 bets on the 0xcardinal testnet
                    </Typography>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2}} >
                    2000 PTS
                    </Typography>
                    <Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1}}  onClick={()=>discordLogin()}>
                    Login with Twitter
                    </Button>
                </Stack>
                <Stack direction='row' justifyContent="space-between" alignItems="center" width='90%' height='58px' margin="24px 24px 12px 12px" padding='0 16px 0 16px'  backgroundColor="black" border="1px solid black" borderRadius='5px'>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex:  6}} >
                    Place more than 10 bets on the 0xcardinal testnet
                    </Typography>
                    <Typography component='div' sx={{font: '400 normal 16px Arial', flex: 2}} >
                    2000 PTS
                    </Typography>
                    <Button variant='contained' sx={{font: '400 normal 16px Arial', height: '35px', width: '120px', backgroundColor: '#555', textTransform: 'none', flex: 1}} onClick={()=>hasRole()} >
                    Check
                    </Button>
                </Stack>
                 */}
            </Stack>
        </Stack>
        
    </React.Fragment>)
}

export default Mission;