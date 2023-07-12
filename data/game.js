import {ethers} from 'ethers'
import {GAMEPOOLABI as abi} from './abi/GamePoolABI'
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTokenContract } from "./token";
import { store, SET_WIN_LOGS } from '../store/store'
import { defaultChainId } from "../config/constants/chainId";
import useDispatch from '../store/useDispatch'
import { useContract, useProvider, useAccount, useSigner, useNetwork, useContractRead, useContractEvent} from "wagmi";
import { ADDRESSES } from '../config/constants/address' 
import { BetStatus } from "../components/constant";

export const useGameContract = (monitor=false)  => {
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressGameContract = ADDRESSES[chainId]?.game;
    // const addressGameContract = useMemo(()=> {return ADDRESSES[97]?.game})
    const [logs, setLogs] = useState([])

    const {allowance, approve} = useTokenContract()
    const {address, isConnected} = useAccount()
    
    const provider = useProvider()
    const { data: signer, error, isLoading } = useSigner()
    const game = useContract({
        address: addressGameContract,
        abi: abi,
        signerOrProvider: signer
    })

    const dispatch = useDispatch()
    const odds = {0: 5, 1: 10, 2: 100}

    const { data: poolDetails, isError, isLoading: poolLoading } = useContractRead({
            address: addressGameContract,
            abi: abi,
            functionName: 'pool',
            args: [0],
            chainId: chainId,
            watch: true,
            onSuccess(data){
                // console.log(data);
            } 
        }
    )
    
    // useEffect(()=> {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum)
    //     const signer = provider.getSigner();
    //     const game = addressGameContract && new ethers.Contract(addressGameContract, abi, signer);
    // }, [])

    monitor && useEffect(()=>{
        let winLog = localStorage.getItem('WIN_LOG')
        if (winLog) {
            let l = JSON.parse(winLog)
            setLogs(l)
            dispatch({
                type: SET_WIN_LOGS,
                payload: l
            })
        }
    }, [])

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
    
    // console.log(lastRecord);
    monitor && useContractEvent({
        address: addressGameContract,
        abi: abi,
        eventName: 'Result',
        chainId: chainId,
        listener(better, id, amount, winAmount, gameId, random) {
            //Result(address indexed better, uint amount, uint winAmount, uint blockNumber, uint timestamp, uint poolId, uint gameId, bytes32 blockHash);
            // console.log(better, amount, typeof amount, winAmount, gameId, random);
            // let log = { "winner": better, 'random': random, "amount": amount.div(ethers.BigNumber.from('1000000000000000000')).toString(), "profit": winAmount.div(ethers.BigNumber.from('1000000000000000000')).toString(), "odds": odds[gameId],  id: id.toNumber()}
            // logs.unshift(log)
            // setLogs(logs.slice(0,99))
            // localStorage.setItem('WIN_LOG', JSON.stringify(logs))
            // dispatch({
            //     type: SET_WIN_LOGS,
            //     payload: logs
            // })
            console.log( logs )
        },
    })

    monitor && useContractEvent({
        address: addressGameContract,
        abi: abi,
        eventName: 'ResultObtained',
        chainId: chainId,
        listener(better, id, amount, betNumber, random, odds, netWin, height) {
            //Result(address indexed better, uint amount, uint winAmount, uint blockNumber, uint timestamp, uint poolId, uint gameId, bytes32 blockHash);
            let log = { "winner": better, 'random': random, "amount": amount.div(ethers.BigNumber.from('1000000000000000000')).toString(), "profit": netWin.div(ethers.BigNumber.from('1000000000000000000')).toString(), "odds": odds,  id: id.toNumber(), height: height.toNumber() }
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
    
    const getWinNumber = (hash, odds) => {
        let i = 0;
        switch (odds) {
            case 5:
                i = hash.search(/[0-4]/)
                return hash[i]
            case 10:
                i = hash.search(/[0-9]/)
                return hash[i]
            case 100:
                i = hash.search(/[0-9]/)
                let j = hash.slice(j).search(/[0-9]/)
                return hash[i]+hash[i+j]
            default:
                return -1
        }
    }

    const bet = (id, amount, ruleId, selectNumber, success, fail, setActiveStep)=>{
        if (!isConnected) {
            return false;
        }

        let a = ethers.BigNumber.from(amount).mul(ethers.BigNumber.from('1000000000000000000'))
        let al = ethers.BigNumber.from(0);

        if (!allowance(address, addressGameContract, (result)=>{
            al = result
            // console.log(`value: ${a}, allowance: ${allowance}`);
            if ( al.lt(a)) {
                setActiveStep('approve', 0)
                approve(addressGameContract, a.mul(ethers.BigNumber.from('10')), (tr)=>{
                    console.log(`approve TX hash: ${tr.hash}`)
                    setActiveStep('approve', 1)
                    tr.wait().then((receipt)=>{
                        console.log("transfer receipt",receipt);
                        setActiveStep('bet', 0)
                        game.bet(id, a, 0, ruleId, selectNumber).then((tr)=>{
                            setActiveStep('bet', 1)
                            console.log(`TransactionResponse TX hash: ${tr.hash}`)
                            
                            tr.wait().then( (receipt)=>{
                                console.log("transfer receipt",receipt)
                                success(receipt)
                            }).catch((e)=>{console.log(e); fail(e)})
                        })
                        .catch((e)=>{console.log(e); fail(e)})
                    }).catch((e)=>{console.log(e); fail(e)})
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                setActiveStep('bet', 0)
                game.bet(id, a, 0, ruleId, selectNumber).then((tr)=>{
                    console.log(`TransactionResponse TX hash: ${tr.hash}`)
                    setActiveStep('bet', 1)
                    tr.wait().then((receipt)=>{
                        console.log("transfer receipt",receipt)
                        success(receipt)
                    }).catch((e)=>{
                        fail(e)
                    })
                }).catch((e)=>{
                    fail(e)
                })
            }
        }, (e)=>{fail(e)})){
            return false;
        }
        return true;
    }

    const result = (id, success, fail)=>{
        game.result(ethers.BigNumber.from(id))
        .then((r)=>{
            success(r)
        })
        .catch((e)=>{
            fail(e)
        })
    }

    const withdraw = (id, success, fail, setStepStatus)=>{
        game.withdraw(ethers.BigNumber.from(id)).then((tr)=>{
            setStepStatus('withdraw', 1)
            console.log("withdraw...")
            tr.wait().then((receipt)=>{
                console.log("transfer receipt",receipt)
                setStepStatus('withdraw', 2)
                success()
            }).catch((e)=>{
                setStepStatus('withdraw', 2)
                fail(e)
            })
        }).catch((e)=>{
            console.log("withdraw failed")
            console.log(e.message)
            setStepStatus('withdraw', 1)
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
        if ( lastRecordError || lastLoading ) {
            return {}
        }
        return {id: lastRecord[0].toNumber(), amount: lastRecord[1].div(ethers.BigNumber.from('1000000000000000000')).toString(), number: lastRecord[3], odds: odds[lastRecord[2]], status: status(lastRecord[3], lastRecord[5], lastRecord[6]), random: lastRecord[5]}
    }

    return { poolDetails, bet, result, withdraw, logs, last: formatLast()}
}