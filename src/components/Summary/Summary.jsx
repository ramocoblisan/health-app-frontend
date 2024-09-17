import React, { useEffect, useState } from 'react';
import styles from './Summary.module.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Notiflix from 'notiflix';
import { useNavigate } from 'react-router-dom';

export default function Summary({ consumedCalories, dailyRate = 2800 }) {
  const leftCalories = dailyRate - consumedCalories;
  const percentageOfNormal = ((consumedCalories / dailyRate) * 100).toFixed(2);
  const [userName, setUserName] = useState('Utilizator');
  const navigate = useNavigate();

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
    <div className={styles.summary}>
       <div className={styles.userContainer}>
          <span className={styles.userName}>{userName}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.logoutText}>Exit</span>
          </button>
        </div>
      <div className={styles.container}>
        <div className={styles.leftSideContainer}>
          <h4 className={styles.title}>Summary for {new Date().toLocaleDateString('en-GB')}</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>Left</span>
              <span>{leftCalories} kcal</span>
            </li>
            <li className={styles.listItem}>
              <span>Consumed</span>
              <span>{consumedCalories} kcal</span>
            </li>
            <li className={styles.listItem}>
              <span>Daily rate</span>
              <span>{dailyRate} kcal</span>
            </li>
            <li className={styles.listItem}>
              <span>{percentageOfNormal}% of normal</span>
              <span>{consumedCalories} kcal</span>
            </li>
          </ul>
        </div>
        <div className={styles.rightSideContainer}>
          <h4 className={styles.title}>Food not recommended</h4>
          <p>Your diet will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
