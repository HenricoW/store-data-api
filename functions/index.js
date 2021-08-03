const functions = require("firebase-functions");
const mongo_app = require("./mongo_app");
const fb_app = require("./fb_app");

exports.api = functions.https.onRequest(mongo_app);
exports.api2 = functions.https.onRequest(fb_app);
