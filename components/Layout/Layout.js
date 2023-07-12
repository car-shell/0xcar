import Head from 'next/head'
import { Helmet } from 'react-helmet'
import Header from '../Head/Header'
import Footer from '../Footer/Footer'
import s from "../../styles/Home.module.css";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import Link from "next/link";

const AlertTemplate = ({ style, options, message, close }) => (
  <div style={style}>
    <div>
    {options.title || 'tips'}
    </div>
    <div>
    {message}
    </div>
    <button onClick={close}>{options.button || 'OK'}</button>
  </div>
)

export default function Layout({children, showFooter=true, showMenu=true}) {
  return (
    <>
    <AlertProvider template={AlertTemplate} >
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Helmet>
        <title data-react-helmet="true">0xCardinal</title>
      </Helmet>
      <Header showMenu={showMenu}/>
      <div style={{marginTop: '70px', width: '100%'}}> {children} </div>
      {showFooter && <Footer />}
    </div>
    </AlertProvider>
    </>
  )
}
