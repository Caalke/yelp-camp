var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment    = require("../models/comments"),
    middleware = require("../middleware");


//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);

        }else{
            res.render("comments/new",{campground: campground});
        };
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                    req.flash("error", "Something went wrong");
                }else{
                    req.flash("success", "Comment added!");
                    // add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    
                    return res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
     });
});
// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
            }
        });
    })
});
// comment update
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
            console.log(err)
        }else{
            res.redirect("/campgrounds/"+req.params.id);
            console.log("hhhh")
        }
        });
     });

    //  comment delete
    router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
            if (err){
                res.redirect("back");
            }else{
                req.flash("success", "Comment removed!");
                res.redirect("/campgrounds/" +req.params.id);
            }
        });
        });




module.exports = router;