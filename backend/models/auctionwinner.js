import mongoose from 'mongoose';

// schema of the auctions.
const AuctionWinnerSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  }
});

export const AuctionWinner = mongoose.model("AuctionWinner", AuctionWinnerSchema);

export default AuctionWinner;