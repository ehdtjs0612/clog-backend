require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const redisClient = require("../config/database/redis");

const accountApi = require("./routes/account");
const authApi = require("./routes/auth");
const errorHandling = require("./middleware/errorHandling");

redisClient.connect();

app.use(express.json());
app.use(cookieParser());

app.use("/account", accountApi);
app.use("/auth", authApi);

app.use(errorHandling());

module.exports = app;
