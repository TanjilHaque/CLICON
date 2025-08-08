const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Database connected on hostId, ", db.connection.host);
  } catch (err) {
    console.log("Error from dbConnection: ", err);
  }
};
