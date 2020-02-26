var express = require("express");
var router = express.Router();

const request = require('request');
var data = [{}];

request('http://localhost:3000/api/products', 
    { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        data = body;
});

router.get("/", function(req, res, next) {
    // res.send("INDEX page");
    // res.render("index", {title: "Mongo Express Application"})
    res.render("index",{
        title: "Mongo Express Application",
        data: data
    })
});

module.exports = router;
