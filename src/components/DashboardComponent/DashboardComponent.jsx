import React from 'react';
import DashboardHeader from 'components/DashboardHeader/DashboardHeader';
import Calculator from 'components/Calculator/CalculatorComponent';
import Summary from 'components/Summary/Summary';
import styles from './DashboardComponent.module.css';

export default function DashboardComponent() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.dashboard}>
          <DashboardHeader />
        </div>
        <div className={styles.calculator}>
          <Calculator />
        </div>
      </div>


      <div className={styles.summary}>
        <Summary />
      </div>
    </div>
  );
}
