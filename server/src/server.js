import dotenv from "dotenv"
dotenv.config({path : "./.env",quiet:true})
import connectDB from "./db/index.js";

import { app } from "./index.js";



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 7000, () => {
            console.log(`server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO_connection failed", err);
    })