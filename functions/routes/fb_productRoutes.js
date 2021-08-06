const express = require("express");
const firebase = require("firebase");
const functions = require("firebase-functions");

firebase.initializeApp({
    apiKey: functions.config().fb_db.api_key,
    authDomain: functions.config().fb_db.api_key,
    projectId: functions.config().fb_db.project_id,
});

const db = firebase.firestore();
const products_db = db.collection("products");

const router = express.Router();

// const pathFiller = "/store-w3-api/us-central1/api2"; // in dev
const pathFiller = "/api2"; // in prod

router.get("/", (req, res) => {
    let products = [];
    const basePath = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    console.log("in /products");
    products_db
        // .orderBy("createdAt")
        // .limit(1)
        .get()
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: {
                    message: "Error retrieving data from database",
                },
            });
        })
        .then((snap) => {
            console.log("in snapshot block");
            snap.forEach((doc) => {
                let item = doc.data();
                const obj = {
                    id: doc.id,
                    title: item.title,
                    desc: item.desc,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    featured: item.featured,
                    path: basePath + "/" + doc.id,
                };
                products.push(obj);
            });

            res.status(200).json(products);
        });
});

router.get("/:product_id", (req, res) => {
    const id = req.params.product_id;
    let item;
    const parent = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    const fullUrl = parent + req.path;
    console.log(fullUrl);
    products_db
        .doc(id)
        .get()
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: {
                    message: "Error retrieving data from database",
                },
            });
        })
        .then((doc) => {
            item = doc.data();
            if (!item)
                res.status(404).json({
                    error: {
                        message: "Requested resource not found",
                    },
                });
            else
                res.status(200).json({
                    id,
                    title: item.title,
                    desc: item.desc,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    featured: item.featured,
                    paths: {
                        this: fullUrl,
                        parent,
                    },
                });
        });
});

router.post("/", (req, res) => {
    const createdAt = firebase.firestore.Timestamp.fromDate(new Date());
    const formData = {
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        featured: false,
        createdAt,
    };
    products_db
        .add(formData)
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: {
                    message: "Error adding data to database",
                },
            });
        })
        .then((docRef) => {
            console.log(`Document was written to firestore with id: ${docRef.id}`);
            res.status(201).json({
                id: docRef.id,
                ...formData,
            });
        });
});

router.delete("/:product_id", (req, res) => {
    const product_id = req.params.product_id;
    products_db
        .doc(product_id)
        .delete()
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: {
                    message: "Error deleting the document",
                },
            });
        })
        .then(() => {
            console.log(`document id: ${product_id} successfully deleted`);
            res.status(200).json({
                success: {
                    message: "Document successfully deleted",
                },
            });
        });
});

module.exports = router;
