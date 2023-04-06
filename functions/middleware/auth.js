const jwt = require("jsonwebtoken");
require("dotenv").config;

const secret = process.env.SECRET;

// initially get user's auth info
const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    let decodedData = jwt.decode(token);
    req.userAuth = {
      userId: decodedData.sub,
      email: decodedData.email,
      name: decodedData.name,
    };

    next();
  } catch (error) {
    console.log(error);
  }
};

// send the cookie back to the client
// i will want to refresh this token everytime the user visits the website probably
const createCookie = async (req, res, next) => {
  if (req.userAuth) {
    const { userId, email, name } = req.userAuth;
    const token = jwt.sign(
      { userId: userId, email: email, name: name },
      secret
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
    };
    await res.cookie("userInfo", token, cookieOptions);
  }
  next();
};

// authenticates subsequent requests from specific cookieId
const authCookie = async (req, res, next) => {
  try {
    const token = await req?.cookies?.userInfo;
    const decodedData = await jwt.verify(token, secret);
    console.log(decodedData);
  } catch (error) {
    console.log(error);
  }
  next();
};

module.exports = { auth, createCookie, authCookie };
