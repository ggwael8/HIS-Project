import React from 'react';
import classes from './LogoLogIn.module.css';
import logo from '../../Images/SVG/logo.svg'

export default function LogoLogIn()
{
    return (
        <div className={classes.logo}>
            <img src={logo} alt='logo' className={classes.logophoto} />
        </div>
    );
}
