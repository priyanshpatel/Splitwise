'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('./database');

router.post('/', (req, res) => {
    // name emailid and password, email id should be unique
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    let signupFlag = false;

    const signupCheckQuery = "SELECT COUNT(0) AS COUNT FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";

    con.query(signupCheckQuery, function (err, result, fields) {
        if (err) throw err;

        if (result[0].COUNT > 0) {
            res.status(201).send("Email already exists.");
            console.log("Email already exists");
        } else {
            //const encryptedPassword = async(userPassword) => await bcrypt.hash(userPassword, await bcrypt.genSalt());
            const hashedPassword = bcrypt.hashSync(userPassword, 10);
            const signupQuery = "INSERT INTO USERS(USER_EMAIL, USER_NAME, USER_PASSWORD) VALUES ('" + userEmail + "','" + userName + "','" + hashedPassword + "')";
            con.query(signupQuery, function (err, result, fields) {
                if (err) {
                    res.status(500).send('Error');
                } else {
                    signupFlag = true
                    // res.status(200).send("Signup successful");
                    if (signupFlag) {
                        const getUserIDQuery = "SELECT USER_ID FROM USERS WHERE USER_EMAIL = '" + userEmail + "'"
                        con.query(getUserIDQuery, function (err, result, fields) {
                            if (err) {
                                res.status(500).send('Error');
                            } else {
                                res.cookie('cookie', result[0].USER_ID, { maxAge: 900000, httpOnly: false, path: '/' });
                                req.session.user = result[0];
                                res.status(200).json({ userID: result[0].USER_ID });
                            }
                        })
                    }
                }
            });
        };
    });

});

module.exports = router