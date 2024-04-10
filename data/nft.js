import { useContract, useReadContract, useWalletClient, useAccount, useSwitchChain } from "wagmi";
import { useMemo, useCallback, useState, useEffect} from "react";
import { readContract, writeContract, simulateContract, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers"
import { ADDRESSES } from '../config/constants/address' 
import { ERC721ABI as abi } from './abi/ERC721ABI'
import { useTokenContract } from "./token";
import { defaultChainId } from "../config/constants/chainId";
import {wagmiClient} from '../config/wagmi'

const useNFTContract = () => {
    const {address, chain} = useAccount()
    const {chains} = useSwitchChain()
    const {allowance, approve} = useTokenContract()
    const [ownList, setOwnList] = useState([])
    const [canClaimLevel, setCanClaimLevel] = useState({level:0, reason: 0})
    const chainId = useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressNFTContract = ADDRESSES[chainId]?.nft
    // const addressNFTContract = useMemo(()=> {return ADDRESSES[97]?.nft})
    // const { data: signer, error, isLoading } = useWalletClient()
    // const erc721 = useContract({
    //     address: addressNFTContract,
    //     abi,
    //     signerOrProvider: signer
    // })

    const { data: ownOfData } = useReadContract({
            address: addressNFTContract,
            abi,
            functionName: 'ownOf',
            chainId: chainId,
            args: [address],
            watch: true,
            cache: 20_000,
            // structuralSharing: (prev, next) => (prev === next ? prev : next),
            onSuccess:(data)=>{
                console.log(data);
            }
        }
    )

     const { data: whitelist } = useReadContract({
            address: addressNFTContract,
            abi,
            functionName: 'isEligible',
            chainId: chainId,
            args: [address],
            watch: true,
            onSuccess:(data)=>{
                console.log(data);
            }
        }
    )

    useEffect(()=>{
        if (ownOfData===undefined) {
            return
        }
        let nfts = ownOfData[0]
        if ( ownList.length === 0 ||
            (nfts.length === ownList.length &&
             nfts.toString() === ownList.sort().toString())) {
            setOwnList(nfts)
        }
    },[ownOfData])

    useEffect(()=>{
        console.log(whitelist);
        if (whitelist===undefined) {
            return
        }
        if (!whitelist[0]) {
            setCanClaimLevel({level:0, reason:-1})
        } else {
            setCanClaimLevel({level:Number(whitelist[1]), reason:Number(whitelist[2])})
        }
        
    },[whitelist])
    
    const getNFT = useCallback(async (nftID, success)=>{
        const result = await readContract(wagmiClient, {
            address: addressNFTContract,
            abi,
            functionName: 'getNFT',
            args: [nftID],
        }).then((result) => {
            success(result)
            return true
        }).catch((e)=>{
            console.log(e); 
            return false;
        })
    }, [address, addressNFTContract])

    const merginNft = useCallback(async (level1ID1, level1ID2, level2ID, success, fail) => {
        const config = await simulateContract(wagmiClient, {
            address: addressNFTContract,
            abi,
            functionName: 'mergeNFTs',
            args: [level1ID1, level1ID2, level2ID],
        }).then( async ({request})=>{
            const data = await writeContract(wagmiClient, request).then((data)=>{
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
    }, [address, addressNFTContract])

    const fuse = useCallback( async (level1ID1, level1ID2, level2ID, success, fail)=>{
        const gas = 1000n*n1e18;
    
        await allowance(address, addressNFTContract, (amount)=>{
            if (amount < gas) {
                approve(addressNFTContract, gas, (r)=>{
                    merginNft(level1ID1, level1ID2, level2ID, success, fail)
                }, (e)=>{
                    fail(e)
                })
            } else {
                merginNft(level1ID1, level1ID2, level2ID, success, fail)
            }
        }, (e)=>{
            console.log(e)
        })
        
    }, [address, addressNFTContract])

    const claim = useCallback( async (success, fail)=>{
        const config = await simulateContract(wagmiClient, {
            address: addressNFTContract,
            abi,
            functionName: 'awardItem',
        }).then(async ({request})=>{
            const data = await writeContract(wagmiClient, request).then(async (hash)=>{
                const receipt = await waitForTransaction(wagmiClient, {
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                success(receipt)
            }).catch((e)=>{
                console.log(e);
                fail(e)
            })
        }).catch((e)=>{
            console.log(e);
            fail(e)
            return
        })

       
    }, [])

   
    return { ownList, getNFT, canClaimLevel, fuse, claim }
}

export default useNFTContract;