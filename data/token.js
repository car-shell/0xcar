
import { ERC20ABI as abi } from './abi/ERC20ABI'
import { useCallback, useState, useEffect, useMemo } from "react";
import {ethers} from "ethers"
import { useContract, useAccount, useBalance, useWalletClient, useToken, useReadContracts, useSwitchChain } from "wagmi";
import { readContract, writeContract, simulateContract,waitForTransaction } from "@wagmi/core";
import { ADDRESSES } from '../config/constants/address' 
import { defaultChainId } from "../config/constants/chainId";
import { formatAmount } from "../components/utils";
import {wagmiClient} from '../config/wagmi'
import { formatUnits,erc20Abi } from 'viem' 

export const useTokenContract = (tokenAddress=null)  => {
    const dead = "0x000000000000000000000000000000000000dead";
    const {chain, address, isConnected} = useAccount()
    const {chains} = useSwitchChain()

    const chainId = useMemo(()=>{ return chain!=undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressTokenContract = tokenAddress==null?ADDRESSES[chainId].token:tokenAddress
     // const addressTokenContract = useMemo(()=> {return ADDRESSES[97]?.token})

    const { data: signer, error, isLoading } = useWalletClient()
    const [symbol, setSymbol] = useState("")

    const {data: deadBalance} = useReadContracts({ 
        allowFailure: false, 
        query: {
            notifyOnChangeProps: ['data', 'error'],
            refetchInterval: 2000,
            gcTime: Infinity,
        },
        contracts: [ 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'balanceOf', 
            args: [dead], 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'decimals', 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'symbol', 
          }, 
        ] 
    }) 

    const {data: b} = useReadContracts({ 
        allowFailure: false, 
        query: {
            notifyOnChangeProps: ['data', 'error'],
            refetchInterval: 2000,
            gcTime: Infinity,
        },
        contracts: [ 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'balanceOf', 
            args: [address], 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'decimals', 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'symbol', 
          }, 
        ] 
    }) 

    const {data: tokenInfo} = useReadContracts({ 
        allowFailure: false, 
        query: {
            notifyOnChangeProps: ['data', 'error'],
            refetchInterval: 2000,
            gcTime: Infinity,
        },
        contracts: [ 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'decimals', 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'name', 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'symbol', 
          }, 
          { 
            address: addressTokenContract, 
            abi: erc20Abi, 
            functionName: 'totalSupply', 
          }, 
        ] 
    }) 

    const allowance = useCallback(async (owner, addr, success, fail)=>{
        console.log(`allowance ${owner} ${addr}`);
        const result = await readContract(wagmiClient, {
            address: addressTokenContract,
            chainId: chainId,
            abi,
            functionName: 'allowance',
            args: [owner, addr],
        }).then((result) => {
            success(result)
            return true
        }).catch((e)=>{
            console.log(e); 
            fail(e)
            return false;
        })
       
    }, [addressTokenContract])

    const approve = useCallback( async (addr, amount, success, fail)=>{
        // console.log(`approve ${addr} ${amount} ${addressTokenContract} ${abi}`);
        const config = await simulateContract(wagmiClient, {
            abi,
            address: addressTokenContract,
            functionName: 'approve',
            args: [addr, amount],
        }).then( async ({request})=>{
            console.log(request)
            const data = await writeContract(wagmiClient, request).then(async(hash)=>{
                await success("write", hash)
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                await success("wait", receipt)
            }).catch((e)=>{
                fail(e)
            })
        }).catch((e)=>{
            fail(e)
        })
    }, [addressTokenContract])
    
    return { balance: formatAmount(b), deadBalance: formatAmount(deadBalance), allowance, approve, addressTokenContract, token:(tokenInfo instanceof Array)?{symbol: tokenInfo[2], decimals: tokenInfo[0]}:{}}
}

export default useTokenContract
