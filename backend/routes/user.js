import express from "express";
import { newUser, loginUser, changePassword, findUser } from "../controllers/user.js"

const app = express.Router();

// route to signup API.
app.post("/signup", newUser);

// route to login API.
app.post("/login", loginUser);

// route to changePassword API.
app.put('/changepass', changePassword);

// route to find user by ID.
app.post('/finduser', findUser);

export default app;