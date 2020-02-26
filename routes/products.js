var express = require("express");
var router = express.Router();
var mongojs = require("mongojs")
var config = require("../config")

var db= mongojs(config.database_cloud, ['products'])

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A JSON of products
 */
router.get("/products", function(req, res, next) {
    // res.send("STUDENTS API");
    db.products.find((err, data) => {
        if(err)
            res.send(err)

        res.json(data)
    })
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - product
 *     description: Returns products by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         description: Products's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A JSON of product
 */
router.get("/products/:id", (req, res, next) => {
    db.products.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, data){
        if (err) {
            res.send(err);
        }
        res.json(data);
        });
    });


/**
 * @swagger
 * /api/products/id:
 *   post:
 *     tags:
 *       - product
 *     description: create a  product
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Create a product
 */
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

/**
 * @swagger
 * /api/products/id:
 *   delete:
 *     tags:
 *       - product
 *     description: delete a  product
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: delete a product
 */
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
