var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var ejs = require("ejs");


app.set("view engine","ejs");

app.use(express.json());



// var request = require(request);

// app.post("/test",function(req,res){
//     request("loclhost:3000/test",function(err,res,body){
//         if(!err){
//            console.log(body);
//         }
//     })
// })

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/serve', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({
   extended: true
}));


var userSchema = {
    username: String,
    servicesTaken: String
}

var newSchema = {
        username: String,
        servicesTaken: [String],
        address: String,
        type: String
}
var newSchemas = {
    servicesTaken: [{services:String}],
    address: String
}

var user = mongoose.model("user",userSchema);


var newUser = mongoose.model("nuser",newSchema);

var newUsers = mongoose.model("auser",newSchemas);


app.get("/user",function(err,res){
   newUser.find(function(err,docs){
      if(!err){
          //res.json(res);
          res.send(docs);
      }
      else{
          res.send(err);
      }
   })
});


app.get("/user/:username",function(req,res){
    newUser.findOne({username: req.params.username},function(err,article){
         if(article){
              res.send(article);
         }
         else{
             console.log("The article was not found")
         }
    })
})

app.delete("/user",function(req,res){
    user.deleteMany(function(err){
        if(!err){
            res.send("Sucessfully deleted all usesrs")
        }
        else{
            res.send(err);
        }
    })
})




app.post("/user",function(req,res){
    console.log(req.body.username);
    console.log(req.body.servicesTaken);
    console.log(req.body.address);
    console.log(req.body.type);

    // var newUser = new user({
    //     username: req.body.username,
    //     servicesTaken: req.body.servicesTaken
    // });

    var khatraUser = new newUser({
        username: req.body.username,
        servicesTaken: req.body.servicesTaken,
        address: req.body.address,
        type: req.body.type
    })

    khatraUser.save();  
    
    //JSON.stringify(newUser.save());
    console.log(req.body);
});


app.put("/user/:username",function(req,res){

    var service = req.body.service;
    var username = req.body.username; 
   
  // user.findOneAndUpdate({username:req.params.username},{servicesTaken:req.body.service}) 
  user.findOneAndUpdate({username: username}, {$set:{servicesTaken:service}}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }
    console.log(doc);       
    })
})


app.delete("/user",function(req,res){
    newUser.deleteOne({username: req.params.username} ,function(err){
        if(!err){
            res.send("Sucessfully deleted user")
        }
        else{
            res.send(err);
        }
    })
})


app.get("/push",function(req,res){
//     db.findOneAndUpdate({'Searching criteria goes here'},
// {
//  $push : {
//     trk :  {
//              "lat": 50.3293714,
//              "lng": 6.9389939

//            } //inserted data is the object to be inserted 
//   }
// });

// user.findOneAndUpdate({username: "adam"}, {$set:{servicesTaken:service}}, {new: true}, (err, doc) => {
//     if (err) {
//         console.log("Something wrong when updating data!");
//     }
//     console.log(doc);       
//     })
// user.findOneAndUpdate({username: "adam"}, {
//     $push : {
//        servicesTaken :  'kjhkjh'
                   
         //inserted data is the object to be inserted 
     //}
     newUser.servicesTaken.push("skldjflsdkjflskdjf");
})   

app.post("/yaya",function(req,res){
    // var khatraUser2 = new newUsers({
    //     servicesTaken: {services:"abc"},
    //     type: "deffffff"
    // })  
    // khatraUser2.save();

       newUsers.update({type: "deffffff"}, {$push: {servicesTaken: {services:"apple"}}});
    //db.people.update({servicesTaken: "sd"}, {$push: {friends: {firstName: "Harry", lastName: "Potter"}}});
});


























app.listen(3000,function(){
    console.log("Server has started");
})