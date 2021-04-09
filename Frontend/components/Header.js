import React from 'react'
import headerStyles from '../styles/Header.module.css'

const Header=()=> {
    return (
        <div>
            <h1 className={headerStyles.title}>
                <span>
                Chernobyl
                </span>
                &#9762;&#9762;
            </h1>
            <p className ={headerStyles.description}>
                Its time Komrades to Level up !!
            </p>
        </div>
    )
}

export default Header
