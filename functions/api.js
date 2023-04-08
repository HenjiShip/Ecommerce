// https://youtu.be/q1TrsvKdpcU
const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config;

const { apiAuth } = require("./middleware/auth.js");
const userRoutes = require("./routes/user.js");
const app = express();
const netBaseUrl = "/.netlify/functions/api";

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(apiAuth);  
// call middleware without the () as to not invoke it or next() will not be a function 
app.use(`${netBaseUrl}/users`, userRoutes);  
module.exports.handler = serverless(app);
// gotta install serverless-http for this to work with express

// the code in here uses commonJS so i have to export and import everything with require and export with module.exports
// with that, these serverless functions should work similarly to a regular server running express