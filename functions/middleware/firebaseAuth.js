const firebase = require("firebase");
const functions = require("firebase-functions");

const fbAuthorize = (_, res, next) => {
    if (firebase.auth().currentUser) {
        next();
    } else {
        firebase
            .auth()
            .signInWithEmailAndPassword(functions.config().fb_fs_auth.mail, functions.config().fb_fs_auth.pwd)
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: {
                        message: "Error getting authorized with db app",
                    },
                });
            })
            .then(() => {
                console.log("authorized with db app");
                next();
            });
    }
};

module.exports = fbAuthorize;
