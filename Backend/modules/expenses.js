'use strict';
const { CONNREFUSED } = require('dns');
const express = require('express');
const router = express.Router();
const con = require('./database');

router.post('/add',(req, res) => {
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

    const countGroupMembersQuery = "SELECT USER_ID FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'A' AND GROUP_ID = "+groupID;
    const selExpIDQuery = "SELECT MAX(EXP_ID) AS NEW_EXP_ID FROM EXPENSES WHERE GROUP_ID = "+groupID+" AND PAID_BY_USER_ID = "+userID;
    const addExpenseQuery = "INSERT INTO EXPENSES (DESCRIPTION, AMOUNT, GROUP_ID, PAID_BY_USER_ID, CREATED_AT, CURRENCY) VALUES ('"+description+"', "+amount+", "+groupID+", "+userID+", '"+ts+"', '"+currency+"')";

    con.query(countGroupMembersQuery, async function(err, result, fields){
        if(err){
            console.log("Error");
            res.status(500).send("Error while counting group members")
            return;
        }
        else{
            // const tran_amount = amount/result.length;
            const tran_amount_self = amount - (amount/result.length);
            const tran_amount_others = amount/result.length;
            let tran_amount = amount;
            result_1 = result;
            con.query(addExpenseQuery, function(err, result, fields){
                if(err){
                    console.log("Error while adding expense");
                    res.status(500).send("Error while adding expense");
                    return;
                } else{
                    console.log("Expense Added");
                    con.query(selExpIDQuery, function(err, result, fields){
                        if(err){
                            console.log("Error while getting expense id");
                            res.status(500).send("Error while getting expense id")
                            return;
                        }
                        else{
                            exp_id = result[0].NEW_EXP_ID
                            api_response = result[0];
                            result_1.forEach(element => {
                                if(element.USER_ID === userID){
                                    tran_type = 3;
                                    settled_flag = 'Y';
                                    tran_amount = tran_amount_self;
                                } else{
                                    tran_type = 6;
                                    settled_flag = 'N';
                                    tran_amount = tran_amount_others;
                                }
                                const addTransactionQuery = "INSERT INTO `TRANSACTION` (GROUP_ID, PAID_BY_USER_ID, PAID_FOR_USER_ID, AMOUNT, TRAN_TYPE, EXP_ID, SETTLED_FLAG) VALUES ("+groupID+", "+userID+", "+element.USER_ID+", "+tran_amount+", "+tran_type+", "+exp_id+", '"+settled_flag+"')";
                                con.query(addTransactionQuery, function(err, result, fields){
                                    if(err){
                                        console.log(err);
                                        //res.status(500).send("Error while adding transactions");
                                        return;
                                    } else{
                                        console.log("Transaction entry successful");
                                        //res.status(200).send(result);
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