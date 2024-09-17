import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notiflix from 'notiflix';
import styles from "./LogIn.module.css";
import classNames from 'classnames';
import Header from 'components/Header/Header';

export default function LogIn () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Handle login called")
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', {
        email,
        password,
      });

      console.log("Response:", response); 

      if (response.status === 200) {
        const { token } = response.data;

        Notiflix.Notify.success('Logged in successfully!', {
          position: 'center-center',
        });

        localStorage.setItem('token', token);

        navigate('/dashboard');
      }
    } catch (error) {
      console.log("Error:", error);
      Notiflix.Notify.failure(error.response?.data?.message || 'Something went wrong', {
        position: 'right-bottom',
      });
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Log In</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email *"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password *"
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.buttons}>
          <button
           type="submit" 
           className={classNames(styles.baseButton, styles.activeButton)}>
            <span>Log In</span>
          </button>
          <button
              type="button"
              onClick={handleRegisterRedirect}
              className={styles.baseButton}
            >
              <span>Register</span>
            </button>
        </div>
        </form>
        
      </div>
    </>
  );
}