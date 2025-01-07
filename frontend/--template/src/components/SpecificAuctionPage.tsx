import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import styles from '../styles/specificauction.module.css';
import auctionPNG from "../assets/auction.png"
import Navbar from "./Navbar";

const userID = localStorage.getItem("userID");

const socket = io('http://localhost:8000', 
{
    query: { clientId: userID }
});

// const socket = io('http://localhost:8000');

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

const humanifyTimestamp = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
};

const SpecificAuctionPage:React.FC = () => {
    const { auctionID } = useParams();
    const navigator = useNavigate();
    // console.log("this is auction ID", auctionID);

    useEffect(() => {
        if (!localStorage.getItem("userID")) {
            // console.log("nahhh");
          navigator("/");
        }
      }, [navigator]);

    const [auction, setAuction] = useState<Auction | null>(null);
    const [bid, setBid] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', auctionID);

    const fetchAuctionDetails = async () => {
        // console.log("fetching auction with ", auctionID);
        const response = await fetch(`http://localhost:8000/api/auction/findauction/${auctionID}`);
        const data: Auction = await response.json();
        // console.log("data is", data)
        // const data = await response.json();
        setAuction(data);
    };

    fetchAuctionDetails();

    socket.on('updateCurrentPrice', (new_curr_price: number) => {
        setAuction(prev => prev ? { ...prev, currentPrice: new_curr_price } : null);
    });

    socket.on('auctionEnded', (data: { winnerName: string, finalPrice: number }) => {
        // console.log("this here", data)
        alert(`Auction ended! Sold to Winner: ${data.winnerName} with bid: Rs.${data.finalPrice}`);
        navigator('/home')
        // setAuction(prev => prev ? { ...prev, ended: true } : null);                         // null check.
    });

    socket.on('error', (error: string) => {
        // console.log(error)
        alert(error)
    });

    return () => {
        socket.emit('leaveRoom', auctionID);
        // socket.emit('disconnect');
        socket.off('updateCurrentPrice');
        socket.off('auctionEnded');
        // socket.close();
    };
  }, [auctionID]);

  const placeBid = () => {
    const userID = localStorage.getItem("userID");
    let bid_handled = false;

    if (auction?.creator !== userID)
    {
        if ((auction?.currentPrice === auction?.startingPrice) && (parseInt(bid) >= (auction?. currentPrice || 0)) && (bid_handled === false))
        {
            bid_handled = true;
            socket.emit('placeBid', { auctionID, bid: parseInt(bid), userID: userID });
        }
        else
        {
            if ((parseInt(bid) > (auction?. currentPrice || 0)) && (bid_handled === false))
            {
                socket.emit('placeBid', { auctionID, bid: parseInt(bid), userID: userID });
            }
            else
            {
                alert('your bid must be higher than the current going price!');
            }
        }
    }
    else
    {
        alert('you cannot bid on your own auction!');
    }
  };

  return (
    <div>
        <Navbar />
        <div className={styles.auctiondetails} >
        {auction && (
            <>
            <div className={styles.auctionimage}>
                <img src={auctionPNG} alt="Item" className={styles.itemimage} />
            </div>
            <div className={styles.auctioninfo}>
                <h2 className={styles.auctiontitle}>{auction.title}</h2>
                <p className={styles.description}>{auction.description}</p>
                <p><strong>Starting Price:</strong> Rs. {auction.startingPrice}</p>
                <p><strong>Current Price:</strong> Rs. {auction.currentPrice}</p>
                <p><strong>Start Time:</strong> {humanifyTimestamp(auction.startingTime)}</p>
                <p><strong>End Time:</strong> {humanifyTimestamp(auction.endingTime)}</p>
                <div className={styles.bidform}>
                <label className={styles.label} htmlFor="bidAmount">Your Bid:</label>
                <input className={styles.input} type="number" id="bidAmount" name="bidAmount" value={bid} onChange={e => setBid(e.target.value)} min="0" step="1" required />
                <button className={styles.button} onClick={placeBid}>Place Bid</button>
                </div>
            </div>
            </>
        )}
        </div>
    </div>
  );
};

export default SpecificAuctionPage;