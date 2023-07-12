import styles from "../../styles/Log.module.css";
import {useCallback, useMemo, useState, useContext, useEffect, useRef} from "react";
import Modal, { ConfirmationModal, useModal } from '../Tips';
import { store, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import StickyHeadTable from "./Table";
import { formatAmount } from "../utils"

const LiveBettingRecord = () => {
    const {
            state: { winLogs },
    } = useContext(store)
    
    const columns = useMemo(
        () => [
            {
                Header: "Tx Time",
                accessor: "time",
                align: "center",
            },
            {
                Header: "Player",
                accessor: "winner",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 5) + '...' + address.slice(38)
                }
                
            },
            {
                Header: "Bet Amount",
                accessor: "amount",
                align: "center",
                format: (i)=>{
                    return formatAmount(i);
                }
    
            },
            {
                Header: "Multiplier",
                accessor: "odds",
                align: "center",
                format: (i)=>{
                    return parseInt(i)+"x"; 
                }
            },
            {
                Header: "Profit",
                accessor: "profit",
                align: "center",
                format: (i, a)=>{
                    return i != '0'?formatAmount(i) + '+':formatAmount(a)+'-'; 
                }
            },
        ],
        []
    )

    return (<>
        {
            !winLogs?<div style={{color: "#06FC99", textAlign:"center", lineHeight: "400px"}}>No Data</div>:<StickyHeadTable  columns={columns} data={winLogs}/>
        }
        </>
    )
}

export default LiveBettingRecord;