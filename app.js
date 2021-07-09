const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv/config");

const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
// connect to database
mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to mongo!");
});

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use("/products", productRoutes);
// app.use("/reviews", reviewRoutes);

// routes
app.get("/", (req, res) => {
    res.status(200).send("Hello from api");
});

// catch-all for unsupported end points
app.use((req, res, next) => {
    const error = new Error("route not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

app.listen(3030);
