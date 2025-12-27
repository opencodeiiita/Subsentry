const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const mongoConnect = require("./utils/mongoConnect");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});


const MongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MongoURI) {
  throw new Error(
    "MONGO_URI is not set."
  );
}

mongoConnect(MongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT}, Click http://localhost:${PORT}`
      )
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err.message);
    process.exit(1);
  });

