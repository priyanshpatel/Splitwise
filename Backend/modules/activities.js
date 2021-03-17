'use strict';
const express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
const router = express.Router();
const con = require('./database');

router.get('/recent_activity/:userID/:groupID/:sortFlag', (req, res) => {
    const userID = req.params.userID
    const groupID = req.params.groupID
    const sortFlag = req.params.sortFlag
    // console.log(userID);
    // console.log(groupID);
    // console.log(sortFlag);
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

    //const recentActivityQuery = "SELECT E.EXP_ID, E.DESCRIPTION, E.CURRENCY,E.AMOUNT AS TOTAL_AMOUNT, E.PAID_BY_USER_ID, U.USER_NAME, E.GROUP_ID, EG.GROUP_NAME, T.PAID_FOR_USER_ID, T.AMOUNT, T.TRAN_TYPE, E.CREATED_AT, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You added ', E.DESCRIPTION, ' in ', EG.GROUP_NAME, '.') WHEN T.TRAN_TYPE = 6 THEN CONCAT(U.USER_NAME, ' added ', E.DESCRIPTION, ' in ', EG.GROUP_NAME, '.') ELSE CONCAT('You settled up with ', U.USER_NAME) END AS MESSAGE_1, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You get back ', E.CURRENCY, T.AMOUNT) WHEN T.TRAN_TYPE = 6 THEN CONCAT('You owe ', E.CURRENCY, T.AMOUNT) ELSE CONCAT('You settled up with ', U.USER_NAME) END AS MESSAGE_2 FROM EXPENSES E, USER_GROUP_MAP UGM, EXPENSE_GROUPS EG, USERS U, `TRANSACTION` T WHERE T.EXP_ID = E.EXP_ID AND U.USER_ID = E.PAID_BY_USER_ID AND EG.GROUP_ID = E.GROUP_ID AND E.GROUP_ID = UGM.GROUP_ID AND UGM.USER_ID = T.PAID_FOR_USER_ID AND UGM.INVITE_FLAG = 'A' AND T.PAID_FOR_USER_ID = " + userID + groupAppend + sortAppend;

    const recentActivityQuery = "SELECT E.EXP_ID, E.DESCRIPTION, E.CURRENCY,E.AMOUNT AS TOTAL_AMOUNT, E.PAID_BY_USER_ID, U.USER_NAME, E.GROUP_ID, EG.GROUP_NAME, T.PAID_FOR_USER_ID, T.AMOUNT, T.TRAN_TYPE, E.CREATED_AT, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You added ',E.DESCRIPTION,' in ',EG.GROUP_NAME,'.') WHEN T.TRAN_TYPE = 6 THEN CONCAT(U.USER_NAME,' added ',E.DESCRIPTION,' in ',EG.GROUP_NAME,'.') WHEN T.TRAN_TYPE = 0 AND E.PAID_BY_USER_ID = " + userID + " THEN CONCAT('You are settled up with ',(SELECT USER_NAME FROM USERS WHERE USER_ID = E.SETTLED_WITH_USER_ID),' for ',(SELECT GROUP_NAME FROM EXPENSE_GROUPS WHERE GROUP_ID = T.GROUP_ID)) WHEN T.TRAN_TYPE = 0 AND E.PAID_BY_USER_ID != " + userID + " THEN CONCAT('You are settled up with ', U.USER_NAME) END AS MESSAGE_1, CASE WHEN T.TRAN_TYPE = 3 THEN CONCAT('You get back ',E.CURRENCY,T.AMOUNT ) WHEN T.TRAN_TYPE = 6 THEN CONCAT('You owe ',E.CURRENCY,T.AMOUNT) ELSE CONCAT('All balances settled') END AS MESSAGE_2 FROM EXPENSES E, USER_GROUP_MAP UGM, EXPENSE_GROUPS EG, USERS U, `TRANSACTION` T WHERE T.EXP_ID = E.EXP_ID AND U.USER_ID = E.PAID_BY_USER_ID AND EG.GROUP_ID = E.GROUP_ID AND E.GROUP_ID = UGM.GROUP_ID AND UGM.USER_ID = T.PAID_FOR_USER_ID AND UGM.INVITE_FLAG = 'A' AND (T.PAID_FOR_USER_ID = " + userID + " OR (T.PAID_BY_USER_ID = " + userID + " AND T.TRAN_TYPE = 0))" + groupAppend + sortAppend;

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

router.post('/settleup', (req, res) => {
    let userID1 = req.body.userID1
    let userID2 = req.body.userID2
    let userID = req.body.userID
    let swap = null
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (userID2 < userID1) {
        swap = userID1
        userID1 = userID2
        userID2 = swap
    }
    const getDebtGroupQuery = "SELECT GROUP_ID, ABS(AMOUNT) AS AMOUNT FROM DEBTS WHERE USER_ID_1 = " + userID1 + " AND USER_ID_2 = " + userID2;
    const updateDebtsQuery = "UPDATE DEBTS SET AMOUNT = 0 WHERE USER_ID_1 = " + userID1 + " AND USER_ID_2 = " + userID2;
    const updateTransactionQuery = "UPDATE `TRANSACTION` SET SETTLED_FLAG = 'Y', SETTLED_DATE = '" + ts + "' WHERE (PAID_BY_USER_ID = " + userID1 + " OR PAID_FOR_USER_ID = " + userID1 + ") AND (PAID_BY_USER_ID = " + userID2 + " OR PAID_FOR_USER_ID = " + userID2 + ")";
    // const insertExpensesQuery = "INSERT INTO EXPENSES (DESCRIPTION, AMOUNT, GROUP_ID, PAID_BY_USER_ID, CREATED_AT, CURRENCY, SETTLE_FLAG, SETTLED_WITH_USER_ID) VALUES ('settle', 0, 0, " + userID1 + ", '" + ts + "', '$', 'Y', " + userID2 + ")";
    // console.log(insertExpensesQuery);
    // console.log(updateTransactionQuery);
    con.query(updateDebtsQuery, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).json({ "apiFlag": 0, "apiResponse": err });
            return;
        } else {
            console.log("update debts successful");
            con.query(updateTransactionQuery, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ "apiFlag": 0, "apiResponse": err });
                    return;
                } else {
                    console.log("update transaction successful");
                    con.query(getDebtGroupQuery, function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ "apiFlag": 0, "apiResponse": err });
                            return;
                        } else {
                            console.log("Getting debt groups successful");
                            console.log(result);
                            // res.status(200).send(result)
                            const debtGroups = result
                            let paidByUserID = userID
                            let settledWithUserID = null
                            if (paidByUserID !== userID1) {
                                settledWithUserID = userID1
                            } else {
                                settledWithUserID = userID2
                            }
                            console.log("User ID", userID);
                            console.log("Paid by", paidByUserID);
                            console.log("Settled with", settledWithUserID);
                            debtGroups.forEach(element => {
                                // console.log(element);
                                const insertExpensesQuery = "INSERT INTO EXPENSES (DESCRIPTION, AMOUNT, GROUP_ID, PAID_BY_USER_ID, CREATED_AT, CURRENCY, SETTLE_FLAG, SETTLED_WITH_USER_ID) VALUES ('settle', " + element.AMOUNT + ", " + element.GROUP_ID + ", " + paidByUserID + ", '" + ts + "', '$', 'Y', " + settledWithUserID + ")";
                                const insertTransactionQuery = "INSERT INTO `TRANSACTION` (GROUP_ID, EXP_ID, PAID_BY_USER_ID, PAID_FOR_USER_ID, TRAN_TYPE, AMOUNT, SETTLED_FLAG, SETTLED_DATE) VALUES (" + element.GROUP_ID + ", (SELECT MAX(EXP_ID) FROM EXPENSES), " + paidByUserID + ", " + settledWithUserID + ", 0, " + element.AMOUNT + ", 'Y', '" + ts + "')";
                                console.log(insertExpensesQuery);
                                console.log(insertTransactionQuery);
                                con.query(insertExpensesQuery, function (err, result, fields) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    } else {
                                        console.log("Settle up entry in expenses successfully added");
                                        con.query(insertTransactionQuery, function (err, result, fields) {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            } else {
                                                console.log("Settle up entry in transaction successfully added");
                                            }
                                        })
                                    }
                                })
                            });
                            res.status(200).send(result)
                        }
                    });
                }
            });
            //res.status(200).json({ "apiFlag": 1, "apiResponse": "Settled up successfully" });
        }
    });

});

module.exports = router;