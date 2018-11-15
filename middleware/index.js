var Campground = require("../models/campgrounds"),
	Comment    = require("../models/comments"),
	User	   = require("../models/user")

var middleObj={}

middleObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
		req.flash("error","Please login first!!")
		res.redirect("/login")
	}

	
middleObj.isAdmin=function(req,res,next){
		if(req.user.username=="admin"){
			return next();
		}
		req.flash("error","You are not autherized to do that")
		res.redirect("/login");
	}


middleObj.isCommnetOwner=function(req,res,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err){
					res.render("back");
				}else{
					if(foundComment.author.id.equals(req.user._id)){
						next()
					}else{
						res.redirect("back")
					}
				}
			})
			
		}else{
			res.redirect("back")
		}
	}

middleObj.checkCommentExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.comments.some(function (comment) {
                    return comment.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/campground/"+req.params.id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "Please login first first.");
        res.redirect("/login");
    }
};

middleObj.isAddeedInList = function(req,res,next){
	User.findById(req.params.user_id,function(err,user){
		if(err){
			req.flash("error","an error occured")
			res.redirect("/campground/"+req.params.id)
		}else{
			var foundCampground = user.campgrounds.some(function(camp){
				return camp._id.equals(req.params.id)
			})
			if(foundCampground){
				req.flash("success","Already added in To visit list.")
				res.redirect("/campground/"+req.params.id)
			}
		}
	})
}

module.exports=middleObj;