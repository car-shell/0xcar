import styles from '../../styles/MainPage.module.css'
import { useState } from "react";
import Ranking from "./Ranking"
import { useTokenContract } from "../../data/token";
import { formatAmount } from "../utils";

const MainPage = () => {
    const [questionIndex, setQuestionIndex] = useState(0)
    const {balance, token, deadBalance} = useTokenContract();
    return <>
        <div className={`${styles.container} ${styles.flex_column}`}>
            <div className={styles.header + ' ' + styles.flex_row}>
                <img src='cardinal.png' className={styles.img} />
                
                <div className={`${styles.fontNormal} ${styles.word_style} ${styles.dialog}`}>
                    The <span className={styles.yellow}>Testnet</span> is about to launch, and users who participate in the testnet will have the opportunity to win <span className={styles.yellow}>airdrops</span>. Please stay tuned.
                </div>
                <div className={styles.triangle}/>
               
            </div>
            <div className={`${styles.flex_column} ${styles.stress} `}>
                <div className={styles.fontTitle + ' ' + styles.purple }>
                    0xCardinal betting platform
                </div> 
                <div className={styles.fontTitle + ' ' + styles.yellow }>
                    Built on the Binance Smart Chain
                </div> 
                <div className={styles.fontTitle + ' ' + styles.colorGreen }>
                    Open-source, decentralized，and Community-governed
                </div> 
            </div> 
            <div className={`${styles.fontBigTitle} ${styles.bigStress}`}>
                   Burned: <span style={{color: '#D9001B'}}>-{formatAmount(deadBalance)} {token?.symbol}</span> <span style={{color: '#02A7F0'}}>({(deadBalance/(token?.totalSupply.value/1e18)*100).toFixed(6)}%)</span>
            </div>

            {/* <div className={`${styles.flex_row} ${styles.buttonRow}`}>
                <div className={styles.button}>
                        Why 0xCardinal?
                </div>
                <div className={styles.button}>
                        Tokenomics
                </div>
                <div className={styles.button}>
                        Rodmap
                </div>
                <div className={styles.button}>
                        FAQ
                </div>
            </div> */}
            <Ranking />
        </div>
    </>
}

export default MainPage;