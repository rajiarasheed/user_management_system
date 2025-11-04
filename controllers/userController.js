const User = require("../models/userModel");

const bcrypt = require('bcrypt');
const { name } = require("ejs");

const nodemailer=require('nodemailer');

const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }
}


const sendVerifyMail=async(name,email,user_id)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,requireTLS:true,
            auth:{
                user:'rajiaabdulrasheed@gmail.com',
                pass:'asdfghjklqwertyu'
            }
        })
        const mailOptions ={
            from:'rajiaabdulrasheed@gmail.com',
            to:email,
            subject:'For verification mail',
            html:`<p>Hi,${name},Please click to <a href="http://localhost:3000/register/verify?id=${user_id}"> Verify</a> your mail.</p>`,
            // html:'<p>Hi,'+name+ ',Please click to <a href="http://localhost:3000/register/verify?id='+user_id+'"> Verify</a> your mail.</p>'
        }
      
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
                
            }else{
                console.log("Email has been send:",info.response);
                
            }
        })
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const loadRegister=async(req,res)=>{
    try {
        res.render('registration');
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
            sendVerifyMail(req.body.name,req.body.email,userData._id)
            res.render('registration',{message:"Your Registration has been successfull, Please verify your Mail..."})
        }else{
            res.render('registration',{message:"Your Registration has been failed..."})
        }
    }catch(error){
        console.log(error.message);
        
    }
}

const verifyMail= async(req,res)=>{
    try {
       const updateInfo= await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
        console.log(updateInfo);
        res.render("email-verified")
    } catch (error) {
        console.log(error.message);
        
    }
}

// Login users starts
const loginLoad = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log();
        
    }
}
const verifyLogin = async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userData=await User.findOne({email:email});
        if (userData) {
            const passMatch = await bcrypt.compare(password,userData.password);
            if (passMatch) {
                if (userData.is_verified ==0) {
                    res.render('login',{message:"Please verify your mail"})
                } else {
                    req.session.user_id=userData._id;
                    res.redirect('/home');
                }
                
            } else {
                res.render('login',{message:"Email and Password is incorrect"})
            }
        }else{
            res.render('login',{message:"Email and Password is incorrect"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const loadHome=async (req,res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome
}


