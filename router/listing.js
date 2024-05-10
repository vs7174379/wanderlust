const mongoose=require("mongoose");
const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Listing=require("../models/Listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {cloudinary,storage}=require("../cloudconfig.js");
const upload = multer({ storage })


router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListings));


router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListings));



module.exports=router;