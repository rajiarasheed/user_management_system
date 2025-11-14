const express=require("express")
const admin_route = express.Router();

const session=require('express-session');
const config=require("../config/config");
const auth=require('../middleware/adminAuth');
const upload=require('../middleware/upload')
const adminController=require("../controllers/adminController")
const bodyParser=require('body-parser');

// for session
admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

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
admin_route.get('/edit-user',auth.isLogin,adminController.loadEditUser);
admin_route.post('/edit-user',adminController.updateUsers);
admin_route.get('/delete-user',auth.isLogin,adminController.deleteUser);
admin_route.get('/admin/test-error',adminController.testError)


module.exports=admin_route;