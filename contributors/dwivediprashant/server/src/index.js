require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
//db connection establish
connectDB();
//--------------------

//routes------------------------
//--root route :----------
app.get("/", (req, res) => {
  res.send("Hello i am root route");
});
//---listen function
app.listen(port, (req, res) => {
  console.log(`Server running at ${port}`);
});
