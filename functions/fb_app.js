const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/fb_productRoutes");
const nftRoutes = require("./routes/fb_nftRoutes");
const reviewRoutes = require("./routes/fb_reviewRoutes");

admin.initializeApp();
const fb_app = express();
fb_app.use(cors({ origin: true }));
console.log("In FB app!");

fb_app.get("/", (req, res) => {
    res.status(200).send("Hello from the firebase api!");
});

fb_app.use("/products", productRoutes);
fb_app.use("/nft", nftRoutes);
fb_app.use("/reviews", reviewRoutes);

module.exports = fb_app;
