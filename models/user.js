var mongoose 			  = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	firstName:String,
	lastName:String,
	avatar:{ type:String , default:"/assests/default_avatar.png"},
	campgrounds:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Campground"
	}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user",userSchema);