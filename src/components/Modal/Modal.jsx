import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ show, onClose, calorieIntake, products }) => {
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!show) {
    return null; 
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.titleContainer}>
        <h2 className={styles.title}>Your recommended daily calorie intake is</h2>
        </div>
        <p className={styles.calories}>{calorieIntake}<span className={styles.kcal}>kcal</span></p>
        <div className={styles.listContainer}>
          <h4>Foods you should not eat</h4>
          <ul className={styles.list}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <li key={index}>{index + 1}. {product}</li>
              ))
            ) : (
              <li>No products to display</li>
            )}
          </ul>
        </div>
        <div className={styles.btncontainer}>
          <button onClick={onClose} className={styles.closeBtn}>
            <span className={styles.btnText}>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

