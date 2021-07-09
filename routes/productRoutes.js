const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// create a new product
router.post("/", (req, res) => {
    console.log(req.body);
    // ensure that no unwanted data is entered to DB. Extract only needed fields
    const prodObj = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        dateCreated: req.body.dateCreated,
        featured: req.body.featured,
    };
    Product.create(prodObj)
        .then((data) => {
            console.log(data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// return all products. perhaps limited with data in the request body?
router.get("/", (req, res) => {
    Product.find()
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// return specific product
router.get("/:product_id", (req, res) => {
    Product.find({ _id: req.params.product_id })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// update a product
router.patch("/:product_id", (req, res) => {
    Product.updateOne({ _id: req.params.product_id }, req.body)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// delete a product
router.delete("/:product_id", (req, res) => {
    Product.deleteOne({ _id: req.params.product_id })
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;
