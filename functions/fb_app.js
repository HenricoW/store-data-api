// const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/fb_productRoutes");

admin.initializeApp();

const fb_app = express();

fb_app.use(cors({ origin: true }));

console.log("In FB app!");

fb_app.get("/", (req, res) => {
    res.status(200).send("Hello from the firebase api!");
});

fb_app.use("/products", productRoutes);

module.exports = fb_app;
