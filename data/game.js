import {ethers} from 'ethers'
import { gameABI as abi } from './abi/GamePoolABI'
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTokenContract } from "./token";
import { store, SET_WIN_LOGS } from '../store/store'
import { defaultChainId } from "../config/constants/chainId";
import useDispatch from '../store/useDispatch'
import {  useAccount, useNetwork, useContractRead, useContractEvent, usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction } from "wagmi";
import { ADDRESSES } from '../config/constants/address';
import { BetStatus } from "../components/constant";
import { readContract, writeContract, prepareWriteContract, waitForTransaction, getWalletClient} from "@wagmi/core";

// export const useBet = ({id, amount, rule, number, success, failed})=>{
//     const {chain, chains} = useNetwork()
//     const chainId = useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
//     const addressGameContract = ADDRESSES[chainId]?.game;

//     const [betId, setId] = useState(null)
//     const [betAmount, setAmount] = useState(null)
//     const [betRule, setRule] = useState(null)
//     const [betNumber, setNumber] = useState(null)

//     useEffect(()=>{
//         console.log(id, amount, rule, number);
//         setId(id)
//         setAmount(amount)
//         setRule(rule)
//         setNumber(number)
//     }, [id, amount, rule, number])

//     const { config } = usePrepareContractWrite({
//         address: addressGameContract,
//         abi: abi,
//         functionName: 'bet',
//         args: [id, amount, 0, rule, number],
//         enabled: id!=null && amount!=null && rule!=null && number!=null,
//         onError( error ) {
//             console.log('error', error.msg);
//             failed(error)
//         },
//     })

//     const { data: betData, write } = useContractWrite({
//         ...config,
//         onError(error) {
//             console.log('error', error.msg);
//             failed(error)
//         },
//     })

//     useEffect(()=>{
//         console.log(write);
//         if (write) {
//             write()
//         }
//     }, [write])

//     const { isLoading: isBetLoading, isSuccess: isBetSuccess } = useWaitForTransaction({
//         hash: betData?.hash,
//         onSuccess(data) {
//             success(data)
//         },
//          onError(error) {
//             console.log('error', error.msg);
//             failed(error)
//         },
//     })

//     return {write, betData, isBetLoading, isBetSuccess}
// }

