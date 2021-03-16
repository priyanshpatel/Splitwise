'use strict';
const express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
const router = express.Router();
const con = require('./database');

router.get('/recent_activity/:userID/:groupID/:sortFlag', (req, res) => {
    const userID = req.params.userID
    const groupID = req.params.groupID
    const sortFlag = req.params.sortFlag
    console.log(userID);
    console.log(groupID);
    console.log(sortFlag);
    let sortAppend = ""
    let groupAppend = ""

    if (groupID == 0) {
        // All recent activities
        groupAppend = " "
    } else {
        groupAppend = " AND UGM.GROUP_ID = " + groupID
    }

    if (sortFlag == 1) {
        // Ascending: 1
        sortAppend = " ORDER BY E.EXP_ID ASC"
    } else {
        // Descending: 2
        sortAppend = " ORDER BY E.EXP_ID DESC"
    }

    // const recentActivityQuery = "SELECT E.EXP_ID, E.DESCRIPTION, E.CURRENCY,E.AMOUNT AS TOTAL_AMOUNT, E.PAID_BY_USER_ID, U.USER_NAME, E.GROUP_ID, EG.GROUP_NAME, T.PAID_FOR_USER_ID, T.AMOUNT, T.TRAN_TYPE, E.CREATED_AT, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You get back ',E.CURRENCY,T.AMOUNT ) WHEN T.TRAN_TYPE = 6 THEN CONCAT('You owe ',E.CURRENCY,T.AMOUNT) ELSE CONCAT('You settled up with ',U.USER_NAME) END AS MESSAGE_2 FROM EXPENSES E, USER_GROUP_MAP UGM, EXPENSE_GROUPS EG, USERS U, `TRANSACTION` T WHERE T.EXP_ID = E.EXP_ID AND U.USER_ID = E.PAID_BY_USER_ID AND EG.GROUP_ID = E.GROUP_ID AND E.GROUP_ID = UGM.GROUP_ID AND UGM.USER_ID = T.PAID_FOR_USER_ID AND UGM.INVITE_FLAG = 'A' AND T.PAID_FOR_USER_ID = " + userID + groupAppend + sortAppend;

    const recentActivityQuery = "SELECT E.EXP_ID, E.DESCRIPTION, E.CURRENCY,E.AMOUNT AS TOTAL_AMOUNT, E.PAID_BY_USER_ID, U.USER_NAME, E.GROUP_ID, EG.GROUP_NAME, T.PAID_FOR_USER_ID, T.AMOUNT, T.TRAN_TYPE, E.CREATED_AT, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You added ', E.DESCRIPTION, ' in ', EG.GROUP_NAME, '.') WHEN T.TRAN_TYPE = 6 THEN CONCAT(U.USER_NAME, ' added ', E.DESCRIPTION, ' in ', EG.GROUP_NAME, '.') ELSE CONCAT('You settled up with ', U.USER_NAME) END AS MESSAGE_1, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You get back ', E.CURRENCY, T.AMOUNT) WHEN T.TRAN_TYPE = 6 THEN CONCAT('You owe ', E.CURRENCY, T.AMOUNT) ELSE CONCAT('You settled up with ', U.USER_NAME) END AS MESSAGE_2 FROM EXPENSES E, USER_GROUP_MAP UGM, EXPENSE_GROUPS EG, USERS U, `TRANSACTION` T WHERE T.EXP_ID = E.EXP_ID AND U.USER_ID = E.PAID_BY_USER_ID AND EG.GROUP_ID = E.GROUP_ID AND E.GROUP_ID = UGM.GROUP_ID AND UGM.USER_ID = T.PAID_FOR_USER_ID AND UGM.INVITE_FLAG = 'A' AND T.PAID_FOR_USER_ID = " + userID + groupAppend + sortAppend;

    con.query(recentActivityQuery, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
            return;
        } else {
            res.status(200).send(result)
        }
    });

});

module.exports = router;