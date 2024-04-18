// import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/common.css'
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit"; 
import { wagmiClient } from "../config/wagmi";
import { WagmiConfig } from "wagmi";
import { StateProvider } from '../store/store'
import { useState, useEffect } from "react";

import UAParser from 'ua-parser-js';
import Router from 'next/router';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    setLoaded(true)

    const uaParser = new UAParser();
    const userAgent = uaParser.getResult();

    const isMobile = userAgent.device && userAgent.device.type === 'mobile';

    // if (isMobile) {
    //   Router.push('/mobile');
    // } else {
    //   Router.push('/');
    // }

  }, [])

  return <> 
    {loaded && (
      <StateProvider>
        <WagmiConfig config={wagmiClient}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()}>
              <Component {...pageProps} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </StateProvider>
    )}
  </>
}

export default MyApp
