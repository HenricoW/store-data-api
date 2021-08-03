const express = require("express");
const firebase = require("firebase");

firebase.initializeApp({
    apiKey: "AIzaSyBjy4c1Ydi7fEYy_Ra2dG4yKpXF3yblFLk",
    authDomain: "blockstore-1.firebaseapp.com",
    projectId: "blockstore-1",
});

const db = firebase.firestore();
const products_db = db.collection("products");

const router = express.Router();

const pathFiller = "/store-w3-api/us-central1/api2";

router.get("/", (req, res) => {
    let products = [];
    const basePath = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    console.log("in /products");
    products_db
        // .orderBy("createdAt")
        // .limit(1)
        .get()
        .catch((err) => {
            console.log("in error block");
            console.log(err);
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
                    url: item.url,
                    featured: item.featured,
                    path: basePath + "/" + doc.id,
                };
                products.push(obj);
            });

            res.status(200).json({
                message: "product routes works!",
                products: products,
            });
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
        .catch((err) => console.log(err))
        .then((doc) => {
            item = doc.data();
            res.status(200).json({
                id,
                title: item.title,
                desc: item.desc,
                price: item.price,
                url: item.url,
                featured: item.featured,
                paths: {
                    this: fullUrl,
                    parent,
                },
            });
        });
});

module.exports = router;
