const User = require("../models/userModel");

const loadRegister= async(req,res)=>{
    try {
        res.send("registration")
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadRegister
}