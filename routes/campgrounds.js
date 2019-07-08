var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campgrounds"),
    middleware = require("../middleware");


// index
router.get("/", function(req,res){

    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log("error");
       } else {
           res.render("campgrounds/index", {campgrounds:allCampgrounds});
       }
   });
});
// create
router.post("/", middleware.isLoggedIn,function(req,res){
    let name = req.body.name;
    let price =req.body.price;
    let image = req.body.image;
    let description =req.body.description;
    let author= {
        id:req.user._id,
        username: req.user.username
    }
    let newCampground ={name,price, image, description, author}
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);

        }else{
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        };
    })
    });
// new
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});
// show
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");

        }else{
            res.render("campgrounds/show",{campground: foundCampground});
        };
    })
   
});

// edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    }); 
});

// update campground route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    
    });
});
// Destroy camp route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
Campground.findByIdAndRemove(req.params.id, function(err){
    if (err){
        res.redirect("/campgrounds");
    }else{
        res.redirect("/campgrounds");
    }
});
});





module.exports = router;