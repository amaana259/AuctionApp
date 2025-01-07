import mongoose from 'mongoose';

// schema of the users.
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required."],
    unique: [true, "this username is already taken."]
  },
  password: {
    type: String,
    required: [true, "password is required."],
  },
  numberOfItemsOwned: {
    type: Number,
    default: 0
  },
  createdAuctions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  }]
});

export const User = mongoose.model("User",UserSchema);

export default User;