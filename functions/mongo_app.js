const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv/config");

const productRoutes = require("./routes/productRoutes");

// const CONN_STRING = functions.config().db ? functions.config().db.conn_string : process.env.DB_CONN_STRING;
const CONN_STRING = functions.config().mongo_db.conn_string;

mongoose.connect(CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    console.log("connected to mongo!");
});

const mongo_app = express();

mongo_app.use(cors({ origin: true }));

mongo_app.get("/", (req, res) => {
    res.status(200).send("Hello from the mongo api!");
});

mongo_app.use("/products", productRoutes);

// catch-all for unsupported end points
mongo_app.use((req, res) => {
    const error = new Error("route not found");
    error.status = 404;
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = mongo_app;
