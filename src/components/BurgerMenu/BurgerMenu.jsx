import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BurgerMenu.module.css';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();
  
  const isDiaryPage = location.pathname === '/diary';
  const isCalculatorPage = location.pathname === '/calculator';

  return (
    <>
      <div className={styles.menuContainer}>
        <button className={styles.burgerButton} onClick={toggleMenu}>
          {isOpen ? 'X' : '☰'}
        </button>

        {isOpen && (
          <div className={styles.menu}>
            <ul>
              <li>
                <Link to="/diary"
                 onClick={toggleMenu} 
                 className={classNames(styles.link, {[styles.activeLink]: isDiaryPage})}>
                  Diary
                </Link>
              </li>
              <li>
                <Link to="/calculator" 
                onClick={toggleMenu} 
                className={classNames(styles.link, {[styles.activeLink]: isCalculatorPage})}>
                  Calculator
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
