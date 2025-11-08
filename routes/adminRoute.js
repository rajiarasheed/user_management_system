const express=require("express")
const admin_route= express();

const session=require('express-session');
const config=require("../config/config");
admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');
const auth=require('../middleware/adminAuth');

const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'))
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));

    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload= multer({storage:storage})
const adminController=require("../controllers/adminController")

const bodyParser=require('body-parser');
admin_route.set(bodyParser.json());
admin_route.set(bodyParser.urlencoded({extended:true}));

admin_route.get('/',auth.isLogout, adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard)
admin_route.get('/logout',auth.isLogin,adminController.logout);
admin_route.get('/forget',auth.isLogout,adminController.loadForget);
admin_route.post('/forget',adminController.forgetVerify);
admin_route.get('/forget-password',auth.isLogout,adminController.loadForgetPassword);
admin_route.post('/forget-password',adminController.resetPassword);
admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);
admin_route.get('/new-user',auth.isLogin,adminController.loadNewUser);
admin_route.post('/new-user',auth.isLogin,upload.single('image'),adminController.addNewUser);

// 404 handler
admin_route.use((req, res) => {
    res.status(404).render('404');
});
module.exports=admin_route;