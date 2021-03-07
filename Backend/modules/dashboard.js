'use strict'
const express = require('express');
const router = express.Router();
const con = require('./database');

router.get('/total_balance', (req, res) => {
    const userID = req.body.userID;
    const totalBalanceQuery = "SELECT(SELECT SUM(T.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` T WHERE T.PAID_BY_USER_ID = "+userID+" AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') - (SELECT SUM(R.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` R WHERE R.PAID_FOR_USER_ID = "+userID+" AND R.TRAN_TYPE = 6 AND R.SETTLED_FLAG = 'N')AS TOTAL_BALANCE;"

    con.query(totalBalanceQuery, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else{
            res.status(200).send(result[0])
        }
    });

});


router.get('/total_you_owe', (req, res) => {
    const userID = req.body.userID;
    const totalYouOweQuery = "SELECT SUM(T.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` T WHERE T.PAID_BY_USER_ID = "+userID+" AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N';"

    con.query(totalYouOweQuery, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else{
            res.status(200).send(result[0])
        }
    });

});

router.get('/total_you_are_owed', (req, res) => {
    const userID = req.body.userID;
    const totalYouAreOwedQuery = "SELECT SUM(R.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` R WHERE R.PAID_FOR_USER_ID = "+userID+" AND R.TRAN_TYPE = 6 AND R.SETTLED_FLAG = 'N';"

    con.query(totalYouAreOwedQuery, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else{
            res.status(200).send(result[0])
        }
    });

});

router.get('/you_are_owed', (req, res) => {
    const userID = req.body.userID;
    const userOwesTotal = "SELECT U.USER_NAME, U.CURRENCY, SUM(T.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` T, USERS U WHERE T.PAID_BY_USER_ID = "+userID+" AND U.USER_ID = T.PAID_FOR_USER_ID AND T.SETTLED_FLAG = 'N' AND T.PAID_FOR_USER_ID IN (SELECT UGM.USER_ID FROM USER_GROUP_MAP UGM WHERE UGM.USER_ID != "+userID+" AND UGM.GROUP_ID IN (SELECT UGM_S.GROUP_ID FROM USER_GROUP_MAP UGM_S WHERE UGM_S.USER_ID = "+userID+")) GROUP BY T.PAID_FOR_USER_ID;"

    con.query(userOwesTotal, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else{
            res.status(200).send(result)
        }
    });

});

router.get('/you_owe', (req, res) => {
    const userID = req.body.userID;
    const userOwesTotal = "SELECT U.USER_NAME, U.CURRENCY, SUM(T.AMOUNT) AS TOTAL_AMOUNT FROM `TRANSACTION` T, USERS U WHERE T.PAID_FOR_USER_ID = "+userID+" AND U.USER_ID = T.PAID_BY_USER_ID AND T.SETTLED_FLAG = 'N' AND T.PAID_BY_USER_ID IN (SELECT UGM.USER_ID FROM USER_GROUP_MAP UGM WHERE UGM.USER_ID != "+userID+" AND UGM.GROUP_ID IN (SELECT UGM_S.GROUP_ID FROM USER_GROUP_MAP UGM_S WHERE UGM_S.USER_ID = "+userID+")) GROUP BY T.PAID_BY_USER_ID;"

    con.query(userOwesTotal, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else{
            res.status(200).send(result)
        }
    });

});

module.exports = router;