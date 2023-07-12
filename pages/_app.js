import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/common.css'
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit"; 
import { chains, wagmiClient } from "../config/wagmi";
import { WagmiConfig } from "wagmi";
import { StateProvider } from '../store/store'
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    setLoaded(true)
  }, [])

  return <> 
    {loaded && (
      <StateProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </StateProvider>
    )}
  </>
}

export default MyApp
