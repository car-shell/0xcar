import {Done} from '../../components/Mission'
import Layout from '../../components/Layout/Layout'

export default function Home() {
  return (
    <>
    <Layout showFooter={false}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Done />
      </div>
    </Layout>
    </>
  )
}
