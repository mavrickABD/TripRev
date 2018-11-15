var mongoose= require("mongoose");


var campgroundSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	price:String,
	location:String,
	lat:Number,
	lng:Number,
	rating:{ type:Number , default:0 },
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comment"
		}
	]
});

module.exports=mongoose.model("Campground",campgroundSchema);
