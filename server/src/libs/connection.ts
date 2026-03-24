import mongoose from "mongoose";
import configuration from "../config/configuration";

/** Await before app.listen() so requests never hit Mongoose while still buffering (10s timeout). */
const Connection = async (): Promise<void> => {
  await mongoose.connect(configuration.MONGO_URI);
  console.log("successfully connected to database", mongoose.connection.host);
};

export default Connection;
