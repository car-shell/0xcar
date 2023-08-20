import Ranking from '../components/MainPage/Ranking'
import Layout from '../components/Layout/Layout'
import styles from '../styles/MainPage.module.css'
import t from '../styles/Bet.module.css'

export default function Home() {
  return (
    <Layout showMenu={true} showFooter={false}>
        <div className={t.container} style={{height: 'calc(100vh - 72px'}}>
          <div className={`${styles.container} ${styles.flex_column}`} >
              <Ranking width='70%'/>
          </div>
        </div>
    </Layout>
  )
}
