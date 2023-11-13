const User = require("../models/User");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/customError");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// CREATE a new user
const createUser = asyncWrapper(async (req, res) => {
    const newUser = new User ({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
        ).toString(),
      branchPlacement: req.body.branchPlacement,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ savedUser });
  });

  // LOGIN user
  const loginUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username});
    if (!user) {
        return next(createCustomError("Wrong Crendentials", 401));
      }
    
    const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
    if(originalPassword !== req.body.password){
        return next(createCustomError("Wrong Credentials", 401));
    }


    //Assigning token to users
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role,
        branchPlacement: user.branchPlacement
    }, 
    process.env.JWT_SEC,
    {expiresIn: "3d"}
    );
    //decouple data inorder to send other user details except password
    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});

  });


  module.exports = {
    createUser,
    loginUser,
  };