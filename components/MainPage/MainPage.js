import styles from '../../styles/MainPage.module.css'
import { useState } from "react";
import Ranking from "./Ranking"
import { useTokenContract } from "../../data/token";
import { formatAmount } from "../utils";

const MainPage = () => {
    const [questionIndex, setQuestionIndex] = useState(0)
    const {balance, token, deadBalance} = useTokenContract();
    return <>
        <div className={`${styles.container} ${styles.flex_column}`} 
            style={{background: "url('/cardinal.png') center center no-repeat"} }>
            {/* <div className={styles.header + ' ' + styles.flex_row}>
                <img src='cardinal.png' className={styles.img} />
                
                <div className={`${styles.fontNormal} ${styles.word_style} ${styles.dialog}`}>
                    The <span className={styles.yellow}>Testnet</span> is about to launch, and users who participate in the testnet will have the opportunity to win <span className={styles.yellow}>airdrops</span>. Please stay tuned.
                </div>
                <div className={styles.triangle}/>
               
            </div> */}

            <div className={`${styles.flex_column} ${styles.stress}`} style={{alignItems: "flex-start"}}>
                <div className={styles.fontLargeTilte + ' ' + styles.bigStress }>
                    <span style={{color: "#D9001B"}}>0x</span>Cardinal
                </div>
                <div className={styles.fontTitle + ' ' + styles.purple }>
                    A betting platform
                </div> 
                <div className={styles.fontTitle + ' ' + styles.yellow }>
                    Built on the Binance Smart Chain
                </div> 
                <div className={styles.fontTitle + ' ' + styles.colorGreen }>
                    Open-source, decentralized，and Community-governed
                </div> 
                
                <div className={styles.fontBigTitle + ' ' + styles.bigStress }>
                    <span style={{color: "#D9001B"}}>0x</span>Cardinal <span style={{color: "#027DB4"}}>devnet</span> about to go live...
                </div> 

                <div className={`${styles.flex_row} ${styles.buttonRow} ${styles.topStress}`}>
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
                </div>
            </div> 
            {/* <div className={`${styles.fontBigTitle} ${styles.bigStress}`}>
                   Burned: <span style={{color: '#D9001B'}}>-{formatAmount(deadBalance)} {token?.symbol}</span> <span style={{color: '#02A7F0'}}>({(deadBalance/(token?.totalSupply.value/1e18)*100).toFixed(6)}%)</span>
            </div> */}

            
            {/* <Ranking /> */}
        </div>
    </>
}

export default MainPage;