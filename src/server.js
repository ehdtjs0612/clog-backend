const express = require("express");
const app = express();
const errorHandling = require("./middleware/errorHandling");

app.use(errorHandling());

module.exports = app;
