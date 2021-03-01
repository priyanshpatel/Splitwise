'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('./database');

router.post('/', (req, res) => {
    console.log(req.body)
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;

    console.log(userEmail);
    console.log(userPassword);

    console.log('Inside Login Post Request');
    const loginCheckQuery = "SELECT COUNT(0) AS COUNT FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
    con.query(loginCheckQuery, function (err, result, fields) {
        if (err) {
            res.status(400).send("Error");
        } else {
            console.log(result);
            console.log(result[0].COUNT);
            if (result[0].COUNT == 1) {
                const loginQuery = "SELECT * FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
                console.log("Query: " + loginQuery);
                con.query(loginQuery, function (err, result, fields) {
                    if (err) {
                        res.status(400).send("Error");
                    } else {
                        console.log(result);

                        console.log(result[0].USER_PASSWORD);
                        const userDBPassword = result[0].USER_PASSWORD;
                        const userID = result[0].USER_ID;

                        let passCheck = bcrypt.compareSync(userPassword, userDBPassword)
                        // let passCheck = true;
                        if (passCheck) {
                            res.cookie('cookie', userID, { maxAge: 900000, httpOnly: false, path: '/' });
                            req.session.user = result[0];
                            console.log("login success");
                            // res.status(200).send("Login Success");
                            res.status(200).json({userID: result[0].USER_ID});

                        } else {
                            res.status(201).send("Login Failed");
                            console.log("login failed");
                        }
                    }
                });

            } else {
                res.status(201).send("Invalid Credentials");
                console.log("Invalid Credentials");
            }
        }
    });
});

module.exports = router