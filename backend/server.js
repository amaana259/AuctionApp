import { Socket, Server } from "socket.io";
import http from "http";
// import { app } from "./app.js";
import { config } from "dotenv";

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// import bcrypt from "bcrypt";

dotenv.config()

import userRoute from './routes/user.js';
import auctionRoute from './routes/auction.js';
import User from './models/user.js';
import Auction from './models/auction.js';
import Bid from './models/bid.js';
import AuctionWinners from './models/auctionwinner.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try 
{
  mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Database");
}
catch (err) 
{
  console.log(err);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

config({
  path: "./config.env",
});

const client_mapping = new Map();

io.on("connection", (socket) => {
  const clientID = socket.handshake.query.clientId;
  if (client_mapping.has(clientID)) 
  {
      // console.log(`reconnecting client: ${clientID}`);
      let client_data = client_mapping.get(clientID);
      client_data.socketID = socket.id;
      client_mapping.set(clientID, client_data);
  } 
  else 
  {
      // console.log(`new client connected: ${clientID}`);
      client_mapping.set(clientID, { socketID: socket.id });
  }

  socket.on('joinRoom', (auctionID) => {
    socket.join(auctionID);
    // console.log(`user ${socket.id} joined auction: ${auctionID}`);
  });

  socket.on('placeBid', async ({ auctionID, bid, userID }) => {
    try 
    {
        let auction = await Auction.findById(auctionID);
        let bid_handled = false;

        // first bid handling, caters for bids equal to starting price.
        if ((auction.currentPrice === auction.startingPrice) && (bid >= auction.currentPrice) && (userID !== auction.creator.toString()) && (bid_handled === false))
        {
            await Bid.updateMany({ auction: auctionID, winning: true }, { winning: false });
            const winning_bid = new Bid({
              bid_amount: bid,
              auction: auctionID,
              bidder: userID,
              bid_time: new Date(),
              winning: true
            });
            
            await winning_bid.save();

            auction.currentPrice = bid;
            await auction.save();

            bid_handled = true;

            // io.to(auctionID).emit('updateCurrentPrice', { new_curr_price: bid });
            io.to(auctionID).emit('updateCurrentPrice', bid);
        }

        // handling of any subsequent bids.
        else if ((bid > auction.currentPrice) && (userID !== auction.creator.toString()) && (bid_handled === false)) 
        {
            await Bid.updateMany({ auction: auctionID, winning: true }, { winning: false });
            const winning_bid2 = new Bid({
              bid_amount: bid,
              auction: auctionID,
              bidder: userID,
              bid_time: new Date(),
              winning: true
            });
            
            await winning_bid2.save();

            auction.currentPrice = bid;
            await auction.save();

            bid_handled = true;

            // io.to(auctionID).emit('updateCurrentPrice', { new_curr_price: bid });
            io.to(auctionID).emit('updateCurrentPrice', bid);
         } 
        else 
        {
            // socket.emit('auctionUpdate', { error: 'Auction has ended or does not exist.' });
            socket.emit('error', 'what the hell');
        }
    } 
    catch (error) 
    {
        console.error('error placing bid:', error);
        socket.to(auctionID).emit('error', 'failed to place bid');
    }
  });

  socket.on('leaveRoom', (auctionID) => {
    socket.leave(auctionID);
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected');
    client_mapping.delete(clientID);
  });
});

const checkAuctionEnd = async () => 
{
    const now = new Date();
    const ended_auctions = await Auction.find({ endingTime: { $lte: now }, ended: 1 });
    for (let auction of ended_auctions) 
    {
        auction.ended = 3;
        // await auction.save();

        const winning_bid = await Bid.find({ auction: auction._id }).sort({ bid_amount: -1 }).limit(1);

        if (winning_bid.length !== 0) 
        {
          for (let winning_bid1 of winning_bid)
          {
              auction.ended = 2;
              await auction.save();
              const winning_user = await User.findById(winning_bid1.bidder);

              winning_user.numberOfItemsOwned += 1;
              await winning_user.save();

              const winner = winning_user.username;
              // console.log(winning_bid1)
              const new_winner = new AuctionWinners({ auctionID: auction._id, userID: winning_bid1.bidder });
              await new_winner.save();

              io.to(auction._id.toString()).emit('auctionEnded', { winnerName: winner, finalPrice: winning_bid1.bid_amount });
          }
        }
        else
        {
            // console.log("auction ended without winner.")
            await auction.save();
            io.to(auction._id.toString()).emit('auctionEnded', { winnerName: 'No Winner', finalPrice: 0 });
        }
    }
};

const stop_checking_end = setInterval(async () => { await checkAuctionEnd() }, 60000);

process.on('exit', () => {
    clearInterval(stop_checking_end);
    // console.log('checking stopped because the server shut down.');
});

// setInterval(async () => { await checkAuctionEnd()}, 60000);

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// User api routing
app.use("/api/user", userRoute);

// Auction api routing
app.use("/api/auction", auctionRoute);
