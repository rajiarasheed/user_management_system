// Load variables from .env
require('dotenv').config()


module.exports={
    sessionSecret:process.env.SESSION_SECRET,
    emailUser:process.env.EMAIL_USER,
    emailPassword:process.env.EMAIL_PASSWORD,
    mongoURI:process.env.MONGODB_URI,
    port:process.env.PORT || 3000
};