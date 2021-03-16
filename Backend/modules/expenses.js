'use strict';
const { CONNREFUSED } = require('dns');
const express = require('express');
const router = express.Router();
const con = require('./database');

router.post('/add', (req, res) => {
    const userID = req.body.userID;
    const groupID = req.body.groupID;
    const amount = req.body.amount;
    const description = req.body.description;
    const currency = req.body.currency;
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let tran_type = 3;
    let exp_id = null;
    let result_1 = null;
    let api_response = null;
    let settled_flag = 'N';

    const countGroupMembersQuery = "SELECT USER_ID FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'A' AND GROUP_ID = " + groupID;
    const selExpIDQuery = "SELECT MAX(EXP_ID) AS NEW_EXP_ID FROM EXPENSES WHERE GROUP_ID = " + groupID + " AND PAID_BY_USER_ID = " + userID;
    const addExpenseQuery = "INSERT INTO EXPENSES (DESCRIPTION, AMOUNT, GROUP_ID, PAID_BY_USER_ID, CREATED_AT, CURRENCY) VALUES ('" + description + "', " + amount + ", " + groupID + ", " + userID + ", '" + ts + "', '" + currency + "')";

    con.query(countGroupMembersQuery, async function (err, result, fields) {
        if (err) {
            console.log("Error");
            res.status(500).send("Error while counting group members")
            return;
        }
        else {
            // const tran_amount = amount/result.length;

            //Added due to debt table change
            let userID1 = null
            let userID2 = null
            let debt_amount = 0
            //End
            const tran_amount_self = amount - (amount / result.length);
            const tran_amount_others = amount / result.length;
            let tran_amount = amount;
            result_1 = result;
            con.query(addExpenseQuery, function (err, result, fields) {
                if (err) {
                    console.log("Error while adding expense");
                    res.status(500).send("Error while adding expense");
                    return;
                } else {
                    console.log("Expense Added");
                    con.query(selExpIDQuery, function (err, result, fields) {
                        if (err) {
                            console.log("Error while getting expense id");
                            res.status(500).send("Error while getting expense id")
                            return;
                        }
                        else {
                            exp_id = result[0].NEW_EXP_ID
                            api_response = result[0];
                            result_1.forEach(element => {
                                if (element.USER_ID === userID) {
                                    tran_type = 3;
                                    settled_flag = 'Y';
                                    tran_amount = tran_amount_self;
                                } else {
                                    tran_type = 6;
                                    settled_flag = 'N';
                                    tran_amount = tran_amount_others;
                                    //Added due to debt table change
                                    if (element.USER_ID < userID) {
                                        debt_amount = 0 - tran_amount_others;
                                        userID1 = element.USER_ID;
                                        userID2 = userID;
                                    } else {
                                        debt_amount = tran_amount_others;
                                        userID1 = userID;
                                        userID2 = element.USER_ID;
                                    }
                                    //End
                                }
                                //Added due to debt table change
                                const countDebtQuery = "SELECT COUNT(0) AS COUNT FROM DEBTS D WHERE D.GROUP_ID = " + groupID + " AND D.USER_ID_1 = " + userID1 + " AND D.USER_ID_2 = " + userID2;
                                const addDebtQuery = "INSERT INTO DEBTS (GROUP_ID, USER_ID_1, USER_ID_2, AMOUNT) VALUES (" + groupID + ", " + userID1 + ", " + userID2 + "," + debt_amount + ")";
                                const updateDebtQuery = "UPDATE DEBTS SET AMOUNT = AMOUNT + " + debt_amount + " WHERE GROUP_ID = " + groupID + " AND USER_ID_1 = " + userID1 + " AND USER_ID_2 = " + userID2;
                                //End
                                const addTransactionQuery = "INSERT INTO `TRANSACTION` (GROUP_ID, PAID_BY_USER_ID, PAID_FOR_USER_ID, AMOUNT, TRAN_TYPE, EXP_ID, SETTLED_FLAG) VALUES (" + groupID + ", " + userID + ", " + element.USER_ID + ", " + tran_amount + ", " + tran_type + ", " + exp_id + ", '" + settled_flag + "')";
                                con.query(addTransactionQuery, function (err, result, fields) {
                                    if (err) {
                                        console.log(err);
                                        //res.status(500).send("Error while adding transactions");
                                        return;
                                    } else {
                                        console.log("Transaction entry successful");
                                        //res.status(200).send(result);

                                        //Added due to debt table changes
                                        if (element.USER_ID !== userID) {
                                            con.query(countDebtQuery, function (err, result, fields) {
                                                if (err) {
                                                    console.log(err);
                                                    return;
                                                } else {
                                                    console.log(result[0].COUNT);
                                                    if (result[0].COUNT == 0) {
                                                        con.query(addDebtQuery, function (err, result, fields) {
                                                            if (err) {
                                                                console.log(err);
                                                                return;
                                                            } else {
                                                                console.log("Debt successfully added");
                                                            }
                                                        })
                                                    } else if (result[0].COUNT == 1) {
                                                        con.query(updateDebtQuery, function (err, result, fields) {
                                                            if (err) {
                                                                console.log(err);
                                                                return;
                                                            } else {
                                                                console.log("Debt successfully updated");
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                        //End
                                    }
                                });

                            });
                            //res.status(200).send(result_1);
                            res.status(200).send(api_response);
                            return;
                        }
                    });
                }
            });

        }
    });

});
module.exports = router;