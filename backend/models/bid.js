import mongoose from 'mongoose';

// schema of the placed bids.
const BidSchema = new mongoose.Schema({
  bid_amount: {
    type: Number,
    required: [true, "bid amount is required."],
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bid_time: {
    type: Date,
    default: Date.now
  },
  winning: {
    type: Boolean,
    default: true
  }
});

export const Bid = mongoose.model("Bid", BidSchema);

export default Bid;