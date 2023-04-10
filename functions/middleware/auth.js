const jwt = require("jsonwebtoken");
require("dotenv").config;
const { client } = require("../util/client.js");

const secret = process.env.SECRET;

// this is is middleware for everytime the server is called to make sure that the client thats requesting this server is allowed to with the apikey that its sending from headers. its called in api.js like this `app.use(apiAuth);`
const apiAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers.apikey;
    if (apiKey === process.env.NEXT_PUBLIC_API_KEY) {
      next();
    } else {
      throw new Error("Not registered client!");
    }
  } catch (error) {
    console.log({ message: "Client not registered, apiAuth issue" });
  }
};

// this is a middleware http-only cookie refresher but still implementing a way to refresh it hourly
// const refreshAuthCookie = async (req, res, next) => {
//   const oldCookie = await req.cookies.userInfo;
//   if (oldCookie) {
//     const decodedData = await jwt.verify(oldCookie, secret);
//     const userId = decodedData.userId;
//     const email = decodedData.email;
//     const name = decodedData.name;

//     await res.cookie("userInfo", "", { maxAge: 0 });

//     const token = jwt.sign(
//       { userId: userId, email: email, name: name },
//       secret
//     );
//     console.log(token);
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       sameSite: "strict",
//     };
//     await res.cookie("userInfo", token, cookieOptions);
//   }

//   next();
// };

// initially get user's auth info
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData = jwt.decode(token);
    req.userAuth = await {
      userId: decodedData.sub,
      email: decodedData.email,
      name: decodedData.name,
      picture: decodedData.picture,
    };
    // create cart and user here
    const carts = await client.fetch(
      `*[_type == "carts" && userId == $userId]`,
      { userId: decodedData.sub }
    );

    if (carts.length === 0) {
      client.create({
        _type: "carts",
        email: decodedData.email,
        userId: decodedData.sub,
      });
    }

    if (req.userAuth) {
      next();
    } else {
      throw new Error("req.userAuth was not truthy");
    }
  } catch (error) {
    console.log({ message: "Could not get user info, auth issue" });
  }
};

// send the cookie back to the client
// i will want to refresh this token everytime the user visits the website probably
const createCookie = async (req, res, next) => {
  try {
    if (req.userAuth) {
      const { userId, email, name } = req.userAuth;
      const token = jwt.sign(
        { userId: userId, email: email, name: name },
        secret
      );
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: "strict",
      };
      await res.cookie("userInfo", token, cookieOptions);
      next();
    } else {
      throw new Error("req.userAuth was not truthy");
    }
  } catch (error) {
    console.log({ message: "createCookie issue" });
  }
};

// authenticates subsequent requests from specific cookieId
const authCookie = async (req, res, next) => {
  try {
    const token = req.cookies.userInfo;

    const decodedData = await jwt.verify(token, secret);
    req.userInfo = {
      userId: decodedData.userId,
      email: decodedData.email,
      name: decodedData.name,
    };
    // retrieve cart here
    next();
  } catch (error) {
    console.log({ message: "I failed at authCookie" });
    return res.sendStatus(404);
  }
};

module.exports = { auth, createCookie, authCookie, apiAuth };
