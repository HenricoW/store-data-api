const express = require("express");
const { db, timestamp_fb } = require("../firebase_db");

const nft_db = db.collection("nft");
const router = express.Router();

// const pathFiller = "/store-w3-api/us-central1/api2"; // in dev
const pathFiller = "/api2"; // in prod

// middleware
const { nftValidation } = require("../middleware/inputValidation");
const fbAuthorize = require("../middleware/firebaseAuth");
router.use(fbAuthorize);

// ROUTES
// get all nfts
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

// get specific nft by contract generated token id
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

// add a new nft to 'nfts' collection. return item data + firestore id on success
router.post("/", nftValidation, (req, res) => {
    const purchasedOn = timestamp_fb();

    // extract only the needed information from the request
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

// delete nft entry from 'nfts' collection
// router.delete("/:token_id", (req, res) => {
//     const token_id = req.params.token_id;
//
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
