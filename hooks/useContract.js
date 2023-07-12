import { Contract, ContractInterface } from "@ethersproject/contracts";
import { AddressMap } from "../config/constants/address";
import { ChainId, defaultChainId } from "../config/constants/chainId";
import { provider } from "../config/wagmi";
import { useMemo } from "react";
import { useNetwork, useProvider, useSigner } from "wagmi";
import {ERC20ABI as ABI} from '../data/abi/ERC20ABI'

export const createStaticContract = (ABI) => {
    return (address, chainId) => {
        const provider = provider.getStaticProvider(chainId);
        return useMemo(() => new Contract(address, ABI, provider), [address, provider]);
    };
};

const createDynamicContract = (ABI) => {
    return (addressMap, asSigner = false) => {
        const provider = useProvider();
        const { data: signer } = useSigner();
        const { chain = { id: defaultChainId } } = useNetwork();

        return useMemo(() => {
            const address = addressMap[chain.id];

            if (!address) return null;

            const providerOrSigner = asSigner && signer ? signer : provider;

            return new Contract(address, ABI, providerOrSigner)
        }, [addressMap, chain.id, asSigner, signer, provider]);
    };
};

export const useStaticExampleContract = createStaticContract(ABI);

// export const useDynamicExampleContract = createDynamicContract<type>(ABI);