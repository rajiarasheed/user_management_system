const nodemailer=require('nodemailer');
const config=require('../config/config');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword
    }
});

// Generic function to send email
const sendMail= async (to, subject, html) => {
    try {
        const mailOptions={from:config.emailUser,to,subject,html}
        transporter.sendMail(mailOptions,(error,info)=>{
            if (error) {
                console.log(error);
                
            } else {
                console.log("Email sent:",info.response);
                
            }
        })
        
    } catch (error) {
        console.log(error.message);
        
    }
}

// Specific: User verification email

const sendVerifyMail =(name,email, user_id)=>{
    const html=`<p>Hi ${name}, Please click to <a href="http://localhost:3000/register/verify?id=${user_id}">Verify</a> your mail.</p>`;
    return sendMail(email, "Verify your email", html);
}

// Admin adds user → send verification link to set password
// const sendAddUserMail = (name, email, user_id) => {
//     const html = `<p>Hi ${name},</p>
//                   <p>An admin has added you to the system. Please click the link below to verify your email and set your password:</p>
//                   <a href="http://localhost:3000/register/verify?id=${user_id}">Verify & Set Password</a>`;
//     return sendMail(email, "Complete Your Registration", html);
// };

const sendAddUserMail = (name, email, password, user_id) => {
    const html = `<p>Hi ${name}, Please click to <a href="http://localhost:3000/register/verify?id=${user_id}">Verify</a> your mail.</p>
                  <p><b>Email:</b> ${email}<br><b>Password:</b> ${password}</p>`;
    return sendMail(email, "Admin added you", html);
};


// Specific: Reset password email
const sendResetPasswordMail = (name, email, token) => {
    const html = `<p>Hi ${name}, Please click to <a href="http://localhost:3000/forget-password?token=${token}">Reset</a> your password.</p>`;
    return sendMail(email, "Reset your password", html);
};

module.exports = { sendVerifyMail, sendAddUserMail, sendResetPasswordMail };