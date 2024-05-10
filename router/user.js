const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const {saveRedirectUrl}=require("../middleware.js")

const userController=require("../controllers/users");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:",login",failurerFlase:true}),wrapAsync(userController.login))


router.get("/logout",userController.logout)
module.exports=router;