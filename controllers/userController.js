const User = require("../models/userModel");

const bcrypt = require('bcrypt');
const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }
}

const loadRegister= async(req,res)=>{
    try {
        res.render("registration")
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser= async(req,res)=>{
    try{
        const spassword=await securePassword(req.body.password)
        const user= new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
        });
        const userData= await user.save();

        if(userData){
            res.render('registration',{message:"Your Registration has been successfull, Please verify your Mail..."})
        }else{
            res.render('registration',{message:"Your Registration has been successfull..."})
        }
    }catch(error){
        console.log(error.message);
        
    }
}
module.exports={
    loadRegister,
    insertUser
}