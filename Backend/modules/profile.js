'use strict';
const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const con = require('./database');
const multer = require('multer');
const path = require('path');

// set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/profile/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "_" +
            Math.floor(Math.random() * 100) +
            "_" +
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

// Middleware to upload images where the image size should be less than 5MB
const uploadGroupImage = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

router.get('/:userID', (req, res) => {
    //const userID = req.body.userID;
    const userID = req.params.userID
    const profileViewQuery = "SELECT * FROM USERS WHERE USER_ID = " + userID;
    con.query(profileViewQuery, function (err, result, fields) {
        if (err) {
            res.status(500).send('Error');
        } else {
            console.log("=========View Profile Backend=========");
            console.log(result[0]);
            res.status(200).json({
                'userID': result[0].USER_ID,
                'userEmail': result[0].USER_EMAIL,
                'userName': result[0].USER_NAME,
                'phoneNumber': result[0].PHONE_NUMBER,
                'timezone': result[0].TIMEZONE,
                'currency': result[0].CURRENCY,
                'language': result[0].LANGUAGE,
                'profilePicture': result[0].PROFILE_PICTURE
            });
        }
    });
});

router.post('/update', uploadGroupImage.single("profilePicture"), (req, res) => {
    const userID = req.body.userID;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const phoneNumber = req.body.phoneNumber;
    const currency = req.body.currency;
    const timezone = req.body.timezone;
    const language = req.body.language;
    //const profilePicture = req.body.profilePicture;

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    }
    console.log("Inside update profile post");

    const updateProfileQuery = 'UPDATE USERS SET USER_NAME = "' + userName + '", USER_EMAIL = "' + userEmail + '", PHONE_NUMBER = ' + phoneNumber + ', CURRENCY = "' + currency + '", TIMEZONE = "' + timezone + '", LANGUAGE = "' + language + '", PROFILE_PICTURE = "' + imagePath + '" WHERE USER_ID = ' + userID;

    con.query(updateProfileQuery, function (err, result, fields) {
        if (err) {
            if (err.errno == 1062) {
                res.status(201).send('Email ID already exists');
            } else {
                res.status(500).send('Error');
            }
        } else {
            res.status(200).send("Profile Updated Successfully");
        }
    });

});

module.exports = router;