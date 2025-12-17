const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "Email already Exists Please Try again with different one",
      });
    const checkUserName = await User.findOne({ userName });
    if (checkUserName)
      return res.json({
        success: false,
        message: "Username already Exists Please Try again with different one",
      });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration Sucessful back",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error Ocuured",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User not Found register",
      });
    }
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password! Please try Again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in Sucessfully",
        user: {
          email: checkUser.email,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured during login",
    });
  }
};

const authMiddleware=async(req,res,next)=>{
  const token =req.cookies.token
  if(!token){
    res.status(400).json({
      success:false,  
      message:"Unauthorised Used"
    })
  }

   try {
      const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Unauthorised User!",
      });
    }
}

module.exports = { registerUser, loginUser ,authMiddleware};
