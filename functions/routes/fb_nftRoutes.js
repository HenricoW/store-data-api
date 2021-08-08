const express = require("express");
const { db, timestamp_fb } = require("../firebase_db");

const nft_db = db.collection("nft");
const router = express.Router();

// const pathFiller = "/store-w3-api/us-central1/api2"; // in dev
const pathFiller = "/api2"; // in prod

// nft data validation on post request
const validateData = (req, res, next) => {
    const validFields = ["title", "desc", "imageUrl", "itemID", "tokenID"];
    const reqFields = Object.keys(req.body);
    let hasError = false;

    // check if all fields are present
    for (let i = 0; i < validFields.length; i++) {
        if (!reqFields.includes(validFields[i])) {
            const message = `Field: '${validFields[i]}' not present in request body`;
            hasError = true;
            res.status(406).json({
                error: {
                    message,
                },
            });
            break;
        }
    }

    // check if tokenID is already used
    if (!hasError)
        nft_db
            .where("tokenID", "==", parseInt(req.body.tokenID))
            .get()
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: {
                        message: "Error verifying tokenID",
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
                    let itemArray = [];
                    // snapshot obj: can't just do snap.length, have to 'unwrap' with forEach()
                    snap.forEach((doc) => {
                        itemArray.push(doc.data());
                    });

                    if (itemArray.length > 0) {
                        res.status(400).json({
                            error: {
                                message: "tokenID already taken",
                            },
                        });
                    } else {
                        // ...further validation/sanitization...

                        console.log("Request data validated*");
                        next();
                    }
                }
            });
};

router.get("/", (req, res) => {
    let products = [];
    const basePath = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    console.log("in /nft");
    nft_db
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
                        path: basePath + "/" + item.tokenID,
                    };
                    products.push(obj);
                });

                res.status(200).json(products);
            }
        });
});

router.get("/:token_id", (req, res) => {
    const token_id = req.params.token_id;
    const parent = req.protocol + "://" + req.get("host") + pathFiller + req.baseUrl;
    const fullUrl = parent + req.path;
    console.log(token_id);
    nft_db
        .where("tokenID", "==", parseInt(token_id))
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
                let itemArray = [];
                snap.forEach((doc) => {
                    itemArray.push(doc.data());
                });
                const data = itemArray[0];
                if (itemArray.length === 0)
                    res.status(404).json({
                        error: {
                            message: "Requested resource not found",
                        },
                    });
                else
                    res.status(200).json({
                        title: data.title,
                        desc: data.desc,
                        imageUrl: data.imageUrl,
                        itemID: data.itemID,
                        tokenID: data.tokenID,
                        purchasedOn: data.purchasedOn,
                        paths: {
                            this: fullUrl,
                            parent,
                        },
                    });
            }
        });
});

router.post("/", validateData, (req, res) => {
    const purchasedOn = timestamp_fb();
    const postData = {
        title: req.body.title,
        desc: req.body.desc,
        imageUrl: req.body.imageUrl,
        itemID: req.body.itemID,
        tokenID: parseInt(req.body.tokenID),
        purchasedOn,
    };
    nft_db
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
            console.log(`Document was written to firestore with id: ${docRef.id}`);
            res.status(201).json({
                id: docRef.id,
                ...postData,
            });
        });
});

// router.delete("/:token_id", (req, res) => {
//     const token_id = req.params.token_id;
//     nft_db
//         .doc(product_id)
//         .delete()
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({
//                 error: {
//                     message: "Error deleting the document",
//                 },
//             });
//         })
//         .then(() => {
//             console.log(`document id: ${product_id} successfully deleted`);
//             res.status(200).json({
//                 success: {
//                     message: "Document successfully deleted",
//                 },
//             });
//         });
// });

module.exports = router;
