const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const productRoutes = require("../routes/productRoutes");

const app = express();

mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to mongo!");
});

app.get("/", (req, res) => {
    res.status(200).send("Hello from firebase functions!");
});

app.use("/products", productRoutes);

// catch-all for unsupported end points
app.use((req, res, next) => {
    const error = new Error("route not found");
    error.status = 404;
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

exports.api = functions.https.onRequest(app);
