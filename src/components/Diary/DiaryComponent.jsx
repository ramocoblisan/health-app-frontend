import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DiaryComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from 'components/DashboardHeader/DashboardHeader';
import AddProductModal from '../AddProductModal/AddProductModal';
import axios from 'axios';
import Summary from '../Summary/Summary';

export default function Diary() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [consumedProducts, setConsumedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    fetchConsumedProducts(date);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const fetchConsumedProducts = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/consumed-products/consumed/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Received consumed products:', res.data);
      setConsumedProducts(res.data);
      calculateConsumedCalories(res.data);
      setErrorMessage('');
    } catch (err) {
      console.error('Error fetching consumed products:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Eroare necunoscută la obținerea produselor consumate.');
      }
      setConsumedProducts([]);
      setConsumedCalories(0);
    }
  };

  const calculateConsumedCalories = (products) => {
    const total = products.reduce((acc, product) => {
      return acc + Math.round((product.calories * product.quantity) / 100);
    }, 0);
    setConsumedCalories(total);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleProductAdded = () => {
    fetchConsumedProducts(selectedDate);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Deleting product with ID:', productId, 'and date:', formattedDate);
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/api/consumed-products/delete-consumed', {
        data: {
          productId,
          consumedDate: formattedDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchConsumedProducts(selectedDate);
    } catch (err) {
      console.error('Error deleting consumed product:', err);
    }
  };

  const handleProductSearch = async (e) => {
    const value = e.target.value;
    setProductName(value);
    if (value.length > 0 && !selectedProduct) {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/search?q=${value}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.title);
    setSearchResults([]);
  };

  const handleAddProduct = async () => {
    if (!selectedProduct || !quantity) {
      alert('Please select a product and enter a quantity.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/consumed-products/add-consumed', {
        productId: selectedProduct._id,
        consumedDate: formattedDate,
        quantity: quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductName('');
      setQuantity('');
      setSelectedProduct(null);
      setSearchResults([]);
      
      handleProductAdded();
      closeModal();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  useEffect(() => {
    fetchConsumedProducts(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <DashboardHeader />
      <div className={styles.diary}>
        <div className={styles.dateContainer}>
          <h4>{selectedDate.toLocaleDateString('en-GB')}</h4>
          <div className={styles.calendarIcon} onClick={toggleCalendar}>
            <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
          </div>
        </div>
        
        {showCalendar && (
          <div className={styles.calendarContainer}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDate={new Date()}
              className={styles.reactCalendar}
            />
          </div>
        )}
        <div className={styles.modalOverlayTablet}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} 
          >
            <input
              type="text"
              value={productName}
              onChange={handleProductSearch}
              placeholder="Enter product name"
              className={styles.addinput}
            />
            {searchResults.length > 0 && !selectedProduct && (
              <ul className={styles.searchResults}>
                {searchResults.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => handleSelectProduct(product)}
                  >
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Grams"
              className={styles.addinput}
            />
            <div className={styles.buttonContainer}>
              <button 
              onClick={handleAddProduct}
              className={styles.addButton}>
                +
              </button>
            </div>
          </div>
        </div>
        <ul className={styles.productList}>
          {consumedProducts.length > 0 ? (
            consumedProducts.map((product, index) => {
              const totalCalories = Math.round((product.calories * product.quantity) / 100);
              return (
                <li key={index} className={styles.productItem}>
                  <div>
                    <span className={styles.listItemTitle}>{product.title}</span>
                  </div>
                  <div className={styles.listItemContainer}>
                    <span className={styles.listItem}>{product.quantity} g</span>
                    <span className={styles.listItem}>{totalCalories} kcal</span>
                  </div>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    X
                  </button>
                </li>
              );
            })
          ) : (
            <p>{errorMessage || 'No products consumed on this date'}</p>
          )}
        </ul>

          <div className={styles.productSearchContainer}>
            <input
              type="text"
              value={productName}
              onChange={handleProductSearch}
              placeholder="Enter product name"
              className={styles.addinput}
            />
            {searchResults.length > 0 && !selectedProduct && (
              <ul className={styles.searchResults}>
                {searchResults.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => handleSelectProduct(product)}
                  >
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
            {selectedProduct && (
              <div className={styles.productDetails}>
                <p>Selected Product: {selectedProduct.title}</p>
              </div>
            )}
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Grams"
              className={styles.addinput}
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleAddProduct} className={styles.addButton}>
                Add
              </button>
            </div>
          </div>
          <div className={styles.addButtonContainer}>
            <button onClick={openModal} className={styles.addButton}>
              +
            </button>
          </div>

          <ul className={styles.productListTablet}>
          {consumedProducts.length > 0 ? (
            consumedProducts.map((product, index) => {
              const totalCalories = Math.round((product.calories * product.quantity) / 100);
              return (
                <li key={index} className={styles.productItem}>
                  <div>
                    <span className={styles.listItemTitle}>{product.title}</span>
                  </div>
                  <div className={styles.listItemContainer}>
                    <span className={styles.listItem}>{product.quantity} g</span>
                    <span className={styles.listItem}>{totalCalories} kcal</span>
                  </div>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    X
                  </button>
                </li>
              );
            })
          ) : (
            <p>{errorMessage || 'No products consumed on this date'}</p>
          )}
        </ul>
        <div className={styles.addProductModal}>
        {showModal && (
          <AddProductModal
            show={showModal}
            onClose={closeModal}
            selectedDate={selectedDate}
            onProductAdded={handleProductAdded}
          />
        )}
        </div>
        < AddProductModal />
        <Summary consumedCalories={consumedCalories} dailyRate={2800} />
      </div>
    </>
  );
}
