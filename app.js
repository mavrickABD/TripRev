require("dotenv").config();
var express = require("express"),
  bodyparser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campgrounds.js"),
  Comment = require("./models/comments.js"),
  passport = require("passport"),
  loaclStratagy = require("passport-local"),
  pasportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user.js"),
  campgroundRoutes = require("./routes/campground.js"),
  commentRoutes = require("./routes/comments.js"),
  indexRoutes = require("./routes/index.js"),
  userRoutes = require("./routes/user.js"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

mongoose.connect(
  "mongodb://localhost:27017/TripRev",
  { useNewUrlParser: true }
);

(app = express()), app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
mongoose.set("useFindAndModify", false);

//	PASSPORT SETUP

app.use(
  require("express-session")({
    secret: "the answer to life,universe ans everything is 42",
    resave: false,
    saveUninitialize: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new loaclStratagy(User.authenticate()));

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.use(userRoutes);

app.listen(3000, function() {
  console.log("the server has started");
});
