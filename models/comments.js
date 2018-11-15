var mongoose=require("mongoose");


var commentSchema= new mongoose.Schema({
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		name:String
	},
	content:String,
	createdAt:{type:Date , default:Date.now},
	review:Number
});

module.exports=mongoose.model("Comment",commentSchema);