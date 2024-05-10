const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview}=require("../middleware.js")
const Listing=require("../models/Listing.js");
const Review=require("../models/reviews.js");
const {isLoggedIn,isOwner,validateListing,isReviewAuthor}=require("../middleware.js");
const Reviewcontroller=require("../controllers/reviews.js")



router.post("/",isLoggedIn,validateReview,wrapAsync(Reviewcontroller.createPost));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(Reviewcontroller.deletePost))

module.exports=router;
