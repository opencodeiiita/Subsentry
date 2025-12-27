const mongoose = require("mongoose");

const mongoConnect = async (URI) => {
  return await mongoose.connect(URI);
};

module.exports = mongoConnect;
