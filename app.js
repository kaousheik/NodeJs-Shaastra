const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.status(200).json({
    message: "Hello Everyone. Welcome to Shaastra 2020"
  });
});

module.exports = app;
