if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}



const express=require("express");

const app=express();
const Listing=require("./models/Listing.js");
const mongoose=require("mongoose");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const listingRouter=require("./router/listing.js");

const reviewRouter=require("./router/review.js");
const userRouter=require("./router/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const dburl=process.env.ATLAS_URL;
app.use(express.urlencoded({extended:true}))
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{console.log("connection succesfuly")}).catch((err)=>{
    console.log(err);
})
app.listen(8080,()=>{
    console.log("server is listening successsfully");
})

app.get("/",(req,res)=>{
    res.send("Hi,i am root");
})
const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
        touchAfter:30,
    }
})
store.on("error",()=>{
    console.log("error in mongo session",err)
})
const sessionOptions={
    store,

    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    let fakeUser=new User({
        email:"vivek@gmail.com",
        username:"varun"
    })
    let registeredUser=await User.register(fakeUser,"hello world");
    res.send(registeredUser)
});

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);


   

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangute,goa",
//         country:"india",
//     })
//     await sampleListing.save();
//         console.log("sample saved");
//         res.send("succesful testing");
   

// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
})


