import MainPage from '../components/MainPage/MainPage'
import Layout from '../components/Layout/Layout'

export default function Home() {
  return (
    <Layout showMenu={false}>
        <MainPage />
    </Layout>
  )
}
