import React from 'react'
import classes from './SignUpHeadline.module.css';



export default function SignUpHeadline() {
    return (
        <div className={classes.headlines}>
            <h1 className={classes.headline}>
                Sign Up
            </h1>
            <p className={classes.create}>
                Create your account
            </p>
        </div>
    )
}
