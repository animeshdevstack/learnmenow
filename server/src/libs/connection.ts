import mongoose from "mongoose";
import configuration from "../config/configuration";

/**
 * Atlas + Render can be slow (cold start, Wi‑Fi, cross-region). Defaults are often too tight
 * and surface as `Connection timeout` / server selection errors under load.
 */
const Connection = async (): Promise<void> => {
  mongoose.set("bufferTimeoutMS", 60_000);
  await mongoose.connect(configuration.MONGO_URI, {
    serverSelectionTimeoutMS: 60_000,
    connectTimeoutMS: 30_000,
    socketTimeoutMS: 120_000,
    maxPoolSize: 10,
  });
  console.log("successfully connected to database", mongoose.connection.host);
};

export default Connection;
