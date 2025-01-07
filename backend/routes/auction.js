import express from "express";
import { createAuction, fetchAuctionsUser, fetchAuctions, getAuction } from "../controllers/auction.js";

const app = express.Router();

// route to creating an auction API.
app.post("/createauction", createAuction);

// route to fetching all auctions created by a user API.
app.post("/fetchauctionsuser", fetchAuctionsUser);

// route to fetching all auctions created.
app.get("/fetchauctions", fetchAuctions);

// route to fetch a specific auction.
app.get("/findauction/:id", getAuction);

export default app;