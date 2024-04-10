import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';


import { http, createConfig } from "wagmi";
import { metaMask } from 'wagmi/connectors'
// import { http } from 'viem'
import { mainnet, goerli, arbitrumGoerli, arbitrum, bscTestnet, bsc, base, baseGoerli, baseSepolia} from "wagmi/chains";
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

// export const { chains, publicClient, webSocketPublicClient } = configureChains(
//     [baseSepolia],
//     [
//         jsonRpcProvider({ rpc: (chain) =>  {
//             if (chain.id == 97) {
//                 return {
//                     // http: "https://data-seed-prebsc-1-s1.binance.org:8545",
//                     http: "https://bsc-testnet.publicnode.com",
//                 }
//             } else if (chain.id == 421613 ) {
//                 return {
//                     http: "https://goerli-rollup.arbitrum.io/rpc"
//                 }
//             } else if (chain.id == 8453 ) {
//                 return {
//                     http: "https://base.llamarpc.com"
//                 }
//             } else if (chain.id == 84532 ) {
//                 return {
//                     http: "https://base-sepolia.blockpi.network/v1/rpc/public"
//                 }
//             }

//             return {
//                 http: `${chain.rpcUrls.default}`,
//                 }
//             },
//        }),
//         publicProvider(),
//     ],
// );

const config = getDefaultConfig({
    appName: '0xCardinal',
    projectId: '1ecbab09b9b8ddac73ebc54d1190788c',
    chains: [base, baseSepolia],
    // ssr: true, // If your dApp uses server side rendering (SSR)
  });

// const needsInjectedWalletFallback =
//     typeof window !== "undefined" &&
//     window.ethereum &&
//     !window.ethereum.isMetaMask &&
//     !window.ethereum.isCoinbaseWallet;
// const connectors = connectorsForWallets([
//     {
//         groupName: "Popular",
//         wallets: [
//             injectedWallet({chains}),
//             metaMaskWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains }),
//             okxWallet({
//                 projectId: "1ecbab09b9b8ddac73ebc54d1190788c",
//                 chains: chains
//               }),
//             coinbaseWallet({ chains, appName: '0xCardinal App' }),
//             trustWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains }),
//             walletConnectWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains })
              
//             // wallet.coinbase({ appName: "Coinbase", chains }),
//             // ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
//         ],
//     }
// ]);

export const wagmiClient = createConfig({
    connectors: [metaMask()],
    chains: [baseSepolia],
    transports:{
        [base.id]: http("https://base.llamarpc.com"),
        [baseSepolia.id]: http("https://base-sepolia.blockpi.network/v1/rpc/public"),
    },
});