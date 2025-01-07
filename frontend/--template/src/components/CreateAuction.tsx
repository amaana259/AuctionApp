import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/createauction.module.css';
import Navbar from "./Navbar";

interface AuctionForm 
{
    title: string;
    description: string;
    startingPrice: number;
    startingTime: string;
    endingTime: string;
}

const CreateAuction: React.FC = () => 
{
    const [form, setForm] = useState<AuctionForm>({title: '', description: '', startingPrice: 0, startingTime: '', endingTime: ''});
    const navigator = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("userID")) {
            // console.log("nahhh");
            navigator("/");
        }
    }, [navigator]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'startingPrice' ? parseInt(value) : value })};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userID = localStorage.getItem('userID');

    try {
      const response = await fetch('http://localhost:8000/api/auction/createauction', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: form.title, description: form.description, startingPrice: form.startingPrice.toString(),
            startingTime: form.startingTime, endingTime: form.endingTime, creator: userID
         })
      });

      if (response.ok) {
        alert("auction created successfully.")
        navigator('/browse');
      } 
      else 
      {
        const data_err = await response.json();
        // console.log("here,", data_err.message)
        throw new Error(data_err.message);
      }
    } 
    catch (error) 
    {
      console.error('failed to submit form:', error);
      alert(error)
    }
  };

  return (
    <div>
        <Navbar />
        <div className={styles.container}>
        <h1>Create Auction</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="title">Title:</label>
            <input className={styles.input} type="text" id="title" name="title" value={form.title} onChange={handleChange} required />
            <label className={styles.label} htmlFor="description">Description:</label>
            <textarea className={styles.textarea} id="description" name="description" rows={4} value={form.description} onChange={handleChange} required />
            <label className={styles.label} htmlFor="startingPrice">Starting Price:</label>
            <input className={styles.input} type="number" id="startingPrice" name="startingPrice" value={form.startingPrice} onChange={handleChange} min="0" required />
            <label className={styles.label} htmlFor="startingTime">Starting Time:</label>
            <input className={styles.input} type="datetime-local" id="startingTime" name="startingTime" value={form.startingTime} onChange={handleChange} required />
            <label className={styles.label} htmlFor="endingTime">Ending Time:</label>
            <input className={styles.input} type="datetime-local" id="endingTime" name="endingTime" value={form.endingTime} onChange={handleChange} required />
            <button className={styles.button} type="submit">Create Auction</button>
        </form>
        </div>
    </div>
  );
};

export default CreateAuction;