import { useContract, useAccount, useContractRead, useWalletClient, useNetwork } from "wagmi";
import { useMemo, useCallback, useState, useEffect} from "react";
import { readContract, writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers"
import { ADDRESSES } from '../config/constants/address' 
import { ERC721ABI as abi } from './abi/ERC721ABI'
import { useTokenContract } from "./token";
import { defaultChainId } from "../config/constants/chainId";

const useIDOContract = () => {
    const {address} = useAccount()
    const {allowance, approve} = useTokenContract()
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressIDOContract = ADDRESSES[chainId]?.ido


    // const { data: init } = useContractRead({
    //         address: addressIDOContract,
    //         abi: abi,
    //         functionName: 'init_amount',
    //         chainId: chainId,
    //         args: [address],
    //         watch: true,
    //         cache: 20_000,
    //         // structuralSharing: (prev, next) => (prev === next ? prev : next),
    //         onSuccess:(data)=>{
    //             console.log(data);
    //         }
    //     }
    // )

    // const { data: remain } = useContractRead({
    //         address: addressIDOContract,
    //         abi: abi,
    //         functionName: 'remain_amount',
    //         chainId: chainId,
    //         args: [address],
    //         watch: true,
    //         cache: 20_000,
    //         // structuralSharing: (prev, next) => (prev === next ? prev : next),
    //         onSuccess:(data)=>{
    //             console.log(data);
    //         }
    //     }
    // )

    // const createIDOPool = useCallback(async (amount, discord) => {
    //     const config = await prepareWriteContract({
    //         address: addressIDOContract,
    //         abi: abi,
    //         functionName: 'createIDOPool',
    //         args: [amount, discord],
    //     }).then( async (config)=>{
    //         const data = await writeContract(config).then((data)=>{
    //             success(data)
    //         }).catch((e)=>{
    //             console.log(e);
    //             fail(e)
    //         })
    //     }).catch((e)=>{
    //         console.log(e);
    //         fail(e)
    //         return
    //     })
    // }, [address, addressIDOContract])

   
    // return { init, remain, createIDOPool}
}

export default useIDOContract;