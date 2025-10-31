const mongoose= require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const express= require("express");
const app=express();

app.listen(3000,()=>console.log("Server running..."));