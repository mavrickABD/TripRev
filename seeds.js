var mongoose=require("mongoose");
var Campground=require("./models/campgrounds.js");
var Comment=require("./models/comments.js");

var data=[
	{ name:"Could Paradise",
	  image:"https://wallup.net/wp-content/uploads/2016/06/23/395272-nature-photography-landscape-camping-lake-sunset-mountains-clouds-lights-mist.jpg",
	  description:"Amazing view of the creek , and other awesome stuff!!"
	},

	{ name:"Pine Spring",
	  image:"http://www.explore-mag.com/media/image/43799.jpg",
	  description:"Amazing view of the creek , and other awesome stuff!!"
	},

	{ name:"Canyon Cross",
	  image:"https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
	  description:"Amazing view of the creek , and other awesome stuff!!"
	}
]



function seedDB(){
	Campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		/*data.forEach(function(campground){
			Campground.create(campground,function(err,camp){
				if(err){
					console.log(err);
				}else{
					Comment.create({
						author:"harry",
						content:"very nice 5 star!!"
					},function(err,comment){
						if(err){
							console.log(err)
						}else
							camp.comments.push(comment)
							console.log("created comment");
								camp.save(function(err,camp){
							if(err){
								console.log(err);
							}else{
								console.log(camp);
							}
						})

					})
				}
				
			})
		})
*/
	})
} 

module.exports=seedDB;