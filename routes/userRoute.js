const express = require("express");
const user_route = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(express.static("public"));

user_route.get("/register", auth.isLogout, userController.loadRegister);
user_route.post("/register", upload.single("image"), userController.insertUser);
user_route.get("/register/verify", userController.verifyMail);

user_route.get("/", auth.isLogout, userController.loginLoad);
user_route.get("/login", auth.isLogout, userController.loginLoad);
user_route.post("/login", auth.isLogout, userController.verifyLogin);

user_route.get("/home", auth.isLogin, userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout);

user_route.get("/forget", auth.isLogout, userController.loadForget);
user_route.post("/forget", userController.forgetVerify);

user_route.get("/forget-password", auth.isLogout, userController.loadForgetPassword);
user_route.post("/forget-password", userController.resetPassword);

user_route.get("/verification", userController.loadVerification);
user_route.post("/verification", userController.sendVerificationLink);

user_route.get("/edit", auth.isLogin, userController.loadEdit);
user_route.post("/edit", upload.single("image"), userController.updateProfile);

module.exports = user_route;
