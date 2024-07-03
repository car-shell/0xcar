import {Failed} from '../../components/Mission'
import Layout from '../../components/Layout/Layout'

export default function Home() {
  return (
    <>
    <Layout showFooter={false}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Failed />
      </div>
    </Layout>
    </>
  )
}
