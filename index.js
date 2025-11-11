const mongoose= require("mongoose");
const express= require("express");
const config=require('./config/config');
mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB connection error:", err));

const app=express();

// for user routes
const userRoute=require("./routes/userRoute");
app.use("/",userRoute);

// for admin routes
const adminRoute=require("./routes/adminRoute");
app.use("/admin",adminRoute);


app.listen(config.port,()=>console.log("Server running..."));