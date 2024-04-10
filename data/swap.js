
import { SwapRouterABI as abi } from './abi/SwapRouterABI'
import { useCallback, useState, useEffect, useMemo } from "react";
import {ethers} from "ethers"
import { useReadContract,  useAccount, useToken, useSwitchChain} from "wagmi";
import { readContract, writeContract, simulateContract,waitForTransaction} from "@wagmi/core";
import { ADDRESSES } from '../config/constants/address' 
import { defaultChainId } from "../config/constants/chainId";

export const useSwapContract = ()  => {
    const {chain} = useAccount()
    const {chains} = useSwitchChain()

    const chainId = useMemo(()=>{ return chain!=undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain, chains])
    const addressSwapContract = ADDRESSES[chainId].swap

    const addressTokenContract = ADDRESSES[chainId].token
    const addressUsdtContract = ADDRESSES[chainId].usdt

    const {data:amountsOut} = useReadContract({
        address: addressSwapContract,
        abi,
        functionName: 'getAmountsOut',
        chainId: chainId,
        args: [1e18, [addressUsdtContract, addressTokenContract]],
        watch: true,
        onSuccess:(data)=>{
            console.log(data);
        },
        onError: (error)=>{
            console.log(`${addressSwapContract} ${abi} ${error}`)
        }
    })
    return { amountsOut}
}

export default useSwapContract
