import { connectorsForWallets} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createClient } from "wagmi";
import { mainnet, goerli, arbitrumGoerli, arbitrum, bscTestnet, bsc} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider, webSocketProvider } = configureChains(
    [bscTestnet],
    [
        jsonRpcProvider({ rpc: (chain) =>  {
            if (chain.id == 97) {
                return {
                    // http: "https://data-seed-prebsc-1-s1.binance.org:8545",
                    http: "https://bsc-testnet.publicnode.com",
                }
            } else if (chain.id == 421613 ) {
                return {
                    http: "https://goerli-rollup.arbitrum.io/rpc"
                }
            }

            return {
                http: `${chain.rpcUrls.default}`,
                }
            },
       }),
        publicProvider(),
    ],
);

const needsInjectedWalletFallback =
    typeof window !== "undefined" &&
    window.ethereum &&
    !window.ethereum.isMetaMask &&
    !window.ethereum.isCoinbaseWallet;

const connectors = connectorsForWallets([
    {
        groupName: "Popular",
        wallets: [
            metaMaskWallet({ chains }),
            trustWallet({ chains }),
            // wallet.rainbow({ chains }),
            walletConnectWallet({ chains }),
            // wallet.coinbase({ appName: "Coinbase", chains }),
            ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
        ],
    }
]);

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});