var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user.js"),
    Campground = require("../models/campgrounds"),
    middle	   = require("../middleware")

router.get("/user/:id",middle.isLoggedIn,function(req,res){
    User.findById(req.params.id).populate("campgrounds").exec(function(err,user){
        if(err){
            console.log(err)
            req.flash("error","user not found")
            res.redirect("/campground")
        }else{
            res.render("user/show",{user:user})
        }
    })
})

router.post("/campground/:id/user/:user_id",middle.isLoggedIn,middle.isAddeedInList,function(req,res){
    User.findById(req.params.user_id,function(err,user){
        if(err){
            res.redirect("/campground/"+req.params.id)
        }else{
            Campground.findById(req.params.id,function(err,campground){
                if(err){
                    console.log(err)
                    res.redirect("/campground/"+req.params.id)
                }else{
                    user.campgrounds.push(campground._id)
                    user.save()
                    req.flash("success","added to visit list!!")
                    res.redirect("/campground/"+req.params.id)
                }
            })
        }
    })
})

module.exports = router 