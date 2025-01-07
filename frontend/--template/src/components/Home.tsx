import React from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import styles from '../styles/home.module.css';

const Home: React.FC = () => {
  const navigator = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userID")) {
        // console.log("nahhh");
      navigator("/");
    }
  }, [navigator]);

//   const handleJoinNow = () => {
//     navigate("/");
//   };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div>
          <h1> Welcome to BidMe!</h1>
          <p className={styles.subtitle}>Discover unique items and bid to win!</p>
          <p className={styles.subtitle}>Join Now!</p>
          {/* <button className={styles.join} onClick={handleJoinNow}>Join Now!</button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;