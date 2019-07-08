const express       = require("express"),
      app           = express(),
      bodyparser    = require("body-parser"),
      flash         = require("connect-flash"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStratedy = require("passport-local"),    
      User          = require("./models/user"),
      Campground    = require("./models/campgrounds.js"),
      Comment       = require("./models/comments.js"),
      seedDB        = require("./seeds"),
      methodOverride= require("method-override")

// requiring routes
const commentRoutes    = require("./routes/comments.js"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index")



    //   seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v12",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passpot config
app.use(require("express-session")({
    secret:"I hate camping in the cold",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratedy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function(req,res){
    console.log("Yelp Camp server started");
});