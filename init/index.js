const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/Listing.js");
const user=require("../models/user.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{console.log("connection succesfuly")}).catch((err)=>{
    console.log(err);
})
const initDB=async ()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:"657876a80e2707f5bfec045c"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
};
initDB();
