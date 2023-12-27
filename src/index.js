require("dotenv").config();
const express = require("express");
const connectDB = require("./db/index.js");

const app = express();
PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port : `, process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection failed !!  `, error);
  });
