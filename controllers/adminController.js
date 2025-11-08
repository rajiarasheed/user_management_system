const User=require("../models/userModel");
const bcrypt= require('bcrypt');
const randomstring= require("randomstring");
const config= require('../config/config');
const nodemailer=require('nodemailer')

const securePassword= async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password,10);
        return hashPassword;
    } catch (error) {
        console.log(error.message);
        
    }
}


// send add user verification mail
const addUserMail=async(name,email,password,user_id)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })
        const mailOptions ={
            from:config.emailUser,
            to:email,
            subject:'Admin add you and verify your mail',
            html:`<p>Hi,${name},Please click to <a href="http://localhost:3000/register/verify?id=${user_id}"> Verify</a> your mail.</p>
            <br><b>Email:-</b> ${email}<br>
            <b>Password:-</b> ${password}`,
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

// for reset password mail
const sendResetPasswordMail= async (name,email,token) => {
    try {
        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })
        const mailOptions= {
            from:config.emailUser,
            to:email,
            subject:"For Rest Password",
            html:`<p>Hi ${name}, Please click to <a href="http://localhost:3000/admin/forget-password?token=${token}">Reset </a>your Password </P`
        }
        transporter.sendMail(mailOptions,function (error,info) {
            if (error) {
                console.log(error);
                
            } else {
                console.log("Email send",info.response);
                
            }
        })
    } catch (error) {
        console.log(error.message);
        
    }
}
// for load login page
const loadLogin=async (req,res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
        
    }
}

// for verify login by email and password
const verifyLogin=async (req,res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData= await User.findOne({email:email})
        if (userData) {
           passwordMatch= await bcrypt.compare(password,userData.password) 
           if (passwordMatch) {
            if (userData.is_admin === 0) {
                 res.render('login',{message:"email and password is incorrect"})
            } else {
                req.session.admin_id=userData._id;
                res.redirect("/admin/home")
            }
            
           } else {
             res.render('login',{message:"email and password is incorrect"})
           }
        } else {
            res.render('login',{message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

// load Dashboard if loggin
const loadDashboard=async (req,res) => {
    try {
        if (!req.session.admin_id) {
            // If not logged in as admin
            return res.redirect("/admin");
        }
        const userData=await User.findById({_id:req.session.admin_id})
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message);
        
    }
}

// for logout
const logout=async (req,res) => {
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
        
    }
}

// load forget page
const loadForget= async (req,res) => {
    try {
        res.render('forget')
    } catch (error) {
        console.log(error.message);
        
    }
}

// for verify email if forget password
const forgetVerify= async (req,res) => {
    try {
        const email= req.body.email;
        const userData= await User.findOne({email:email});
        if (userData) {
            if (userData.is_admin ===0) {
                res.render("forget",{message:"Email is incorrect"})
            } else {
               const randomString = randomstring.generate();
               const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
               sendResetPasswordMail(userData.name,userData.email,randomString);
                res.render('forget',{message:"Please check your mail to reset password."})
            }
        } else {
            res.render("forget",{message:"Email is incorrect"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
const loadForgetPassword = async (req, res) => {
    try {
        const token = req.query.token;  // always declare variables
        
        
        const tokenData = await User.findOne({ token: token });
        
        

        if (tokenData) {
            // Token exists → show reset form
            res.render('forget-password', { admin_id: tokenData._id });
        } else {
            // Token invalid or expired → show a message or 404 page
            res.render('404', { message: "Invalid or expired token" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
};
const resetPassword=async (req,res) => {
    try {
        const password= req.body.password;
        const admin_id= req.body.admin_id;
        const spassword= await securePassword(password)
        const userData = await User.findByIdAndUpdate({_id:admin_id},{$set:{password:spassword,token:""}})
        res.redirect("/admin")
    } catch (error) {
        console.log(error.message);
        
    }
}
const adminDashboard= async (req,res) => {
    try {
        const usersData= await User.find({is_admin:0})
        res.render('dashboard',{users:usersData})
    } catch (error) {
        console.log(error.message);
        
    }
}
const loadNewUser=async (req,res) => {
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
        
    }
}



const addNewUser= async(req,res)=>{
    try{
        const password=randomstring.generate(8)
        const spassword=await securePassword(password)
        // const spassword=await securePassword(req.body.password)
        const user= new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin:0
        });
        const userData= await user.save();

        if(userData){
            
            
            addUserMail(userData.name,userData.email,password,userData._id)
            // sendVerifyMail(req.body.name,req.body.email,userData._id)
            res.redirect('/admin/dashboard')
        }else{
            
            res.render('new-user',{message:"Something wrong..."})
        }
    }catch(error){
        console.log(error.message);
        
    }
}


module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    loadForget,
    forgetVerify,
    loadForgetPassword,
    resetPassword,
    adminDashboard,
    loadNewUser,
    addNewUser
}