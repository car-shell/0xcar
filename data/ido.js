import { useContract, useAccount, useContractRead, useWalletClient, useNetwork } from "wagmi";
import { useMemo, useCallback, useState, useEffect} from "react";
import { readContract, writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers"
import { ADDRESSES } from '../config/constants/address' 
import { IDOABI as abi } from './abi/IDOABI'
import { useTokenContract } from "./token";
import { defaultChainId } from "../config/constants/chainId";
import { formatAmount, n1e18 } from "../components/utils";


export const useIDOContract = () => {
    const {address, isConnected} = useAccount()
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain != undefined && chain?.id && chains.map(c=>c?.id).indexOf(chain?.id) != -1 ? chain.id : defaultChainId}, [chain, chains])
    const addressIDOContract = ADDRESSES[chainId]?.ido

    const {usdt, allowance, approve} = useTokenContract(ADDRESSES[chainId].usdt);


    const { data: init_balance } = useContractRead({
            address: addressIDOContract,
            abi: abi,
            functionName: 'init_amount',
            chainId: chainId,
            args: [],
            watch: true,
            cache: 20_000,
            // structuralSharing: (prev, next) => (prev === next ? prev : next),
            onSuccess:(data)=>{
                console.log(data);
            }
        }
    )

    const { data: remain_balance } = useContractRead({
            address: addressIDOContract,
            abi: abi,
            functionName: 'remain_amount',
            chainId: chainId,
            args: [],
            watch: true,
            cache: 20_000,
            // structuralSharing: (prev, next) => (prev === next ? prev : next),
            onSuccess:(data)=>{
                console.log(data);
            }
        }
    )

    const _createIDOPool = useCallback(async (amount, discord, success, fail) => {
        console.log(`${amount} ${discord} ${addressIDOContract} ${abi}`);
        const config = await prepareWriteContract({
            address: addressIDOContract,
            abi: abi,
            functionName: 'createIDOPool',
            args: [amount, discord],
        }).then( async (config)=>{
            const data = await writeContract(config).then((data)=>{
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
    }, [address, addressIDOContract])

    const createIDOPool = useCallback(async (amount, discord, success, fail) => {
        if (!isConnected) {
            return false;
        }
        
        let al = 0n
        if (!allowance(address, addressIDOContract, async (result)=>{
            console.log('------', result);
            al = result
            if ( al < amount ) {
                approve(addressIDOContract, amount*10n, async (s, data)=>{
                    if ( s == 'write') {
                    } else {
                        await _createIDOPool(amount, discord, success, fail)
                    }
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                await _createIDOPool(amount, discord, success, fail)
            }
        }, (e)=>{fail(e)})){
            return false;
        }

        return true;
    });
   
    return { init:formatAmount(init_balance/n1e18), remain:formatAmount(remain_balance/n1e18), createIDOPool }
}