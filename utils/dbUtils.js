const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
// Use dotenv to secure mongo connection
// const uri = process.env.MONGOBD_URI;

const connectToDb = () => {
  mongoose.connect(
    "mongodb+srv://paulmrsch:EkxMjBp5PqpYuJjW@bleaujyphies.awfgv.mongodb.net/Bleaujyphies"
  );
  const database = mongoose.connection;

  database.on("error", (error) => {
    console.error(error);
  });

  database.once("open", () => {
    console.log(
      "You successfully connected to MongoDB! The database is",
      database.name
    );
  });
};

module.exports = {
  connectToDb,
};