export const useGameContract = (monitor=false)  => {
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressGameContract = ADDRESSES[chainId]?.game;
    const [logs, setLogs] = useState([])

    const {allowance, approve} = useTokenContract()
    const {address, isConnected} = useAccount()
    const [currentPoolId, setCurrentPoolId] = useState(1)


    const dispatch = useDispatch()
    const odds = {0: 5, 1: 10, 2: 100}

    const { data: poolDetails, isError, isLoading: poolLoading } = useContractRead({
            address: addressGameContract,
            abi: abi,
            functionName: 'poolInfo',
            args: [currentPoolId],
            chainId: chainId,
            watch: true,
            onSuccess(data){
//                console.log('Success', data)
            },
            // onError(error) {
            //     //console.log('Error', error)
            // },
        }
    )

    // monitor && useEffect(()=>{
    useEffect(()=>{
        if (!monitor) {
            return;
        }
        let winLog = localStorage.getItem('WIN_LOG')
        if (winLog) {
            let l = JSON.parse(winLog)
            setLogs(l)
            dispatch({
                type: SET_WIN_LOGS,
                payload: l
            })
        }
    }, [dispatch, monitor])

    const { data:lastRecord, isError: lastRecordError, isLoading: lastLoading } = useContractRead({
        address: addressGameContract,
        abi: abi,
        functionName: 'last',
        chainId: chainId,
        args: [address],
        onSuccess: (data)=>{
            console.log(data);
        }
    })
    
    useContractEvent({
        address: addressGameContract,
        abi: abi,
        eventName: 'ResultObtained',
        chainId: chainId,
        listener(better, id, amount, betNumber, random, odds, netWin, height) {
            if (!monitor) {
                return;
            }
            //Result(address indexed better, uint amount, uint winAmount, uint blockNumber, uint timestamp, uint poolId, uint gameId, bytes32 blockHash);
            let log = { "winner": better, 'random': random, "amount": amount/1000000000000000000n, "profit": netWin/1000000000000000000n, "odds": odds,  id: id.toNumber(), height: height.toNumber() }
            logs.unshift(log)
            setLogs(logs.slice(0,99))
            localStorage.setItem('WIN_LOG', JSON.stringify(logs))
            dispatch({
                type: SET_WIN_LOGS,
                payload: logs
            })
            console.log( logs )
        },
    })


    const { data: pools, isError: poolsListLoadingError, isLoading: poolsListLoading } = useContractRead({
        address: addressGameContract,
        abi: abi,
        functionName: 'pools',
        chainId: chainId,
        watch: true,
        onSuccess(data) {
//            console.log('Success', data)
        },
        onError(error) {
  //          console.log('Error', error)
        },
    })
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // const remove = useCallback( async (id) ) => {

    // }
    
    const _bet = useCallback( async (id, amount, poolId, ruleId, selectNumber, success, fail, setActiveStep)=>{
        const config = await prepareWriteContract({
            address: addressGameContract,
            abi: abi,
            functionName: 'bet',
            args: [id, amount, poolId, ruleId, selectNumber]
        }).then( async (config)=>{
            console.log(`bet in ${poolId} pool`);
            await writeContract(config).then(async ({hash})=>{
                setActiveStep('bet', 1)
                const receipt = await waitForTransaction({
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                success(receipt)
            }).catch((e)=>fail(e))
        }).catch((e)=>fail(e))
    }, [addressGameContract])
    

    const bet = async (id, amount, poolId, ruleId, selectNumber, success, fail, setActiveStep)=>{
        if (!isConnected) {
            return false;
        }
        
        console.log(`--------bet ${id}  ${amount}` );
        // let a = amount/1000000000000000000n
        let al = 0n

        if (!allowance(address, addressGameContract, async (result)=>{
            console.log('------', result);
            al = result
            if ( al < amount ) {
                setActiveStep('approve', 0)
                approve(addressGameContract, amount*10n, async (s, data)=>{
                    if ( s == 'write') {
                        setActiveStep('approve', 1)
                    } else {
                        setActiveStep('bet', 0)
                        await _bet(id, amount, poolId, ruleId, selectNumber, success, fail, setActiveStep)
                    }
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                setActiveStep('bet', 0)
                await _bet(id, amount, poolId, ruleId, selectNumber, success, fail, setActiveStep)
            }
        }, (e)=>{fail(e)})){
            return false;
        }

        return true;
    }

    const result = async (id, success, fail)=>{
        const { account } = await getWalletClient()
        const config = await readContract({
            address: addressGameContract,
            abi: abi,
            functionName: 'result',
            args: [id],
            account,
        }).then((result)=>{
            success(result)
        }).catch((e)=>{
            fail(e)
        })
    }

    const withdraw = async (id, success, fail, setStepStatus)=>{
        const config = await prepareWriteContract({
            address: addressGameContract,
            abi: abi,
            functionName: 'withdraw',
            args: [id]
        }).then( async (config)=>{
            await writeContract(config).then(async ({hash})=>{
                console.log("----------writeContract-----------");
                const receipt = await waitForTransaction({
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                console.log("transfer receipt",receipt)
                setStepStatus('withdraw', 2)
                success()
            }).catch((e)=>{
                console.log("withdraw failed")
                console.log(e.message)
                setStepStatus('withdraw', 1)
                fail(e)
            })
        }).catch((e)=>{
            console.log("withdraw failed")
            console.log(e.message)
            setStepStatus('withdraw', 1)
            fail(e)
        })
    }

    const preRemovePool = async (id, success, fail, setStepStatus)=>{
        const config = await prepareWriteContract({
            address: addressGameContract,
            abi: abi,
            functionName: 'preRemovePool',
            args: [id]
        }).then( async (config)=>{
            await writeContract(config).then(async ({hash})=>{
                const receipt = await waitForTransaction({
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                setStepStatus('preRemovePool', 2)
                success()
            }).catch((e)=>{
                console.log("preRemovePool failed")
                console.log(e.message)
                setStepStatus('preRemovePool', 1)
                fail(e)
            })
        }).catch((e)=>{
            console.log("preRemovePool failed")
            console.log(e.message)
            setStepStatus('preRemovePool', 1)
            fail(e)
        })
    }

    const removePool = async (id, success, fail, setStepStatus)=>{
        const config = await prepareWriteContract({
            address: addressGameContract,
            abi: abi,
            functionName: 'removePool',
            args: [id]
        }).then( async (config)=>{
            await writeContract(config).then(async ({hash})=>{
                const receipt = await waitForTransaction({
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                console.log("transfer receipt",receipt)
                setStepStatus('removePool', 2)
                success()
            }).catch((e)=>{
                console.log("removePool failed")
                console.log(e.message)
                setStepStatus('removePool', 1)
                fail(e)
            })
        }).catch((e)=>{
            console.log("removePool failed")
            console.log(e.message)
            setStepStatus('removePool', 1)
            fail(e)
        })
    }


    //(item.amount, item.ruleId, item.guess, item.qrngRequestId, item.random, item.expired);
    //let log = {type: title.value, "height": r.blockNumber, "amount": amount, "number": formatNumber(numbers), "odds": title.odds, "win": [-1, '-'], "random":'-', "id": betLog.length}
    const status = (betNumber, random, expired)=>{
        if ( random === 0xFF ) {
            if (expired) {
                return BetStatus.timeout;
            } else {
                return BetStatus.submitted;
            }
        } else {
            if (betNumber === random ) {
                return BetStatus.win
            } else {
                return BetStatus.failed
            }
        }
    }

    const formatLast = ()=>{
        if ( lastRecordError || lastLoading || lastRecord == undefined) {
            return {}
        }

        const amount = lastRecord[1]/1000000000000000000n
        let s = status(lastRecord[4], lastRecord[6], lastRecord[7])
        return {id: lastRecord[0].toString(), amount: amount.toString(), number: lastRecord[4], odds: odds[lastRecord[3]], status: s, random: s!=BetStatus.timeout?lastRecord[6]:'-'}
    }

    
    return { pools, poolDetails, bet, result, withdraw, logs, last: formatLast(), setCurrentPoolId}
}