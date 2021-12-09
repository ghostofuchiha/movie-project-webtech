const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");
      path=require("path");
      hbs=require("hbs");
      
   

app.use(express.json());
app.use(express.urlencoded({extended:false}));
const template_path=path.join(__dirname,"../moviec/views");
app.use(express.static("public"));    
const static_path=path.join(__dirname,"../public");
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

passport.serializeUser(User.serializeUser());       //session is encoding
passport.deserializeUser(User.deserializeUser());   //session is decoding
passport.use(new LocalStrategy(User.authenticate()));

app.use(express.urlencoded(
      { extended:true }
))

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req,res) =>{
    res.sendFile(__dirname+'/views/MainPage.html');
    // res.render("new");
})


//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/userprofile",
    failureRedirect:"/login"
}),function (req, res){

});

app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/userprofile",(req,res)=>{
    res.sendFile(__dirname+'/views/MainPageafterlogin.html');
});

app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,phone:req.body.phone}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            // res.show("Invalid username or password")
            // req.flash("error_msg", "Invalid username or password");
            // res.locals.messgae=req.flash();
            res.redirect("login");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//start servers session
app.listen(process.env.PORT ||4000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 4000");
    }
      
});