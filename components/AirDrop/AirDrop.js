
import {Tabs, Tab, Box, Card, Typography, Button, IconButton, CardActionArea, Checkbox} from '@mui/material'
import {useState, useEffect, useCallback} from 'react'
import { useAccount } from 'wagmi'
import { useTokenContract } from "../../data/token";
import Image from 'next/image'
import s from '../../styles/NFT.module.css'
import useNFTContract from '../../data/nft'
import Modal, { ConfirmationModal, useModal } from '../Tips';
import Fireworks from "../animPaper";
import useToast from '../Toast'
import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

const Airdrop = () => {
    const nftConstInfo = {
        3: {name: 'Gold',   dividend: 1.2,  fee: '4%', color: '#ffd700'}, 
        2: {name: 'Silver', dividend: 1,    fee: '2%', color: '#d7d7d7'}, 
        1: {name: 'Bronze', dividend: 0,    fee: '1%', color: '#00c0c0'}
    }
    const router = useRouter();
    const [showFireworks, setShowFireworks] = useState(false)
    const {ownList, getNFT, canClaimLevel: canClaim, fuse, claim} = useNFTContract()
    const { isShown, toggle } = useModal();
    const [modal, setModal] = useState({
        header: '',
        msg: '',
        sureText: ''
    });
    const [isLoading, setIsLoading] = useState(false)
    const {ToastUI, showToast} = useToast()
    let _rank = canClaim?.level
    const {address} = useAccount()
    const { openConnectModal } = useConnectModal();

    useEffect(()=>{
        if (canClaim?.level != 0) {
            setShowFireworks(true);
            setTimeout(() => {
                setShowFireworks(false);
                // setModal({ header: 'Congratunations',
                //     msg: 'You are eligible!!!',
                //     sureText: 'Got it'});
                // toggle(true)
            }, 4000); 
        }
    }, [canClaim])
    // const NFTAirdropCard = ({title, level}) => {
    //     return <>
    //         <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', padding: '8px 8px 12px 12px', height: '340px', width: '260px',
    //             borderColor: '#333',
    //             color: '#fff',
    //             backgroundColor: nftConstInfo[level].color}}>
    //             <Image width='200' height='200' alt='nft image' src='/cardinal.png' />
    //             <Typography component='div' variant='subtitle1' sx={{textAlign: 'center',  padding: '8px 8px 0px 0px'}}>
    //                 {title}
    //             </Typography>
    //             <Button variant="outlined" disabled={level!==canLevel?true:false} sx={{marginTop: '12px' }} onClick={async ()=>{
    //                 await claim((r)=>{
    //                     showToast('claim success', 'success');
    //                 }, (e)=>{
    //                     showToast(e.reason, 'success')
    //                 })
    //             }}>
    //                 Claim
    //             </Button>
    //         </Card>
    //     </>
    // }

    const NFTAirdropListItem = ({data, ranking}) => {
        const level = data.rank
        return <>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', padding: '8px 8px 12px 12px', height: '54px', width: '618px', backgroundColor: '#000',
                borderColor: '#333', color: '#fff'}} >
                <Typography component='div' sx={{ fontSize: '14px', flex: 8, textAlign: 'center',  padding: '8px 8px 0px 0px', textAlign: 'left'}}>
                    {data.title}
                </Typography>
                <Typography component='div' sx={{ fontSize: '14px', flex: 4, textAlign: 'center',  padding: '8px 8px 0px 0px', textAlign: 'left'}}>
                    Rank：<span style={{color: nftConstInfo[level].color}}>{data.rankName}</span>
                </Typography>
                <Checkbox disabled checked={_rank==ranking}  color="secondary" sx={{ fontSize: '14px', flex: 1, textAlign: 'center',  padding: '8px 8px 0px 0px', textAlign: 'left', '& .MuiSvgIcon-root': { color: _rank==ranking?'green':'#333' }}}>
                </Checkbox>
                {/* <Button variant="outlined" disabled={level!==canLevel?true:false} sx={{marginTop: '12px' }} onClick={async ()=>{
                    await claim((r)=>{
                        showToast('claim success', 'success');
                    }, (e)=>{
                        showToast(e.reason, 'success')
                    })
                }}>
                    Claim
                </Button> */}
            </Card>
        </>
    }
    const reasons = {
            // 1: { title: 'Top 1-3 IDO Investors', rank: 1, rankName: 'GENESIS GOLD'} ,
            // 2: { title: 'Top 4-10 IDO Investors', rank: 2, rankName: 'SILVER'},
            // 3: { title: 'Top 11-20 IDO Investors', rank: 3, rankName: 'BRONZE'},
            3: { title: 'Top 1-10 Betting Players for the 1st Period', rank: 3, rankName: 'GENESIS GOLD'} ,
            2: { title: 'Top 11-25 Betting Players for the 1st Period', rank: 2, rankName: 'SILVER'} ,
            1: { title: 'Top 26-50 Betting Players for the 1st Period', rank: 1, rankName: 'BRONZE'} 
        }
    
    return <>
        <ToastUI />
        <div style={{display: 'flex',  marginTop: "58px", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '20px'}}>
            <Typography component='div' variant='h5'>
                NFTs Airdrop
            </Typography>
            <Typography component='div' variant='h6'>
               Points Summit Challenge Phase 1: Top 50
            </Typography>
            <Typography component='div' style={{fontSize: '14px'}}>
                <span style={{color: '#c280ff'}}>Claimable Period：</span> 2023/10/06 12:00 - 2023/10/16 00:00 (UTC+0)
            </Typography>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', minHeight: "480px"}}>
                {
                    Object.keys(reasons).map((k)=>{
                        return <NFTAirdropListItem data={reasons[k]} ranking={k} key={k}/>
                    })
                }                         
                {/* <NFTAirdropCard title="BRONZE" level={1}/>
                <NFTAirdropCard title="GENESIS GOLD" level={3}/>
                <NFTAirdropCard title="SIVER" level={2}/> */}
            </div>
            <div style={{marginTop: 'auto', display: 'block',  width: '100%'}}>
                <div style={{height: '1px', marginTop: '42px', width: '100%', borderTopStyle: 'solid', borderWidth:'1px', borderColor: '#333'}}> </div>
                <div style={{position: 'relative', width: '100%'}}>
                <Button variant="contained" color="error" disabled={address && canClaim?.level==0 && !isLoading} sx={{"&:disabled": {
                        backgroundColor: '#666'
                        }, position: 'absolute', left: 'calc(50% - 150px)', marginTop: '12px', height: '50px', width: '300px' }}
                    onClick={async ()=>{
                    if (!address) {
                        openConnectModal()
                    } else {
                        setIsLoading(()=>true)
                        await claim((r)=>{
                            showToast('claim success', 'success');
                            setIsLoading(()=>false)
                        }, (e)=>{
                            setIsLoading(()=>false)
                            if ( e.message.indexOf("expired") != -1 ) {
                                showToast('Past the claim period!!!' , 'error')
                            } else {
                                showToast(e.shortMessage || e.message || e.data?.message , 'error')
                            }
                        })
                    }
                }}>
                    {!address? 'Connect Wallet': canClaim?.level==0? "You Are Not Eligible" : isLoading? ' Processing' : 'Claim'}
                </Button>
                    <Typography component='div' sx={{position: 'absolute', left: 'calc(100% - 200px)', top: 'calc(50% + 25px)'}} onClick={()=>{router.push('/nft')}}>
                        MY NFTs &gt;
                    </Typography>
                </div>
            </div>
            </div>
            {showFireworks && <div style={{
                width: "100%",
                height: "calc( 100% + 80px )",
                background: 'rgba(32, 33, 34, 0.9)',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 999
            }}>
                <Fireworks />
            </div>}
            <Modal
                isShown={isShown}
                hide={toggle}
                headerText={modal.header}
                closeIcon={'x'}
                modalContent={
                    <ConfirmationModal
                        isShown={isShown}
                        onConfirm={()=>toggle(false)}
                        message={modal.msg}
                        sureText={modal.sureText}
                        sureColor='red'
                        sureHoverColor='#f0f'
                        cancelColor='grey'
                        cancelHoverColor='lightgrey'
                    />
                }
            />
        </>;
}

export default Airdrop;