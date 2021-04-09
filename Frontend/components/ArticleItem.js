import React from 'react'
import Link from 'next/link'
import articleStyles from '../styles/Article.module.css'

const ArticleItem = ({ article }) => {



    const card = articleStyles.card;

    //Take the rating and select the styles acc
    //then remove all the cards and nth child shits
    // const card = articleStyles.card{the rating range};


    return (
        <div className={card}>

            <Link href="/article/[id]" as={`/article/${article._id}`}>
                <a >
                    <p className={articleStyles.rating}> Rating</p>
                    <p className={articleStyles.rating}>Div A Q-C</p>
                    <h3>{article.title} &rarr;</h3>
                    <p>{article.body}</p>
                    <p className={articleStyles.tags}>
                        <p className={articleStyles.tag}>tags</p>
                        <p className={articleStyles.tag}>tags</p>
                        <p className={articleStyles.tag}>tags</p>
                        <p className={articleStyles.tag}>tags</p>
                    </p>

                </a>
            </Link>
            <p>state</p>
            <p>STALK ▼</p>
            <div className={articleStyles.ul}>
                <div className={articleStyles.target}>
                    <div className={articleStyles.name}> lol  --></div>
                    <div className={articleStyles.result}> Assecpted</div>
                </div>
                <div className={articleStyles.target}>
                    <div className={articleStyles.name}> lol  --></div>
                    <div className={articleStyles.result}> Assecpted</div>
                </div>
                <div className={articleStyles.target}>
                    <div className={articleStyles.name}> lol  --></div>
                    <div className={articleStyles.result}> Assecpted</div>
                </div>
                <div className={articleStyles.target}>
                    <div className={articleStyles.name}> lol  --></div>
                    <div className={articleStyles.result}> Assecpted</div>
                </div>
               
            </div>           
           
        </div>
    )
}
export default ArticleItem