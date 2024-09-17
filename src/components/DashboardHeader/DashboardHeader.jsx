import React, { useEffect, useState } from 'react';
import logo from '../../images/logo-mobile@1x.png'; 
import styles from "./DashboardHeader.module.css";
import dashboardLogo from '../../images/logoDashb-mobile@1x.png';
import BurgerMenu from 'components/BurgerMenu/BurgerMenu';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Notiflix from 'notiflix';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export default function DashboardHeader() {
  const [userName, setUserName] = useState('Utilizator');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();
  
  const isDiaryPage = location.pathname === '/diary';
  const isCalculatorPage = location.pathname === '/calculator';
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name || 'Utilizator');  
      } catch (error) {
        console.error('Token invalid:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3001/api/users/logout', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      Notiflix.Notify.success('Logged out successfully!', {
        position: 'center-center',
      });

      localStorage.removeItem('token');

      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoNavContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="App Logo" className={styles.logo} />
          <img src={dashboardLogo} alt="Dashboard Logo" className={styles.dashboardLogo} />
        </div>
        <nav className={styles.navList}>
          <ul className={styles.listContainer}>
            <li className={styles.diary}>
              <Link to="/diary"
                 onClick={toggleMenu} 
                 className={classNames(styles.link, {[styles.activeLink]: isDiaryPage})}>
                  Diary
              </Link></li>
            <li>
              <Link to="/calculator" 
                onClick={toggleMenu} 
                className={classNames(styles.link, {[styles.activeLink]: isCalculatorPage})}>
                Calculator
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <BurgerMenu />
      <div className={styles.userContainer}>
        <span className={styles.userName}>{userName}</span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <span className={styles.logoutText}>Exit</span>
        </button>
      </div>
    </header>
  );
}
