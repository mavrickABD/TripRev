var express    = require("express"),
	router     = express.Router(),
	User       = require("../models/user.js"),
	passport   = require("passport");


router.get("/",function(req,res){
	res.render("landing");
})


router.get("/signup",function(req,res){
	res.render("auth/signup");
})

router.post("/signup",function(req,res){
	if(req.body.password.length < 6){
		req.flash("error","The password should atleast be 6 characters long.");
		return res.redirect("/signup");
	}
	
	var user ={
		username : req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		avatar: req.body.avatar
	}

	User.register(user,req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message)
			return res.redirect("/signup");
		}passport.authenticate("local")(req,res,function(){
			req.flash("success","You are successfully signed up !!")
			res.redirect("/campground")
		})
	})
})

router.get("/login",function(req,res){
	res.render("auth/login");
})

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campground",
	failureRedirect:"/login",
	failureFlash: true,
    successFlash: true
}),function(){})

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You are successfully logged out");
	res.redirect("/campground");
})


module.exports = router;