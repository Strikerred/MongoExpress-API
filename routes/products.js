var express = require("express");
var router = express.Router();
var mongojs = require("mongojs")
var config = require("../config")

var db= mongojs(config.database_cloud, ['products'])

/**
 * @swagger
 * definitions:
 *   Product:
 *     properties:
 *       product:
 *         type: string
 *         example: Computer
 *       category:
 *         type: string
 *         example: Electronics
 *       price:
 *         type: integer
 *         example: 350
 */

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
 *         schema:
 *         $ref: '#/definitions/Product'
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
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - products
 *     description: Returns a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
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
 * /api/products:
 *   post:
 *     tags:
 *       - products
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: product object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully created
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
 * /api/products/{productId}:
 *   delete:
 *     tags:
 *       - products
 *     description: Deletes a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: product's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/products/:id", (req, res, next) => {
    db.products.remove({_id: mongojs.ObjectId(req.params.id)},function(err, data){
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
});

/**
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     tags: 
 *       - products
 *     description: Updates a single product
 *     produces: application/json
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: Id of the product to return
 *         require: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Fields for the Product resource
 *         require: true
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
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
