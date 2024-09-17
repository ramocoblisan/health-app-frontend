import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo-mobile@1x.png'; 
import  styles from "./Header.module.css";
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import logoTablet from '../../images/logo-tablet@1x.png';
import logoDesktop from '../../images/logo-desktop@1x.png';


export default function Header() {

    const location = useLocation();
  
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

  return (
    <header className={styles.header}>
        <div className={styles.logoContainer}>
            <img src={logo} alt="App Logo" className={styles.logo} />
            <img src={logoTablet} alt="App Logo" className={styles.logoTablet} />
            <img src={logoDesktop} alt="App Logo" className={styles.logoDesktop} />
        </div>
        <div className={styles.authButtons}>
            <Link to="/login" className={classNames(styles.button, {[styles.activeButton]: isLoginPage})}>Log In</Link>
            <Link to="/register" className={classNames(styles.button, {[styles.activeButton]: isRegisterPage})}>Registration</Link>
        </div>
    </header>
);
}