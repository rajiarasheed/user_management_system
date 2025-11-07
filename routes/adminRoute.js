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

const adminController=require("../controllers/adminController")

const bodyParser=require('body-parser');
admin_route.set(bodyParser.json());
admin_route.set(bodyParser.urlencoded({extended:true}));

admin_route.get('/',auth.isLogout, adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard)
admin_route.get('/logout',auth.isLogin,adminController.logout)

// 404 handler
admin_route.use((req, res) => {
    res.status(404).render('404');
});
module.exports=admin_route;