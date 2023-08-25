/* eslint-disable @next/next/no-html-link-for-pages */
// import { Link } from 'react-router-i18n'
import { useCallback, useState, useEffect, useContext} from "react";
import { ethers } from "ethers";
import styles from "../../styles/Header.module.css";
import { store, SET_SELECTED_ADDR, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import useTokenContract from "../../data/token";
import Link from "next/link";
import BaseLink from './BaseLink';
import { useRouter } from 'next/router';
import useToast from '../Toast'

import { InjectedConnector } from 'wagmi/connectors/injected';
// import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

// import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import {
  useConnectModal,
  // useAccountModal,
  useChainModal,
  // ConnectButton
} from '@rainbow-me/rainbowkit';


const Header = ({showMenu=true}) => {
  const {balance, token} = useTokenContract()
  const [curRouter, setCurRouter] = useState('')
  const [showWalletInfo, setShowWalletInfo] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter();
  const {ToastUI, showToast} = useToast()

  const { disconnectAsync } = useDisconnect();
  const { address, isConnected, isDisconnected} = useAccount();
  // const [ correctNetwork, setCorrectNetwork ] = useState(false)
  // const { data } = useSession();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  
  const {chain, chains} = useNetwork();

  const disconnect = ()=>{
    dispatch({
        type: SET_SELECTED_ADDR,
        payload: ''
    })
    disconnectAsync()
    setShowWalletInfo(false)
  }

  useEffect(()=>{
    setCurRouter(router.pathname)
  }, [])

  const walletButton = (e) => {
    if (e.target.innerText == 'Launch App >') {
      // router.push('/app.html')
      showToast("Coming soon")
      return
    }

    if (!isConnected ) {
      openConnectModal()
    } else {
      stopPropagation(e);
      setShowWalletInfo(!showWalletInfo)
    }
  }

  const copyAddress = (e) => {
    navigator.clipboard.writeText(address);
    stopPropagation(e);
    showToast('Address copied')
  }

  const onShowPending = ()=>{
    dispatch({
        type: SET_ACTION,
        payload: 'view'
    })
  }

  const link = (e) => {
    stopPropagation(e);
    window.open(`https://testnet.bscscan.com/address/${address}`, "_blank")
  }

  const stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  const shutdown = (event)=>{
      if (showWalletInfo) {
        setShowWalletInfo(false)
      }
  }

  useEffect(() => {
    document.body.addEventListener('click', shutdown)
    return () => {
          document.body.removeEventListener('click', shutdown);
      };
  }, [showWalletInfo]);

  
  return (
    <>
      <ToastUI />
      <header className={styles.header} >
        <Link href='/'>
          <div className={styles.title}>
            <img src="logo.png" className={styles.image}/>
            <div className={styles.logo} style={{cursor: 'pointer'}}>
              <span style={{color: "#D9001B"}}>0x</span>Cardinal
            </div>
            <div className={styles.envLabel}>
              devnet
            </div>
          </div>
        </Link>
      
        { showMenu && <div className={styles.menu}>
          <div className={styles.menuItem} style={curRouter=='/'?{color: '#06FC99', borderColor: '#06FC99'}:{}}>
              <BaseLink href="/" >App</BaseLink>
              {/* {curRouter=='/app' && <div className={styles.underline} style={{width: }}></div>} */}
          </div>
          {/* <div className={styles.menuItem} style={curRouter=='/ido'?{color: '#06FC99'}:{}}>
              <BaseLink href="/ido" >IDO</BaseLink>
              {curRouter=='/ido' && <div className={styles.underline}></div>}
          </div>
          <div className={styles.menuItem} style={curRouter=='/swap'?{color: '#06FC99'}:{}}>
              <BaseLink href="/swap" >Swap</BaseLink>
              {curRouter=='/swap' && <div className={styles.underline}></div>}
          </div>*/}
          <div className={styles.menuItem} style={curRouter=='/ranking'?{color: '#06FC99', borderColor: '#06FC99'}:{}}>
              <BaseLink href="/ranking" >Ranking</BaseLink>
          </div> 
          <div className={styles.menuItem} style={curRouter=='/faucet'?{color: '#06FC99', borderColor: '#06FC99'}:{}}>
              <BaseLink href="/faucet" >Faucet</BaseLink>
          </div>
          {/* <div className={styles.menuItem} style={curRouter=='/nft'?{color: '#06FC99', borderColor: '#06FC99'}:{}}>
              <BaseLink href="/nft" >NFT</BaseLink>
          </div>
           <div className={styles.menuItem} style={curRouter=='/airdrop'?{color: '#06FC99', borderColor: '#06FC99'}:{}}>
              <BaseLink href="/airdrop" >AirpDrop</BaseLink>
          </div> */}
        </div>}
        <div className={styles.wallet + ' ' + styles.walletFont } onClick={walletButton}>
          { !isConnected ? "Connect Wallet" : address.slice(0, 5) + '...' + address.slice(38) }
          { address && curRouter!='/' && <img className={styles.icon } style= {showWalletInfo?{transform: 'rotate(-180deg)'}:{}} src="down.png" />}
        </div>
      </header>
      {showWalletInfo && <div className={styles.walletDetailContainer + ' ' + styles.walletFont}>
        <div className={styles.addressRow}>
          <div >
            {address.slice(0, 5) + '...' + address.slice(38)}
          </div>
          <div onClick={copyAddress}>
            <img className={styles.icon} src="copy.png" />
          </div>
          <div onClick={link}>
            <img className={styles.icon} src="link.png" />
          </div>
        </div>
        <div className={styles.balanceRow}>
          <div >
            {token?.symbol} Balance
          </div>
          <div>
            {balance}
          </div>
        </div>
        <div className={styles.separate} />
        <button className={styles.walletButton} style={{backgroundColor: '#c00017'}}>Buy {token?.symbol}</button>
        <button className={styles.walletButton} style={{backgroundColor: '#333333'}} onClick={disconnect}>Disconnect</button>
      </div>}
    </>
  )
}

export default Header
