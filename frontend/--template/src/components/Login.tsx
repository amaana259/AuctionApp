import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/login.module.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigator = useNavigate();

    useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (userID) 
    {
        navigator('/home');
    }
    }, [navigator]);
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:8000/api/user/login", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password }),
        });

        if (!response.ok) {
            const data_err = await response.json();
            // console.log("here,", data_err.message)
            throw new Error(data_err.message);
        }

        const data = await response.json();

        localStorage.setItem("userID", data.userID);

        navigator("/home");

    } catch (error) 
    {
        console.error("login error:", error);
        alert(error)
    }
};

return (
    <div className={styles.container}>
    <form className={styles.loginform} onSubmit={handleLogin}>
    <h2>Login</h2>
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
    <button className={styles.button} type="submit">Login</button>
    </div>
    <div className={`${styles.formgroup} ${styles.signuplink}`}>
    Don't have an account? <button className={styles.button} type="button" onClick={() => navigator("/")}>Sign up!</button>
    </div>
    </form>
    </div>
    );

};
    
export default Login;