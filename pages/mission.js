import {Mission} from '../components/Mission'
import Layout from '../components/Layout/Layout'
import { useRouter } from 'next/router';

export default function Home() {
  let router =  useRouter();
  const {referral} = router.query
  return (
    <>
    <Layout >
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Mission referral={referral}/>
      </div>
    </Layout>
    </>
  )
}
