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

    const {usdt, balance: usdtBalance, allowance, approve} = useTokenContract(ADDRESSES[chainId].usdt);


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

    const { data: total_usdt_raised } = useContractRead({
            address: addressIDOContract,
            abi: abi,
            functionName: 'total_usdt_raised',
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
    

    const _createIDOPool = useCallback(async (amount, discord, success, fail, onStepChange) => {
        console.log(`${amount} ${discord} ${addressIDOContract} ${abi}`);
        const config = await prepareWriteContract({
            address: addressIDOContract,
            abi: abi,
            functionName: 'createIDOPool',
            args: [amount, discord],
        }).then( async (config)=>{
            const data = await writeContract(config).then((s, data)=>{
                onStepChange(2, true, null, null, "View My Pool")
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

    const createIDOPool = useCallback(async (amount, discord, success, fail, onStepChange) => {
        if (!isConnected) {
            return false;
        }
        
        let al = 0n
        if (!allowance(address, addressIDOContract, async (result)=>{
            console.log('------', result);
            al = result
            if ( al < amount ) {
                onStepChange(0, true, 'approve', "Pool Create")
                approve(addressIDOContract, amount, async (s, data)=>{
                    if ( s == 'write') {
                        onStepChange(1, true)
                    } else {
                        onStepChange(0, true, 'create_pool', "Pool Create")
                        await _createIDOPool(amount, discord, success, fail, onStepChange)
                    }
                }, (e)=>{
                    console.log( `approve failed ${e}`);
                    fail(e)
                })
            } else {
                onStepChange(0, true, 'create_pool', "Pool Create")
                await _createIDOPool(amount, discord, success, fail, onStepChange)
            }
        }, (e)=>{fail(e)})){
            return false;
        }

        return true;
    }, [addressIDOContract, _createIDOPool, address, allowance, approve,isConnected]);
   
    return { init:init_balance?formatAmount(init_balance):"--", remain:remain_balance?formatAmount(remain_balance):"--", createIDOPool, usdtBalance, total_usdt_raised:total_usdt_raised?formatAmount(total_usdt_raised):"0.00"}
}