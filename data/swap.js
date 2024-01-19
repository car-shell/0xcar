
import { SwapRouterABI as abi } from './abi/SwapRouterABI'
import { useCallback, useState, useEffect, useMemo } from "react";
import {ethers} from "ethers"
import { useContractRead,  useNetwork, useToken } from "wagmi";
import { readContract, writeContract, prepareWriteContract,waitForTransaction } from "@wagmi/core";
import { ADDRESSES } from '../config/constants/address' 
import { defaultChainId } from "../config/constants/chainId";
import { formatAmount,n1e18 } from "../components/utils";

export const useSwapContract = ()  => {
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain!=undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain, chains])
    const addressSwapContract = ADDRESSES[chainId].swap

    const addressTokenContract = ADDRESSES[chainId].token
    const addressUsdtContract = ADDRESSES[chainId].usdt

    const {data:amountsOut} = useContractRead({
        address: addressSwapContract,
        abi: abi,
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

    return { amountsOut: formatAmount(amountsOut?amountsOut[1]:200)}
}

export default useSwapContract
