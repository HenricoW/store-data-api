const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from REVIEWS!!");
});

router.post("/", (req, res) => {
    Review.create({ ...req.body })
        .then(() => {
            res.status(200).send("Record successfully created");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Record creation at Review could not be completed");
        });
});

module.exports = router;
