import mongoose from 'mongoose';

// schema of the auctions.
const AuctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required."],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
  startingPrice: {
    type: Number,
    required: [true, "starting price is required."],
    default: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  startingTime: {
    type: Date,
    default: Date.now
  },
  endingTime: {
    type: Date,
    required: [true, "ending time is required."],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ended: {
    type: Number,
    default: 1                            // 1 => Not Started/In Progress, 2 => Sold, 3 => Unsold.
  }
});

export const Auction = mongoose.model("Auction", AuctionSchema);

export default Auction;