require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const redisClient = require("../config/database/redis");

const accountApi = require("./routes/account");
const authApi = require("./routes/auth");
const uploadApi = require("./routes/upload");
const clubApi = require("./routes/club");
const notificationApi = require("./routes/notification");

const boardApi = require("./routes/board");
const general = require("./routes/general");
const promotion = require("./routes/promotion");
const notice = require("./routes/notice/index");

const errorHandling = require("./middleware/errorHandling");

// connect redis client
// redisClient.connect();

// global middleware
app.use(express.json());
app.use(cookieParser());

// api call middleware
app.use("/account", accountApi);
app.use("/auth", authApi);
// app.use("/upload", uploadApi);
app.use("/club", clubApi);
app.use("/notification", notificationApi);
app.use("/board", boardApi);

app.use("/general", general);
app.use("/notice", notice);
app.use("/promotion", promotion);

// error handling muddleware
app.use(errorHandling());

module.exports = app;
