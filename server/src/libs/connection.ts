import mongoose from "mongoose";
import configuration from "../config/configuration";

const Connection = () => {
    mongoose.connect(configuration.MONGO_URI).then((data)=> {
        console.log("successfully connected to database", data?.connection?.host);        
    }).catch((error)=> console.log(error.message || "Failed to connect...")
    );
};

export default Connection;
