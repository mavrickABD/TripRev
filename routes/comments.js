var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campgrounds.js"),
	Comment    = require("../models/comments.js");
	middle	   = require("../middleware")


router.get("/campground/:id/comment/new",middle.checkCommentExistence,function(req,res){
	Campground.findById(req.params.id,function(err,camp){
		if(err){
			console.log(err)
		}else{
			res.render("comment/new",{camp:camp})
		}
	})
})

router.post("/campground/:id/comment",middle.checkCommentExistence,function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
		if(err){
			console.log(err);
			res.redirect("/campground")
		}else{
			Comment.create({content:req.body.content,review:req.body.review},function(err,newComment){
				newComment.author.id=req.user._id;
				newComment.author.name=req.user.username;
				newComment.save();
				camp.comments.push(newComment);
				camp.rating=calculateAverage(camp.comments)
				camp.save();
				req.flash("success", "Your review has been successfully added.");
				res.redirect("/campground/"+req.params.id)
			})
		}
	})
})

router.get("/campground/:id/comment/:comment_id/edit",middle.isCommnetOwner,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if (err) {
			console.log(err)
			res.redirect("/campground"+req.params.id)
		}else{res.render("comment/edit",{camp:req.params.id , comments:foundComment})}
		
	})
})

router.put("/campground/:id/comment/:comment_id",middle.isCommnetOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,{content:req.body.content,review:req.body.review},{new: true},function(err,comment){
		if(err){
			console.log(err)
			res.redirect("/campground/"+req.params.id)
		}
		else{
			Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
				campground.rating=calculateAverage(campground.comments);
				campground.save();
				req.flash("success", "Your review has been successfully updated.");
				res.redirect("/campground/"+req.params.id)
			})
			
		}
	})
})

router.delete("/campground/:id/comment/:comment_id",middle.isCommnetOwner,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		if(err){
			res.redirect("/campground/"+req.params.id)
		}else{
			Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("comments").exec(function(err,campground){
				campground.rating=calculateAverage(campground.comments);
				campground.save();
				req.flash("success", "Your review has been successfully deleted.");
				res.redirect("/campground/"+req.params.id)
			})
			
		}
	})
})

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.review;
    });
    return sum/reviews.length;
}


module.exports = router;