
import {server} from '../config'
import ArticleList from '../components/ArticleList'
import articleStyles from '../styles/Article.module.css'
import Link from'next/link'
//
export default function Home({articles}) {
  return (
    <div>     
     <ArticleList articles ={articles}/>
     <Link href="/add">
       <a className={articleStyles.card}>
     <div>ADD</div>
     </a>
     </Link>
    </div>  
  )
}
//
export const getStaticProps = async ()=> {
   const res = await fetch(`${server}/article`)
   const articles = await res.json()

   return{
     props:{
      articles
     }
   }
}