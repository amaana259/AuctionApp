import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/browse.module.css';
import auctionPNG from "../assets/auction.png"
import Navbar from "./Navbar";
// import SpecificAuctionPage from "./SpecificAuctionPage";

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

const Browse: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [search, setSearch] = useState('');
    const [filtered_auctions, setFiltered] = useState<Auction[]>([]);
    const navigator = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("userID")) {
            // console.log("nahhh");
            navigator("/");
        }
    }, [navigator]);

    const fetchAuctions = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/auction/fetchauctions');
            const data = await response.json();
            // console.log(data)
            setAuctions(data);
            setFiltered(data);
        } catch (error) {
            console.error('failed to fetch auctions:', error);
        }
    };

    useEffect(() => { fetchAuctions() }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearch = () => {                                            // for offline filtering, with the click of search button.
        const lowercased = search.toLowerCase();                            // if need to go back to original page, need to clear out search and click.
        const filtered_auctions = auctions.filter(auction =>
            auction.title.toLowerCase().includes(lowercased)
        );
        setFiltered(filtered_auctions);
    };

    // const filtered_auctions = auctions.filter(auction =>                 // for live filtering, without the search button.
    //     auction.title.toLowerCase().includes(lowercased)
    //   );

    const specificAuction = (id: string) => {
        navigator(`/auction/${id}`);
    };

    // const specificAuction = (id: string) => {                            // useParams was not working.
    //     navigator(`/auction?auctionId=${id}`);
    // };

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
            return <span style={{ color: 'green' }}>In Progress</span>;
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
                    <div className={styles.searchcontainer}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <button className={styles.button} onClick={handleSearch} >Search</button>
                    </div>
                    {filtered_auctions.map(auction => (
                        <div key={auction._id} className={styles.auctioncard} onClick={() => specificAuction(auction._id)}>
                            <img src={auctionPNG} alt="Item" className={styles.itemimage} />
                            <div className={styles.auctiondetails}>
                                <h2 className={styles.auctiontitle}>{auction.title}</h2>
                                <p className={styles.description}>{auction.description}</p>
                                <p>Starting Price: Rs.{auction.startingPrice}</p>
                                <p>Current Price: Rs.{auction.currentPrice}</p>
                                <p>Starting Time: {humanifyTimestamp(auction.startingTime)}</p>
                                <p>Ending Time: {humanifyTimestamp(auction.endingTime)}</p>
                                <p>Status: {statusStyle(auction.ended)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
};

export default Browse;