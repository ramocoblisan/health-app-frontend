import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from "./Register.module.css";
import classNames from 'classnames';
import Header from 'components/Header/Header';
import Notiflix from 'notiflix';

export default function RegisterComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === '/register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users/signup', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        const { token } = response.data;

        Notiflix.Notify.success('User registered successfully!', {
          position: 'right-bottom',
        });

        localStorage.setItem('token', token);

        navigate('/dashboard');
      }
    } catch (error) {
      Notiflix.Notify.failure(error.response?.data?.message || 'Something went wrong', {
        position: 'right-bottom',
      });
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name *"
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email *"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password *"
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <div className={styles.buttons}>
            <button
              type="submit"
              className={classNames(styles.baseButton, { [styles.activeButton]: isRegisterPage })}
            >
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={handleLoginRedirect}
              className={styles.baseButton}
            >
              <span>Log In</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
