import React, { useState, useEffect } from 'react';
import styles from './AddProductModal.module.css';
import axios from 'axios';

const AddProductModal = ({ show, onClose, selectedDate, onProductAdded }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

      onProductAdded();
      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
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
          <button 
          onClick={handleAddProduct}
          className={styles.addButton}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
