import styles from '../../styles/MainPage.module.css'
import { useState } from "react";
import useToast from '../Toast'
import Image from 'next/image'
import PoolList from './PoolList'

const MainPage = () => {
    const {ToastUI, showToast} = useToast();
    const open = (url) => {
        
    }
    return <>
        <ToastUI />
        <div className={`${styles.container}`} style={{columnGap: '8px'}} >
            
            {/* <div className={styles.header + ' ' + styles.flex_row}>
                <img src='cardinal.png' className={styles.img} />
                
                <div className={`${styles.fontNormal} ${styles.word_style} ${styles.dialog}`}>
                    The <span className={styles.yellow}>Testnet</span> is about to launch, and users who participate in the testnet will have the opportunity to win <span className={styles.yellow}>airdrops</span>. Please stay tuned.
                </div>
                <div className={styles.triangle}/>
               
            </div> */}
            <div className={`${styles.flex_row}`}>
                <div className={`${styles.umask}  ${styles.flex_row}`}>
                    <div className={`${styles.flex_column} ${styles.stress}`}>
                        <div className={styles.fontLargeTilte }>
                            <span style={{color: "#D9001B"}}>0x</span>Cardinal
                        </div>
                        <div className={styles.fontBigTitle + ' ' + styles.yellow + ' ' + styles.stress }>
                            Binance Smart Chain Betting Platform
                        </div> 
                        <div className={styles.fontTitle + ' ' + styles.white + ' ' + styles.stress}>
                            An Innovative Token-Based Betting Platform
                        </div> 
                        <div className={styles.fontTitle + ' ' + styles.white}>
                            Open-source, Decentralized，and Community-governed
                        </div> 
                    </div> 
                </div>
            </div>
            <PoolList />
        </div>
    </>
}

export default MainPage;