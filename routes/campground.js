var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campgrounds.js"),
  Comment = require("../models/comments.js"),
  middle = require("../middleware"),
  NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

router.get("/campground", function(req, res) {
  Campground.find({}, function(err, allCGs) {
    if (err) {
      console.log(err);
    } else {
      res.render("campground/index", { campgrounds: allCGs });
    }
  });
});
router.post("/campground", middle.isLoggedIn, middle.isAdmin, function(
  req,
  res
) {
  var name = req.body.campname;
  var image = req.body.imageurl;
  var desc = req.body.description;
  var price = req.body.price;

  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {
      name: name,
      image: image,
      description: desc,
      price: price,
      location: location,
      lat: lat,
      lng: lng
    };
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        res.redirect("/campground");
      }
    });
  });
});
router.get("/campground/new", middle.isLoggedIn, middle.isAdmin, function(
  req,
  res
) {
  res.render("campground/new");
});

router.get("/campground/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campground/show", { camp: campground });
      }
    });
});

router.get("/campground/:id/edit", middle.isLoggedIn, middle.isAdmin, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, camp) {
    res.render("campground/edit", { camp: camp });
  });
});

router.put("/campground/:id", middle.isLoggedIn, middle.isAdmin, function(
  req,
  res
) {
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    req.body.camp.lat = data[0].latitude;
    req.body.camp.lng = data[0].longitude;
    req.body.camp.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(
      err,
      campground
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated!");
        res.redirect("/campground/" + campground._id);
      }
    });
  });
});

router.delete("/campground/:id", middle.isLoggedIn, middle.isAdmin, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      res.redirect("/campground");
    } else {
      // deletes all comments associated with the campground
      Comment.remove({ _id: { $in: campground.comments } }, function(err) {
        if (err) {
          console.log(err);
          return res.redirect("/campground");
        }
        campground.remove();
        req.flash("success", "Hotel deleted successfully!");
        res.redirect("/campground");
      });
    }
  });
});

module.exports = router;
