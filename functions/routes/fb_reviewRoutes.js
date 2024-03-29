const express = require("express");
const { db, timestamp_fb } = require("../firebase_db");

const review_db = db.collection("reviews");
const router = express.Router();

// const pathFiller = "/store-w3-api/us-central1/api2"; // in dev
const pathFiller = "/api2"; // in prod

// middleware
const { reviewValidation } = require("../middleware/inputValidation");
const fbAuthorize = require("../middleware/firebaseAuth");
router.use(fbAuthorize);

// ROUTES
// get all reviews
router.get("/", (req, res) => {
    let reviews = [];
    const basePath = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    review_db
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
            if (!snap) {
                res.status(404).json({
                    error: {
                        message: "Empty resource returned",
                    },
                });
            } else {
                snap.forEach((doc) => {
                    let item = doc.data();
                    const obj = {
                        id: doc.id,
                        ...item,
                        path: basePath + "/" + doc.id,
                    };
                    reviews.push(obj);
                });

                res.status(200).json(reviews);
            }
        });
});

// get specific review by firestore generated document id
router.get("/:review_id", (req, res) => {
    const review_id = req.params.review_id;
    const parent = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    const fullUrl = parent + req.path;
    console.log(review_id);
    review_db
        .doc(review_id)
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
                    id: doc.id,
                    ...item,
                    paths: {
                        this: fullUrl,
                        parent,
                    },
                });
        });
});

// add a new review to 'reviews' collection. return item data + firestore id on success
router.post("/", reviewValidation, (req, res) => {
    const addedOn = timestamp_fb();

    // extract only the needed information from the request
    const postData = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        text: req.body.text,
        addedOn,
    };

    review_db
        .add(postData)
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: {
                    message: "Error adding data to database",
                },
            });
        })
        .then((docRef) => {
            console.log(`Review was written to firestore with id: ${docRef.id}`);
            res.status(201).json({
                id: docRef.id,
                ...postData,
            });
        });
});

// delete review entry from 'reviews' collection
router.delete("/:review_id", (req, res) => {
    const review_id = req.params.review_id;

    review_db
        .doc(review_id)
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
            console.log(`review id: ${review_id} successfully deleted`);
            res.status(200).json({
                success: {
                    message: "Document successfully deleted",
                },
            });
        });
});

module.exports = router;
