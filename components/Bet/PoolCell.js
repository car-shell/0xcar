import { useCallback, useState, useEffect } from "react";
import styles from "../../styles/BetCell.module.css";
import { useGameContract } from "../../data/game";
import BetAreaCell from "./BetAreaCell";
import BetRecord from "./BetRecord"
import LiveBettingRecord from "./LiveBettingRecord"
import {ethers} from "ethers"
import useTokenContract from "../../data/token"
import { formatAmount } from "../utils";

const PoolCell = () => {
  
  const [info, setInfo] = useState({})
  const { poolDetails } = useGameContract()
  const [type, setType] = useState("official")
  const {deadBalance, addressTokenContract, token} = useTokenContract()
  const [light, setLight] = useState(true)

  const onChangeType = (e)=>{
    setType(e.target.value)
  }

  useEffect(()=>{
    console.log('set interval');
    let a = 0;
    let i = setInterval(() => {
      a += 1
      setLight(a&1)
    }, 500);
    return ()=>clearInterval(i)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.info}>
       <div className={styles.info_item}>
        <div className={styles.title}> Initial Amount</div>
        <div className={styles.content}>{poolDetails?formatAmount(poolDetails[0].hex/1000000000000000000:'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
         <div className={styles.title}> Remaining Amount</div>
         <div className={styles.content}>{poolDetails?formatAmount(poolDetails[1].hex/1000000000000000000:'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
        <div className={styles.title}> Total Burned</div>
        <div className={styles.content}> 
          {formatAmount(deadBalance)} <span style={{color: '#7F7F7F', fontSize: "12px"}}>{token?.symbol}</span>
          <a target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/token/${addressTokenContract}?a=0x000000000000000000000000000000000000dead`}><img style={{marginLeft: '4px', width: '12px', height: '12px'}} src="jump.png"/></a>
        </div>
       </div>
      </div>
      {/* <div className={styles.main}> */}
        <div className={styles.aera}>
          <div className={styles.bet}>
            <BetAreaCell />
          </div>
        </div>
        <div className={styles.log}>
            <BetRecord />
        </div>
    </div>
  )
}

export default PoolCell