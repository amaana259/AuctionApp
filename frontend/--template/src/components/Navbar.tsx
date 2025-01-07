import React from "react";
import { useNavigate } from "react-router-dom";
import userPNG from "../assets/user.png"
import styles from '../styles/navbar.module.css';

const Navbar: React.FC = () => {
  const navigator = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userID");
    alert("BYEEE BYEEE!!!")
    navigator("/");
  };

  return (
    <div>
        <ul className={styles.container}>
            <span className={styles.subcontainer}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigator("/home")}>Home</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigator("/browse")}>Browse</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigator("/profile")}>Profile</li>
            </span>
            <span className={styles.subcontainer}>
                <li><img src={userPNG} alt="User" style={{ width: '40px' }} /></li>
                <li className={styles.logout} style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
            </span>
        </ul>
    </div>
  );
};

export default Navbar;