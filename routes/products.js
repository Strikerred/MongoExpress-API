var express = require("express");
var router = express.Router();
var mongojs = require("mongojs")
var config = require("../config")

var db= mongojs(config.database_cloud, ['products'])

router.get("/products", function(req, res, next) {
    // res.send("STUDENTS API");
    db.products.find((err, data) => {
        if(err)
            res.send(err)

        res.json(data)
    })
});
    // get single student
router.get("/products/:id", (req, res, next) => {
    db.products.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, data){
        if (err) {
            res.send(err);
        }
        res.json(data);
        });
    });

// create student
router.post("/products", (req, res, next) => {
    var product = req.body;

    if (!product.StartDate) {
        product.StartDate = new Date();
    }

    if (!product.product || !product.category
        || !product.price)  {
        res.status(400);
        res.json(
            {"error": "Bad data, could not be inserted into the database."}
        )
    } else {
        db.products.save(product, function(err, data) {
            if (err) {
                res.send(err);
            }
            res.json(data);
        })
    }
});
// delete student
router.delete("/products/:id", (req, res, next) => {
    db.products.remove({_id: mongojs.ObjectId(req.params.id)},function(err, data){
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
});

// update student
router.put("/products/:id", (req, res, next) => {
    var product = req.body;
    var changedProduct = {};

    if (product.product) {
        changedProduct.product = product.product;
    }

    if (product.category) {
        changedProduct.category = product.category;
    }

    if (product.price) {
        changedProduct.price = product.price;
    }

    if (product.StartDate) {
        changedProduct.StartDate = product.StartDate;
    }

    if (Object.keys(changedProduct).length==0) {
        res.status(400);
        res.json(
            {"error": "Bad Data"}
        )        
    } else {
        db.products.update({_id: mongojs.ObjectId(req.params.id)}, {$set: changedProduct},{},function(err, data){
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    }
});

module.exports = router;
