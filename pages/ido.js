import IDO from '../components/IDO'
import Layout from '../components/Layout/Layout'
import { useRouter } from 'next/router';

export default function Home() {
  let router =  useRouter();
  const {refera} = router.query
  return (
    <>
    <Layout >
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <IDO refera={refera} />
      </div>
    </Layout>
    </>
  )
}
