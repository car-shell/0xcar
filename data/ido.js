import { useContract, useAccount, useReadContract, useReadContracts, useWalletClient, useSwitchChain } from "wagmi";
import { useMemo, useCallback, useState, useEffect} from "react";
import { readContract, writeContract, simulateContract, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers"
import {wagmiClient} from '../config/wagmi'
import { ADDRESSES } from '../config/constants/address' 
import { IDOABI as abi } from './abi/IDOABI'
import { useTokenContract } from "./token";
import { defaultChainId } from "../config/constants/chainId";
import { formatAmount, n1e18 } from "../components/utils";


export const useIDOContract = () => {
    const {address, chain, isConnected} = useAccount()
    const {chains} = useSwitchChain()

    const chainId = useMemo(()=>{ return chain != undefined && chain?.id && chains.map(c=>c?.id).indexOf(chain?.id) != -1 ? chain.id : defaultChainId}, [chain, chains])
    const addressIDOContract = ADDRESSES[chainId]?.ido
    const {usdt, balance: usdtBalance, allowance, approve} = useTokenContract(ADDRESSES[chainId].usdt);

    const {data: idoInfo, isSuccess, error} = useReadContracts({ 
        allowFailure: false, 
        query: {
            notifyOnChangeProps: ['data', 'error'],
            refetchInterval: 2000,
            gcTime: Infinity,
        },
        contracts: [  
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'remain', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'total', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'totalUsdt', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'startTime', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'endTime', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'tokenPrice', 
          }, 
          { 
            address: addressIDOContract, 
            abi: abi, 
            functionName: 'tokenWhitelistPrice', 
          }, 
        ] 
    }) 
    const {data: info, isSuccess:infoSuccess} = useReadContract({ 
        allowFailure: false, 
        query: {
            notifyOnChangeProps: ['data', 'error'],
            refetchInterval: 2000,
            gcTime: Infinity,
        },

        address: addressIDOContract, 
        abi: abi, 
        functionName: 'info', 
        args: [address], 
        }) 

    const _buyToken = useCallback(async (amount, reffera, success, fail, onStepChange) => {
        console.log(`${amount} ${reffera} ${addressIDOContract} ${abi}`);
        const config = await simulateContract(wagmiClient, {
            address: addressIDOContract,
            abi,
            functionName: 'buyTokens',
            args: [amount, reffera],
        }).then( async ({request})=>{
            const data = await writeContract(wagmiClient, request).then((s, data)=>{
                onStepChange(2, true, null, null, "Done")
                success(data)
            }).catch((e)=>{
                console.log(e);
                fail(e)
            })
        }).catch((e)=>{
            console.log(e);
            fail(e)
            return
        })
    }, [addressIDOContract])

    const claimTokens = async (success, fail, setStepStatus)=>{
        console.log( '------ start withdraw -----' );
        const config = await simulateContract(wagmiClient, {
            address: addressIDOContract,
            abi,
            functionName: 'withdrawTokens',
            args: []
        }).then( async ({request})=>{
            await writeContract(wagmiClient, request).then(async (hash)=>{
                console.log("----------writeContract-----------");
                setStepStatus(1, true)
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                setStepStatus(0, false)
                console.log("transfer receipt",receipt)
                success()
            }).catch((e)=>{
                console.log("withdraw failed")
                fail(e)
            })
        }).catch((e)=>{
            console.log(e.message)
            setStepStatus('withdraw', 1)
            fail(e)
        })
    }

    const withdrawRefferasFund = async (success, fail, setStepStatus)=>{
        console.log( '------ start withdraw -----' );
        const config = await simulateContract(wagmiClient, {
            address: addressIDOContract,
            abi,
            functionName: 'withdrawRefferasFund',
            args: []
        }).then( async ({request})=>{
            await writeContract(wagmiClient, request).then(async (hash)=>{
                console.log("----------writeContract-----------");
                setStepStatus(1, true)
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                setStepStatus(0, false)
                console.log("transfer receipt",receipt)
                success()
            }).catch((e)=>{
                console.log("withdraw failed")
                fail(e)
            })
        }).catch((e)=>{
            console.log("withdraw failed")
            fail(e)
        })
    }

    const buyToken = useCallback(async (amount, reffera, success, fail, onStepChange) => {
        if (!isConnected) {
            return false;
        }
        console.log(reffera);
        let al = 0n
        if (!allowance(address, addressIDOContract, async (result)=>{
            console.log('------', result);
            al = result
            if ( al < amount ) {
                onStepChange(0, true, 'approve', "Buy $CDNL")
                approve(addressIDOContract, amount, async (s, data)=>{
                    if ( s == 'write') {
                        onStepChange(1, true)
                    } else {
                        onStepChange(0, true, 'create_pool', "Buy $CDNL")
                        console.log(reffera);
                        await _buyToken(amount, reffera, success, fail, onStepChange)
                    }
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                onStepChange(0, true, 'create_pool', "Buy $CDNL")
                await _buyToken(amount, reffera, success, fail, onStepChange)
            }
        }, (e)=>{fail(e)})){
            return false;
        }

        return true;
    }, [addressIDOContract, address, allowance, approve, isConnected]);
    
    return { isSuccess, 
        init:isSuccess?formatAmount(idoInfo[1]):'--', 
        remain:isSuccess?formatAmount(idoInfo[0]):'--', 
        total_usdt_raised:isSuccess?formatAmount(idoInfo[2]):"--",
        usdtBalance:usdtBalance, 
        startTime: isSuccess?Number(idoInfo[3]):'--', 
        endTime: isSuccess?Number(idoInfo[4]):'--', 
        price: isSuccess?Number(100000n/idoInfo[5])/100000: 1, 
        whitelistPrice: isSuccess?Number(100000n/idoInfo[6])/100000: 1, 
        subscribed: infoSuccess?info[0]:0,
        claimed: infoSuccess?info[1]:0,
        referaFund: infoSuccess?formatAmount(info[2]):"--",
        isWhitelist: infoSuccess?info[3]:false,
        referaCount: infoSuccess?Number(info[4]):0,
        referasWithdrawed: infoSuccess?info[5]:false,
        buyToken,
        claimTokens,
        withdrawRefferasFund}
}
