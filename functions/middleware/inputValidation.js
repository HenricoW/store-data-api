// const Web3 = require("web3")

const getSignerAddress = require("../utils/ethUtils");
const { db } = require("../firebase_db");

const nft_db = db.collection("nft");

// check if all required fields are present in the request body
const allFieldsPresent = (req, requiredFields) => {
    const requestFields = Object.keys(req.body);

    for (let i = 0; i < requiredFields.length; i++) {
        if (!requestFields.includes(requiredFields[i])) {
            const message = `Field: '${requiredFields[i]}' not present in request body`;
            return { error: true, message };
        }
    }

    return { error: false, message: null };
};

exports.productValidation = (req, res, next) => {
    const validFields = ["title", "desc", "price", "imageUrl", "message", "signedMssg"];
    let hasError = false;

    // check if all fields are present
    const allData = allFieldsPresent(req, validFields);
    if (allData.error) {
        res.status(406).json({
            error: {
                message: allData.message,
            },
        });
        return;
    }

    // get signer address
    let address;
    try {
        address = getSignerAddress(req.body.message, req.body.signedMssg);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: {
                message: "Error extracting signer address",
                detail: err.message,
            },
        });
        return;
    }
    console.log(address);

    // ...further validation/sanitization...

    if (!hasError) {
        console.log("Request data validated*");
        next();
    }
};

exports.productDeletion = (req, res, next) => {
    const validFields = ["message", "signedMssg"];
    let hasError = false;

    // check if all fields are present
    const allData = allFieldsPresent(req, validFields);
    if (allData.error) {
        res.status(406).json({
            error: {
                message: allData.message,
            },
        });
        return;
    }

    // get signer address
    let address;
    try {
        address = getSignerAddress(req.body.message, req.body.signedMssg);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: {
                message: "Error extracting signer address",
                detail: err.message,
            },
        });
        return;
    }
    console.log(address);

    // ...further validation/sanitization...

    if (!hasError) {
        console.log("Request data validated*");
        next();
    }
};

exports.nftValidation = (req, res, next) => {
    const validFields = ["title", "desc", "imageUrl", "itemID", "tokenID"];
    let hasError = false;

    // check if all fields are present
    const allData = allFieldsPresent(req, validFields);
    if (allData.error) {
        res.status(406).json({
            error: {
                message: allData.message,
            },
        });
        return;
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

exports.reviewValidation = (req, res, next) => {
    const validFields = ["name", "imageUrl", "text"];
    let hasError = false;

    // check if all fields are present
    const allData = allFieldsPresent(req, validFields);
    if (allData.error) {
        res.status(406).json({
            error: {
                message: allData.message,
            },
        });
        return;
    }

    // ...further validation/sanitization...

    if (!hasError) {
        console.log("Request data validated*");
        next();
    }
};
