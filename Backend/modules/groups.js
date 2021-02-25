'use strict'
const express = require('express');
const router = express.Router();
const con = require('./database');

router.post('/create', (req, res) => {
    const userID = req.body.userID
    const groupName = req.body.groupName
    const groupPicture = req.body.groupPicture
    const groupMembers = req.body.groupMembers
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const createGroupQuery = "INSERT INTO EXPENSE_GROUPS(GROUP_NAME, CREATED_BY, CREATE_DATE, GROUP_PICTURE) VALUES ('" + groupName + "'," + userID + ",'" + ts + "','" + groupPicture + "')";

    con.query(createGroupQuery, function (err, result, fields) {
        if (err) {
            console.log("error1");
            res.status(500).send('Error');
            return;
        }
        const mainUserAddQuery = "INSERT INTO USER_GROUP_MAP(USER_ID, GROUP_ID, ADDED_BY, ADDED_DATE, INVITE_FLAG, JOIN_DATE) SELECT EXPENSE_GROUPS.CREATED_BY, EXPENSE_GROUPS.GROUP_ID, EXPENSE_GROUPS.CREATED_BY, EXPENSE_GROUPS.CREATE_DATE, 'A', EXPENSE_GROUPS.CREATE_DATE FROM EXPENSE_GROUPS WHERE EXPENSE_GROUPS.GROUP_NAME = '" + groupName + "'";
        con.query(mainUserAddQuery, function (err, result, fields) {
            if (err) {
                console.log("error2");
                res.status(500).send('Error');
                return;
            }
            for (let i = 0; i < groupMembers.length; i++) {
                const memUserID = req.body.groupMembers[i].userID;
                const memAddQuery = "INSERT INTO USER_GROUP_MAP(USER_ID, GROUP_ID, ADDED_BY, ADDED_DATE, INVITE_FLAG) SELECT " + memUserID + ", EXPENSE_GROUPS.GROUP_ID, " + userID + ", '" + ts + "', 'P' FROM EXPENSE_GROUPS WHERE EXPENSE_GROUPS.GROUP_NAME = '" + groupName + "'";
                con.query(memAddQuery, function (err, result, fields) {
                    if (err) {
                        console.log("error3");
                        return;
                    }
                });
            }
            res.status(500).send("Group Created SuccessFully");

        });
    });
});

module.exports = router;