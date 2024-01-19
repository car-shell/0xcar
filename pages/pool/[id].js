import Pool from '../../components/Bet/Pool'
import Layout from '../../components/Layout/Layout'
import { useRouter } from 'next/router';


// import { GetServerSideProps } from "next";

// export const getServerSideProps = async (context) => {
//   return {
//     props: {},
//   };
// }

export default function Home() {
    let router =  useRouter();
    const {id} = router.query
    console.log(id);
  return (
    <>
    <Layout>
        <Pool id={id}/>
    </Layout>
    </>
  )
}
