import { useContract, useProvider, useAccount, useContractRead, useSigner, useNetwork } from "wagmi";
import { useMemo, useCallback, useState, useEffect} from "react";
import { readContract, writeContract, prepareWriteContract } from "@wagmi/core";
import { ethers } from "ethers"
import { ADDRESSES } from '../config/constants/address' 
import { ERC721ABI as abi } from './abi/ERC721ABI'
import { useTokenContract } from "./token";
import { defaultChainId } from "../config/constants/chainId";

const useNFTContract = () => {
    const {chain} = useNetwork()
    const {address} = useAccount()
    const {allowance, approve} = useTokenContract()
    const [ownList, setOwnList] = useState([])
    const [canClaimLevel, setCanClaimLevel] = useState({level:0, reason: 0})
    const chainId = useMemo(()=>{ return chain?.id ? chain.id : defaultChainId}, [chain])
    const addressNFTContract = ADDRESSES[chainId]?.nft
    // const addressNFTContract = useMemo(()=> {return ADDRESSES[97]?.nft})
    const { data: signer, error, isLoading } = useSigner()
    const erc721 = useContract({
        address: addressNFTContract,
        abi: abi,
        signerOrProvider: signer
    })

    const { data: ownOfData } = useContractRead({
            address: addressNFTContract,
            abi: abi,
            functionName: 'ownOf',
            chainId: chainId,
            args: [address],
            watch: true,
            cache: 20_000,
            // structuralSharing: (prev, next) => (prev === next ? prev : next),
            onSuccess:(data)=>{
                // console.log('****');
            }
        }
    )

     const { data: whitelist } = useContractRead({
            address: addressNFTContract,
            abi: abi,
            functionName: 'isEligible',
            chainId: chainId,
            args: [address],
            watch: true
        }
    )

    useEffect(()=>{
        console.log(ownOfData);
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
            setCanClaimLevel({level:whitelist[1], reason:whitelist[2]})
        }
        
    },[whitelist])
    
    const getNFT = useCallback(async (nftID, success)=>{
        const result = await readContract({
            address: addressNFTContract,
            abi: abi,
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
        const config = await prepareWriteContract({
            address: addressNFTContract,
            abi: abi,
            functionName: 'mergeNFTs',
            args: [level1ID1, level1ID2, level2ID],
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
    }, [address, addressNFTContract])

    const fuse = useCallback( async (level1ID1, level1ID2, level2ID, success, fail)=>{
        const gas = ethers.BigNumber.from('1000000000000000000000');
    
        await allowance(address, addressNFTContract, (amount)=>{
            if (amount.lt(gas)) {
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
        const config = await prepareWriteContract({
            address: addressNFTContract,
            abi: abi,
            functionName: 'awardItem',
        }).catch((e)=>{
            fail(e)
            return
        })

        const data = await writeContract(config).then((data)=>{
            success(data)
        }).catch((e)=>{
            console.log(e);
            fail(e)
        })
    }, [])

   
    return { ownList, getNFT, canClaimLevel, fuse, claim }
}

export default useNFTContract;