import React from 'react'; 
import Modal from 'components/Modal/Modal';
import styles from "./CalculatorComponent.module.css";
import axios from 'axios';
import classNames from 'classnames';

export default function Calculator() {
  const [showModal, setShowModal] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    height: '',
    age: '',
    currentWeight: '',
    desiredWeight: '',
    bloodType: ''
  });

  const [modalData, setModalData] = React.useState({ calorieIntake: 0, products: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
        isValid = false;
      }
    });

    if (!formData.bloodType) {
      newErrors.bloodType = 'This field is required';
      isValid = false;
    }

    if (isValid) {
      setErrors({});

      try {
        const response = await axios.post('http://localhost:3001/api/products/calories', {
          bloodType: formData.bloodType
        });
        setModalData({
          calorieIntake: response.data.calorieIntake,
          products: response.data.products
        });
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setErrors({ api: 'Failed to fetch data' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <form className={styles.calorieForm} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Calculate your daily calorie intake right now</h3>
        <div className={styles.inputContainer}>
          <div className={styles.leftSideInput}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                id="height" 
                name="height" 
                placeholder="Height *" 
                className={styles.input} 
                value={formData.height}
                onChange={handleChange}
              />
              {errors.height && <p className={styles.error}>{errors.height}</p>}
            </div>

            <div className={styles.formGroup}>
              <input 
                type="text" 
                id="age" 
                name="age" 
                placeholder="Age *" 
                className={styles.input} 
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && <p className={styles.error}>{errors.age}</p>}
            </div>

            <div className={styles.formGroup}>
              <input 
                type="text" 
                id="current-weight" 
                name="currentWeight" 
                placeholder="Current weight *" 
                className={styles.input} 
                value={formData.currentWeight}
                onChange={handleChange}
              />
              {errors.currentWeight && <p className={styles.error}>{errors.currentWeight}</p>}
            </div>
          </div>
          <div className={styles.rightSideInput}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                id="desired-weight" 
                name="desiredWeight" 
                placeholder="Desired weight *" 
                className={styles.input} 
                value={formData.desiredWeight}
                onChange={handleChange}
              />
              {errors.desiredWeight && <p className={styles.error}>{errors.desiredWeight}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={classNames(styles.label, styles.bloodinput)}>Blood type *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="bloodType" 
                    value="A" 
                    checked={formData.bloodType === 'A'}
                    onChange={handleChange}
                    className={styles.radioInput} 
                  /> A
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="bloodType" 
                    value="B" 
                    checked={formData.bloodType === 'B'}
                    onChange={handleChange}
                    className={styles.radioInput} 
                  /> B
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="bloodType" 
                    value="AB" 
                    checked={formData.bloodType === 'AB'}
                    onChange={handleChange}
                    className={styles.radioInput} 
                  /> AB
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="bloodType" 
                    value="0" 
                    checked={formData.bloodType === '0'}
                    onChange={handleChange}
                    className={styles.radioInput} 
                  /> 0
                </label>
              </div>
            </div>
            {errors.bloodType && <p className={styles.error}>{errors.bloodType}</p>}
          </div>
        </div>
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitBtn}>Start losing weight</button>
        </div>
      </form>

      <Modal show={showModal}
       onClose={closeModal} 
       calorieIntake={modalData.calorieIntake}
        products={modalData.products}
      />
    </div>
  );
}

