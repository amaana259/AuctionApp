import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/profile.module.css';
import userPNG from "../assets/user.png"
import Navbar from "./Navbar";

interface User 
{
    _id: string;
    username: string;
    password: string;
    numberOfItemsOwned: number;
    createdAuctions: string[];
}

interface Auction 
{
  _id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endingTime: string;
  creator: string;
  ended: number;
  startingTime: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const navigator = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userID")) {
        // console.log("nahhh");
      navigator("/");
    }
  }, [navigator]);

  const fetchProfile = async () => {
    try {
        const userID = localStorage.getItem("userID");
        const response = await fetch('http://localhost:8000/api/user/finduser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID })
        });
        const userData: User = await response.json();
        // console.log(userData)
        setUser(userData);

        const auctionsResponse = await fetch('http://localhost:8000/api/auction/fetchauctionsuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userID })
        });
        // const data = await auctionsResponse.json();
        const auctionsData: Auction[] = await auctionsResponse.json();
        // console.log("what is ", data)
        // console.log(auctionsData)

        // console.log("this herE: ", user);
        setAuctions(auctionsData);
        // console.log("this herE: ", user);
      } catch (error) {
        console.error('Failed to fetch profile and auctions:', error);
      }
};

  useEffect(() => { fetchProfile() }, []);

  const handleCreateAuction = () => {
    navigator('/createauction');
  };

  const handleChangePassword = () => {
    navigator('/pass');
  };

  const humanifyTimestamp = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const statusStyle = (ended: number | null) => {
    if (ended === 1) 
    {
        return <span style={{ color: 'green' }}>Not Started / In Progress</span>;
    } 
    else if (ended === 2)
    {
        return <span style={{ color: 'blue' }}>Sold</span>;
    } 
    else 
    {
        return <span style={{ color: 'red' }}>Unsold</span>;
    }
};

  return (
    <div>
        <Navbar />
        <div className={styles.container}>
            <div className={styles.profileinfo}>
            <div className={styles.profileimage}>
                <img src={userPNG} alt="User" />
            </div>
            <div className={styles.userdetails}>
                <h2>Username: {user?.username}</h2>
                <p>Number of Items Owned: {user?.numberOfItemsOwned}</p>
            </div>
            </div>
            <div className={styles.profileactions}>
            <button className={styles.button} onClick={handleCreateAuction}>Create Auction</button>
            <button className={styles.button} onClick={handleChangePassword}>Update Password</button>
            </div>
            <h3>My Auctions</h3>
            <div className={styles.auctionlist}>
            {auctions.map(auction => (
                <div key={auction._id} className={styles.auctioncard}>
                <h4>{auction.title}</h4>
                <h6>{auction.description}</h6>
                <p>Starting Price: Rs.{auction.startingPrice}</p>
                <p>
                    {auction.ended === 1
                        ? <span>Current Going Price: Rs.{auction.currentPrice}</span>
                        : auction.ended === 2
                            ? <span>Sold Price: Rs.{auction.currentPrice}</span>
                            : auction.ended === 3
                                ? <span>Unsold at Rs.{auction.currentPrice}</span>
                                : <span>Unknown Price</span>
                    }
                </p>
                <p>Starting Time: {humanifyTimestamp(auction.startingTime)}</p>
                <p>Ending Time: {humanifyTimestamp(auction.endingTime)}</p>
                <p>Status: {statusStyle(auction.ended)}</p>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default Profile;