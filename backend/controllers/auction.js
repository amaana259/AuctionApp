import User from "../models/user.js";
import Auction from "../models/auction.js";
import { TryCatch } from "../middlewares/error.js";
import bcrypt from "bcrypt";

// create a new auction.
export const createAuction = TryCatch(async (req, res, next) => {
    // console.log(req.body)
    try 
    {
        const { title, description, startingPrice, startingTime, endingTime, creator } = req.body;
        const newAuction = new Auction({
          title,
          description,
          startingPrice,
          currentPrice: startingPrice,
          startingTime,
          endingTime,
          creator
        });
        await newAuction.save();

        // Update the user's createdAuctions ID array
        const user = await User.findById(creator);
        user.createdAuctions.push(newAuction._id);
        await user.save();

        res.status(201).json(newAuction._id);
    } 
    catch (error) 
    {
        res.status(400).json({ message: error.message });
    }
});

// fetch all auctions created by a user.
export const fetchAuctionsUser = TryCatch(async (req, res, next) => {
    try 
    {
        const { userID } = req.body;
        const auctions = await Auction.find({ creator: userID });
        res.json(auctions);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
}
);

// fetch all auctions.
export const fetchAuctions = TryCatch(async (req, res, next) => {
    try 
    {
        const auctions = await Auction.find();
    
        const updates = auctions.map(async (auction) => {
          if (new Date(auction.endingTime) < new Date() && auction.ended === 1) {
            auction.ended = 2;
            // await auction.save();
          }
          return auction;
        });
    
        const updated_auctions = await Promise.all(updates);

        const unended_active_auctions = updated_auctions.filter(
            auction => new Date(auction.startingTime) <= new Date() && (auction.ended === 1)
        );

        // const unended_auctions = updated_auctions.filter(auction => (auction.ended === 1));
        res.json(unended_active_auctions);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});

// fetch all auctions.
export const getAuction = TryCatch(async (req, res, next) => {
    // console.log("here")
    try 
    {
        const auction = await Auction.findById(req.params.id);
        if (!auction) 
        {
            return res.status(404).send({ message: 'auction not found' });
        }
        res.json(auction);
    } 
    catch (error) 
    {
        res.status(500).send({ message: 'server error', error: error.toString() });
    }
});

