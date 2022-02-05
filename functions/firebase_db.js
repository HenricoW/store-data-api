const functions = require("firebase-functions");
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: functions.config().fb_db.api_key,
  authDomain: functions.config().fb_db.api_key,
  projectId: functions.config().fb_db.project_id,
});

const db = firebase.firestore();

const timestamp_fb = () => firebase.firestore.Timestamp.fromDate(new Date());

module.exports = { db, timestamp_fb };
