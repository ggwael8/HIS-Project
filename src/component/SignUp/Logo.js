
import React from 'react';
import classes from './Logo.module.css';
import logo from '../../Images/SVG/logo.svg'

export default function Logo()
{
    return (
        <div className={classes.logo}>
            <img src={logo} alt='logo' />
        </div>
    );
}
