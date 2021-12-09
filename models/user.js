const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userregister",{
    useNewUrlParser:true,
}).then(()=>{
    console.log('connection succesful');
}).catch((err)=>{
    console.log(err); 
});//connect function returns a promise
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    phone:Number,
    }) ;
UserSchema.plugin(passportLocalMongoose);
const register=new mongoose.model("data",UserSchema);
module.exports=register
