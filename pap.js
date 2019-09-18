var app = express();
var ejs = require("ejs");
var express = require("express");
var bodyParser = require("body-parser");


app.set("view engine", "ejs");
app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/api', {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));

var serviceSchema = {
    service: String,
}
var userSchema = {
    username: String,
    address: String,
    type: String,
    services: [serviceSchema]
}

var user = mongoose.model("user", userSchema);
var service = mongoose.model("service", serviceSchema);

// Importing the packages and setting up the databse;

app.get("/user", function (err, res) {  //Displays all the user information.
    user.find(function (err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    })
});
app.get("/user/:username", function (req, res) { // Displays the information for a specific user
    user.findOne({
        username: req.params.username
    }, function (err, article) {
        if (article) {
            res.send(article);
        } else {
            console.log("The article was not found")
        }
    })
})
app.post("/user", function (req, res) { // Adds a new user
    console.log(req.body.username);
    console.log(req.body.address);
    console.log(req.body.type);
    console.log(req.body.service);
    var newUser = new user({
        username: req.body.username,
        address: req.body.address,
        type: req.body.type
    })

    newUser.services.push({
        service: req.body.service
    })

    newUser.save();

    res.send("The user has been sucessfully added")
});

app.put("/user/addService", function (req, res) { // Adds a new service for a specific user.
    user.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            user.services.push({
                service: req.body.service
            })
        }
        user.save();
    })
    res.send("The service has been sucessfully added");
})
app.put("/user/rs", function (req, res) { // Removes a service for a specific user.
    user.findOne({
        username: req.body.username
    }, function (err, article) {
        if (!err) {
            var len = article.services;
            console.log(typeof (len));
            console.log("************************");
            console.log(len.length);
            var newlen = Number(len.length);
            console.log(typeof (newlen));
            for (var i = 0; i < parseInt(newlen); i++) {
                console.log(article.services);
                console.log("*****************************");
                console.log(article.services[i].service);

                if (article.services[i].service === req.body.service) {
                    article.services[i].remove();
                    article.save();
                    res.send("The service has been sucessfully");
                }
            }
        } else {
            console.log("The article was not found");
        }
    })

})
app.delete("/user", function (req, res) { //Deletes all the user
    user.deleteMany(function (err) {
        if (!err) {
            res.send("Sucessfully deleted all usesrs")
        } else {
            res.send(err);
        }
    })
})
app.delete("/user/:username", function (req, res) { // Deletes a specific user
    user.deleteOne({
        username: req.params.username
    }, function (err) {
        if (!err) {
            res.send("Sucessfully deleted user")
        } else {
            res.send(err);
        }
    })
})

app.listen(3000, function () { // Starts the server in localhost:3000
    console.log("Server has started");
})