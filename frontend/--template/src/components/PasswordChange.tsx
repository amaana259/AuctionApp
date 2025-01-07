import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/login.module.css';
import Navbar from "./Navbar";

const PasswordChange: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const navigator = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("userID")) {
            // console.log("nahhh");
          navigator("/");
        }
      }, [navigator]);

    const userID = localStorage.getItem('userID');

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) 
            {
            alert("passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/user/changepass", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID: userID, password: newPassword }),
            });

            if (!response.ok) {
                const data_err = await response.json();
                throw new Error(data_err.message);
            }

            alert("password changed successfully!");
            navigator("/profile");                         // navigate back to profile page.

        } catch (error) {
            console.error("password change error:", error);
            alert(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <form className={styles.loginform} onSubmit={handleChangePassword}>
                    <h2>Change Password</h2>
                    <div className={styles.formgroup}>
                        <label className={styles.label} htmlFor="newPassword">New Password</label>
                        <input className={styles.input} type="password" id="newPassword" name="newPassword" placeholder="Enter your new password"
                            value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div className={styles.formgroup}>
                        <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                        <input className={styles.input} type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your new password"
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className={styles.formgroup}>
                        <button className={styles.button} type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChange;