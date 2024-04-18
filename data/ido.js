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

    const {data: info, isSuccess, error} = useReadContracts({ 
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
            functionName: 'info', 
            args: [address], 
          }, 
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
                setStepStatus('withdraw', 1)
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                setStepStatus('withdraw', 2)
                console.log("transfer receipt",receipt)
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
                setStepStatus('withdraw', 1)
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                setStepStatus('withdraw', 2)
                console.log("transfer receipt",receipt)
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

    const buyToken = useCallback(async (amount, reffera, success, fail, onStepChange) => {
        if (!isConnected) {
            return false;
        }
        
        let al = 0n
        if (!allowance(address, addressIDOContract, async (result)=>{
            console.log('------', result);
            al = result
            if ( al < amount ) {
                onStepChange(0, true, 'approve', "IDO Buy Token")
                approve(addressIDOContract, amount, async (s, data)=>{
                    if ( s == 'write') {
                        onStepChange(1, true)
                    } else {
                        onStepChange(0, true, 'create_pool', "IDO Buy Token")
                        await _buyToken(amount, reffera, success, fail, onStepChange)
                    }
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                onStepChange(0, true, 'create_pool', "IDO Buy Token")
                await _buyToken(amount, reffera, success, fail, onStepChange)
            }
        }, (e)=>{fail(e)})){
            return false;
        }

        return true;
    }, [addressIDOContract, address, allowance, approve, isConnected]);
   
    return { isSuccess, 
        init:isSuccess?formatAmount(info[2]):'--', 
        remain:isSuccess?formatAmount(info[1]):'--', 
        total_usdt_raised:isSuccess?formatAmount(info[3]):"--",
        usdtBalance:usdtBalance, 
        startTime: isSuccess?Number(info[4]):'--', 
        endTime: isSuccess?Number(info[5]):'--', 
        price: isSuccess?Number(100000n/info[6])/100000: 1, 
        whitelistPrice: isSuccess?Number(100000n/info[7])/100000: 1, 
        subscribed: isSuccess?Number(info[0][0]):0,
        claimed: isSuccess?Number(info[0][1]):0,
        referaFund: isSuccess?formatAmount(info[0][2]):"--",
        isWhitelist: isSuccess?info[0][3]:false,
        referaCount: isSuccess?Number(info[0][4]):0,
        buyToken,
        claimTokens,
        withdrawRefferasFund}
}
