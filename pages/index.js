import MainPage from '../components/MainPage/MainPage'
import Layout from '../components/Layout/Layout'
import Pool from '../components/Bet/Pool'

import isMobile from "is-mobile";

export default function Home() {
  return (
    <Layout>
        <Pool />
    </Layout>
  )
}


export async function getServerSideProps(ctx) {
  const isMobileDevice = isMobile({ ua: ctx.req, tablet: false });
  const isTabletDevice =
    !isMobileDevice && isMobile({ ua: ctx.req, tablet: true });
  let route = "/";
  if (isMobileDevice) {
    route = "/mobile";
  } else {
    return {props: {}}
  }
  return {
    props: {},
    redirect: {
      destination: route,
      permanent: true,
    },
  };
}