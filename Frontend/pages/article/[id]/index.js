import {server} from '../../../config'
import { useRouter } from 'next/router'

//
const article = ({article}) => {
  const router = useRouter()
    return <>
        <h1>{article.title}</h1>       
        <h4>{article.body} </h4>  
     
    <button onClick={() => router.back()}> Back</button>
    

        </>   
}
//
export const getStaticProps = async (context) => {
    const res = await fetch(`${server}/article/${context.params.id}`)
    const article = await res.json() 
    return {
      props: {
        article,
      }}
     }

//
export const getStaticPaths = async (context) => {
  const res = await fetch(`${server}/article`)
  const articles = await res.json()

  console.log(articles);
  const ids = articles.map(article => article._id)
  console.log(ids);
  const paths = ids.map(id => ({params: {id: id.toString()}}))

  return {
    paths,
    fallback:false,
  }}
export default article
