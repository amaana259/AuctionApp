import User from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import bcrypt from "bcrypt";

// user signup.
export const newUser = TryCatch(async (req, res, next) => {
    // console.log("signup received")
    const { username, password } = req.body;
    try {
        if (!username || !password)
        {
            return res.status(400).json({ message: 'all fields are required.'});
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) 
        {
            return res.status(400).json({ message: "username already taken." });
        }
    
        const passwordReg = /^.{8,}$/;
        if (!passwordReg.test(password)) 
        {
            return res.status(400).json({message: "password must be at least 8 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = new User({ username:username, password: hashedPassword});

        await newUser.save();
    
        res.status(201).json({ message: "signup successful." });
      } catch (err) {
        res.status(500).json({ message: "signup failed." });
      }
});

// user login.
export const loginUser = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    // console.log("login received")
  
    try {
      const user = await User.findOne({ username });
        // console.log(user)
      if (!user) 
      {
        return res.status(400).json({ message: 'non-existent user.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
      {
        return res.status(400).json({ message: 'invalid password entered.' });
      }
  
      res.status(202).json({
        message: 'log in successful',
        userID: user._id,
      });
    } 
    catch (error)
    {
    // console.error("login error: ", error);
      res.status(500).json({ message: 'login failed.' });
    }
});

// change password.
export const changePassword = TryCatch(async (req, res, next) => {
    try {
        // console.log("pass change received");
          const { userID, password } = req.body;
      
          const user = await User.findById(userID);

          user._id = userID;
          user.username = user.username;

          const passwordReg = /^.{8,}$/;
          if (!passwordReg.test(password)) 
          {
              return res.status(400).json({message: "password must be at least 8 characters long" });
          }

          const hashedPassword = await bcrypt.hash (password, 5);
          user.password = hashedPassword;
        //   user.password = password;
      
          await user.save();
      
          res.status(200).json ({message: 'password change successful.'});
        } catch (error) {
          res.status(500).json ({message: 'password change failed.'});
        }
    }
);

// change password.
export const findUser = TryCatch(async (req, res, next) => {
    try {
        // console.log("finduser received");
          const { userID } = req.body;  
          const user = await User.findById( userID );

          if (!user) 
          {
            return res.status(400).json({ error: 'non-existent user.' });
          }
          
          res.json(user);

        } catch (error) {
          res.status (500).json({message: 'cannot find user.'});
        }
    }
);