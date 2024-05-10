const Listing=require("../models/Listing");
const Review=require("../models/reviews");

module.exports.createPost=async (req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.Review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","new review created")
   
    res.redirect(`/listings/${listing._id}`)

};

module.exports.deletePost=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`);

        
        
};
