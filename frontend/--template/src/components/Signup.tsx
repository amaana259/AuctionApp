import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/signup.module.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigator = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (userID) {
      navigator('/home');
    }
  }, [navigator]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("signing up with: ", username, password);
    if (password !== confirmPassword) 
    {
        alert("passwords do not match.");
        return;
    }
    try {
        const response = await fetch("http://localhost:8000/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        });

        if (!response.ok) 
        {
            const data_err = await response.json();
            // console.log("here,", data_err.message)

            throw new Error(data_err.message);
        }
  
        // const data = await response.json();

        alert('registration successful, please log in now.');
        navigator('/login');

      } catch (error) 
      {
        console.error("signup error:", error);
        alert(error)
      }
  };

  return (
    <div>
    {/* <Navbar /> */}
    <div className={styles.container}>
    {/* <Navbar /> */}
      <form className={styles.loginform} onSubmit={handleSignup}>
        <h2>Signup</h2>
        <div className={styles.formgroup}>
          <label className={styles.label} htmlFor="username">Username</label>
          <input className={styles.input} type="text" id="username" name="username" placeholder="Enter your username"
            value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className={styles.formgroup}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} type="password" id="password" name="password" placeholder="Enter your password"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className={styles.formgroup}>
          <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
          <input className={styles.input} type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <div className={styles.formgroup}>
          <button className={styles.button} type="submit">Sign Up</button>
        </div>
        <div className={`${styles.formgroup} ${styles.signuplink}`}>
          Already have an account? <button className={styles.button} type="button" onClick={() => navigator('/login')}>Login</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Signup;