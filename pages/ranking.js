import Ranking from '../components/MainPage/Ranking'
import Layout from '../components/Layout/Layout'
import styles from '../styles/MainPage.module.css'

export default function Home() {
  return (
    <Layout showMenu={true}>
        <div className={`${styles.container} ${styles.flex_column}`} style={{marginTop: '32px'}}>
            <Ranking />
        </div>
    </Layout>
  )
}
