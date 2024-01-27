import { useCallback, useState, useEffect } from "react";
import styles from "../../styles/Bet.module.css";
import { useGameContract } from "../../data/game";
import BetArea from "./BetArea";
import BetRecord from "./BetRecord"
import LiveBettingRecord from "./LiveBettingRecord"
import useTokenContract from "../../data/token"
import { formatAmount, n1e18 } from "../utils";
import { BigNumber } from "wagmi"

const Pool = ({id}) => {
  const [poolId, setPoolId] = useState(id)
  const [info, setInfo] = useState({})
  const { poolDetails, setCurrentPoolId, whitelistPool } = useGameContract()
  const [type, setType] = useState("official")
  const {deadBalance, addressTokenContract, token} = useTokenContract()
  const [light, setLight] = useState(true)

  const onChangeType = (e)=>{
    setType(e.target.value)
  }
  
  useEffect(()=>{
    if (id != undefined) {
      console.log(`set pool id ${id}`);
      setCurrentPoolId(id)
      setPoolId(id)
    }
  }, [id, setCurrentPoolId])

  useEffect(()=>{
    let a = 0;
    let i = setInterval(() => {
      a += 1
      setLight(a&1)
    }, 500);
    return ()=>clearInterval(i)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.pool_id_and_burned}>
        <div className={styles.pool_id}>
          {poolId==1?"Official":"# " + new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 3,
        useGrouping: false
    }).format(poolId)} Pool { (whitelistPool == poolId) && <span style={{color: "#06FC99", font: "900 italic 11px arial", marginLeft: '8px'}}> Fee Reduction </span>}
        </div>
          {/* Burned: <a style={{textDecoration: 'none3', color: '#2471fe'}} target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/token/${addressTokenContract}?a=0x000000000000000000000000000000000000dead`}>{deadBalance}</a> CDNT */}
          <div className={styles.content}> 
          <span className={styles.title}> Total Burned: </span> {formatAmount(deadBalance)} <span style={{color: '#7F7F7F', fontSize: "12px"}}>{token?.symbol}</span>
          <a target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/token/${addressTokenContract}?a=0x000000000000000000000000000000000000dead`}><img style={{marginLeft: '4px', width: '12px', height: '12px'}} src="jump.png"/></a>
        </div>
      </div>
     
      
      <div className={styles.info}>
       <div className={styles.info_item}>
        <div className={styles.title}> Initial Pool Fund</div>
        <div className={styles.content}>{poolDetails?.initBalance?formatAmount(poolDetails?.initBalance):'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
         <div className={styles.title}> Current Pool Balance</div>
         <div className={styles.content}>{poolDetails?.initBalance?formatAmount(poolDetails?.remainBalance):'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
         <div className={styles.title}> Bet Count</div>
         <div className={styles.content}>{Number(poolDetails?.betCount)}</div>
       </div>
       
      </div>
      <div className={styles.main}>
        <div className={styles.aera}>
          <div className={styles.bet}>
            <BetArea />
          </div>
        </div>
        <div className={styles.log}>
            <BetRecord />
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.livebetting}>
          <div className={styles.dot} style={{backgroundColor: light?"#06FC99":"#142d23", borderColor: light?"#06FC99":"#142d23"}}/>
          <div className={styles.text}>
            Live Betting
          </div>
        </div>
        <div className={styles.record}>
          <LiveBettingRecord />
        </div>
      </div>
    </div>
  )
}

export default Pool