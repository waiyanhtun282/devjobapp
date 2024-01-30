const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURL");
const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Mongodb Connected....");
  } catch (err) {
    console.error(err.message);

    //  Errot to failur
    process.exit(1);
  }
};

module.exports = connectDB;
