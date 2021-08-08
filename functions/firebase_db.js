const functions = require("firebase-functions");
const firebase = require("firebase");

firebase.initializeApp({
    apiKey: functions.config().fb_db.api_key,
    authDomain: functions.config().fb_db.api_key,
    projectId: functions.config().fb_db.project_id,
});

// get authorized access
firebase.auth().signInWithEmailAndPassword(functions.config().fb_fs_auth.mail, functions.config().fb_fs_auth.pwd);
const db = firebase.firestore();

// firestore compatible timestamp
const timestamp_fb = () => firebase.firestore.Timestamp.fromDate(new Date());

module.exports = { db, timestamp_fb };
