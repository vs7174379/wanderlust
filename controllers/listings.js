const Listing = require("../models/Listing");

module.exports.index = async (req, res) => {
    allListings = await Listing.find({});
    res.render("index.ejs", { allListings })

};

module.exports.renderNewForm = (req, res) => {

    res.render("new.ejs")
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "listing you requsted for does not exist")
        res.redirect("/listings")
    }
    res.render("show.ejs", { listing })

};

module.exports.createListings = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user.id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "new listing created")
    res.redirect("/listings");

};

module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    

    if (!listing) {
        req.flash("error", "listing you requsted for does not exist")
        res.redirect("/listings")
    }
    let orignalimage=listing.image.url;
    orignalimage=orignalimage.replace("/upload","/upload/h_200,w_150")



    res.render("edit.ejs", { listing,orignalimage });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing")
    }

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);

};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting)
    req.flash("success", "listing deleted")
    res.redirect("/listings")

}