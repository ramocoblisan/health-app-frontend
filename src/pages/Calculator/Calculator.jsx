import React from 'react';
import CalculatorComponent from '../../components/Calculator/CalculatorComponent';
import DashboardHeader from 'components/DashboardHeader/DashboardHeader';
import Summary from 'components/Summary/Summary';
import styles from './Calculator.module.css';

export default function Calculator() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.dashboard}>
          <DashboardHeader />
        </div>
        <div className={styles.calculator}>
          <CalculatorComponent />
        </div>
      </div>

      <div className={styles.summary}>
        <Summary />
      </div>
    </div>
  );
};
